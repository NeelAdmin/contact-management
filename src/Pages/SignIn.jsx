import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
    const { email, password } = formData;
    let formErrors = { ...errors };

    // Validation
    if (!email) formErrors.email = "Email is required!";
    if (!password) formErrors.password = "Password is required!";

    // Set errors if any
    if (Object.values(formErrors).some((error) => error !== "")) {
      setErrors(formErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      document.cookie = "isLoggedIn=true; path=/";
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Sign-in successful!");
      navigate("/contacts");
    } else {
      formErrors.email = "Invalid credentials!";
      setErrors(formErrors);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account?{" "}
        <a onClick={() => navigate("/signup")}>Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;
