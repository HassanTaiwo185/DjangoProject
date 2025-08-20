import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const ChatRoom = () => {
  const { roomId, standupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      setError(null);
      try {
        const res = await api.get(`chats/messages/standup/${standupId}/`);
        if (isMounted) setMessages(res.data);
      } catch {
        setError("Failed to fetch chat messages. Try again later");
      }
    };

    const connectSocket = () => {
      const token =
        localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
     const socket = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/${roomId}/?token=${token}`);
      socketRef.current = socket;

      let hasOpened = false; // track if onopen has fired

      socket.onopen = () => {
        hasOpened = true;
        setError(null);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (e) => {
        setError(null);
        try {
          const data = JSON.parse(e.data);

          if (data.type === "chat_message") {
            if (!data.id) return;
            setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
          } else if (data.type === "writing_active") {
            if (
              data.content === "typing" &&
              data.sender !== currentUser.username
            ) {
              setTypingUsers((prev) => new Set(prev).add(data.sender));
              setTimeout(() => {
                setTypingUsers((prev) => {
                  const copy = new Set(prev);
                  copy.delete(data.sender);
                  return copy;
                });
              }, 3000);
            }
          }
        } catch {
          setError("Server error");
        }
      };

      socket.onerror = () => {
        if (hasOpened) setError("Connection error. Try again later");
      };

      socket.onclose = () => {
        if (isMounted) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectSocket();
          }, 5000);
        }
      };
    };

    fetchMessages();
    connectSocket();

    return () => {
      isMounted = false;
      socketRef.current?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [roomId, standupId, currentUser.id, currentUser.username]);

  const sendMessage = () => {
    setError(null);
    if (!input.trim() || socketRef.current?.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(JSON.stringify({ type: "message", content: input.trim() }));
    setInput("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await api.delete(`chats/messages/standup/delete/${id}/`);
      if (res.status === 200 || res.status === 204) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        setSelectedMessageId(null);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert("You are not authorized to delete this message.");
      } else {
        alert("Failed to delete message.");
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      if (handleInputChange.timeoutId) clearTimeout(handleInputChange.timeoutId);
      handleInputChange.timeoutId = setTimeout(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "update", content: "typing" }));
        }
      }, 300);
    }
  };

  // Deselect messages when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".message")) setSelectedMessageId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        Back
      </button>

      {error && (
        <div className="mb-2 flex justify-center">
          <div className="text-red-500 px-4 py-2 border border-red-300 bg-white rounded-md">
            {error}
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Chat Room</h2>

      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md p-4 space-y-2">
        {messages.map((msg) => {
          const isCurrentUser =
            msg.sender === currentUser.id || msg.sender === currentUser.username;
          return (
            <div
              key={msg.id || Math.random()}
              className={`message flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg cursor-pointer relative ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                } ${selectedMessageId === msg.id ? "ring-2 ring-blue-300" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMessageId(selectedMessageId === msg.id ? null : msg.id);
                }}
              >
                <p className="font-semibold text-sm">{msg.sender_username || msg.sender}</p>
                <p>{msg.content}</p>
                <span className="block text-xs text-gray-500 mt-1">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString()
                    : msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString()
                    : new Date().toLocaleTimeString()}
                </span>

                {selectedMessageId === msg.id && isCurrentUser && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md p-1 flex gap-2 z-10">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.size > 0 && (
        <div className="mt-2 italic text-gray-500">
          {Array.from(typingUsers).map((userId) => (
            <span key={userId} className="mr-2">
              {userId} is typing...
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
