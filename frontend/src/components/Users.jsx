import { useEffect, useReducer } from "react";
import api from "../api";
import UserTable from "../components/UserTable";

const initialUsers = [];

const reducer = (state, action) => {
  switch (action.type) {
    case "Listusers":
      return action.payload;
    case "deleteuser":
      return state.filter(user => user.id !== action.payload);
    default:
      return state;
  }
};

const User = () => {
  const [users, dispatch] = useReducer(reducer, initialUsers);

  const fetchUsers = async () => {
    try {
      const response = await api.get("users/list/");
      dispatch({ type: "Listusers", payload: response.data });
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get current user from localStorage (or context if you use it)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div>
      <h2>User Management</h2>
      <UserTable users={users} dispatch={dispatch} currentUser={currentUser} />
    </div>
  );
};

export default User;
