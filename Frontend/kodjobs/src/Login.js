import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      alert(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <h2>Sign in</h2>
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <button className="forgot-password" onClick={() => alert("Forgot Password Clicked!")}>
  Forgot password?
</button>
        </div>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
