import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = calculateAge(user.dob);

    try {
      const response = await axios.post("http://localhost:5000/register", { ...user, age });
      alert(response.data.message); // Show alert instead of changing UI
    } catch (error) {
      console.error("Error registering user", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="image-side"></div>
      <div className="find-your-text">FIND YOUR</div>

      <div className="form-side">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" name="dob" onChange={handleChange} required />
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="login-text">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
