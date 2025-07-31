import { useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

const Form = ({ route, isLogin = true }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [code, setCode] = useState("")
  const [inviteToken, setInviteToken] = useState(null)
  const navigate = useNavigate();

  // validating password to meet up strong password protocol
  function validatePassword(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasUppercase && hasMinLength && hasNumber && hasSpecialChar;
  }

  // login user based on role
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(route, { username, password });
      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
        // getting current user signed in 
        const userResponse = await api.get("users/me/");
        const currentUser = userResponse.data;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        if (currentUser.role === "Team leader" ) {
          navigate("/teamleader/dashboard")
        } else {
          navigate("/member/dashboard");
        }
      } // handling response error based on status
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response?.status === 400) {
        setError("Please fill in all fields");
      } else if (err.response?.status === 403) {
        setError("Access denied");
        navigate('/')
      } else {
        setError("Something went wrong. Try again");
      }
    }
  };

  // registering new user 
  const createUser = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
      return;
    }

    try {
      const response = await api.post(route, {
        username,
        password,
        email,
        ...(inviteToken && { invite_token: inviteToken }),
      });
      if (response.status == 200 || response.status === 201) {
        localStorage.setItem("usernameForConfirm", username);
        navigate("/confirm/user");
      } // handling response error based on status
    } catch (err) {
      if (err.response?.status === 400) {
        const data = err.response.data;
        if (data.username && data.username[0].includes("exists")) {
          setError("Username already exists");
        } else {
          setError("Invalid input. Please check the form");
        }
      } else if (err.response?.status === 403) {
        setError("Access denied")
        navigate('/');
      } else {
        setError("Error. Please try again");
      }
    }
  };

  // confirm user email 
  const confirmUser = async (e) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the confirmation code.");
      return;
    }

    try {
      const username = localStorage.getItem("usernameForConfirm") || "";
      const response = await api.post(route, { username, code });
      if (response.status === 200) {
        navigate("/login");
      } // handling response error based on status
    } catch (err) {
      const data = err.response?.data;
      const status = err.response?.status;
      if (status === 400) {
        const message = data?.detail || data?.non_field_errors?.[0] || "Invalid or expired confirmation code.";
        setError(message);
      } else if (status === 403) {
        setError("Access denied");
        navigate('/');
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // requesting forgot password 
  const requestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await api.post(route, { email, username });
      if (response.status === 200) {
        alert("Reset code sent to your email.");
        const { username: resUsername, email: resEmail } = response.data;
        localStorage.setItem("resetUsername", resUsername);
        localStorage.setItem("resetEmail", resEmail);
        navigate("/reset/password");
      } // handling response error based on status
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 400 && data) {
        if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else {
          setError("An error occurred. Please check your input.");
        }
      } else if (err.response?.status === 403) {
        setError("Access denied");
        navigate('/')
      } else {
        setError("Something went wrong.");
      }
    }
  };

  // reset password after sucessful user validation 
  const resetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
      return;
    }

    try {
      const response = await api.post(route, {
        username,
        code,
        email,
        password,
        confirm_password: confirmPassword,
      });
      if (response.status === 200) {
        alert("Password reset successful.");
        navigate("/login");
      } // handling response error based on status
    } catch (err) {
      const data = err.response?.data;
      if (data?.non_field_errors || data?.detail || data?.error) {
        const message = data?.non_field_errors?.[0] || data?.detail || data?.error;
        setError(message);
      } else if (err.response?.status === 403) {
        setError("Access denied");
        navigate('/');
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}

      {/* FORGOT PASSWORD */}
      {route === "users/forgot/" && (
        <>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <button onClick={requestReset}>Send Reset Code</button>
        </>
      )}

      {/* RESET PASSWORD */}
      {route === "users/reset/" && (
        <>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit Code" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}

      {/* USERNAME FIELD */}
      {(isLogin || route === "users/register/") && (
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      )}

      {/* LOGIN PASSWORD FIELD */}
      {isLogin && (
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      )}

      {/* REGISTER FIELDS */}
      {!isLogin && !["users/confirm/", "users/reset/", "users/forgot/"].includes(route) && (
        <>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
        </>
      )}

      {/* CONFIRMATION CODE */}
      {route === "users/confirm/" && (
        <>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" />
        </>
      )}

      {/* BUTTONS */}
      {isLogin && <button onClick={login}>Login</button>}
      {!isLogin && route === "users/register/" && <button onClick={createUser}>Register</button>}
      {route === "users/confirm/" && <button onClick={confirmUser}>Confirm Account</button>}
    </div>
  );
};

export default Form;
