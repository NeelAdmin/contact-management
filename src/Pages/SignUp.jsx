import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error message when the user types
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    let formErrors = { ...errors };

    // Validation
    if (!name) formErrors.name = "Name is required!";
    if (!email) formErrors.email = "Email is required!";
    if (!password) formErrors.password = "Password is required!";
    if (!confirmPassword)
      formErrors.confirmPassword = "Confirm password is required!";
    if (password !== confirmPassword)
      formErrors.confirmPassword = "Passwords do not match!";

    // Set errors if any
    if (Object.values(formErrors).some((error) => error !== "")) {
      setErrors(formErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      formErrors.email = "User already exists!";
      setErrors(formErrors);
    } else {
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Sign-up successful!");
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword}</span>
        )}

        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a onClick={() => navigate("/")}>Sign In</a>
      </p>
    </div>
  );
};

export default SignUp;
