import { useState } from "react";
import Form from "../components/Forms";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [mode, setMode] = useState("login"); // login | register | forgot | reset

  const getFormProps = () => {
    switch (mode) {
      case "register":
        return { route: "users/register/", isLogin: false };
      case "reset":
        return { route: "users/reset/", isLogin: false };
      case "forgot":
        return { route: "users/forgot/", isLogin: false };
      default:
        return { route: "token/", isLogin: true };
    }
  };

  return (
    <div>
      <h1>
        {mode === "login"
          ? "Login"
          : mode === "register"
          ? "Register"
          : mode === "forgot"
          ? "Forgot Password"
          : "Reset Password"}
      </h1>

      <Form {...getFormProps()} />

      <div style={{ marginTop: "20px" }}>
        {mode === "login" && (
          <>
            <p>
              Don't have an account?{" "}
              <button onClick={() => setMode("register")}>
                Register
              </button>
            </p>
            <p>
              <Link to="#" onClick={() => setMode("forgot")}>
                Forgot Password?
              </Link>
            </p>
          </>
        )}

        {mode !== "login" && (
          <p>
            <button onClick={() => setMode("login")}>
              Back to Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
