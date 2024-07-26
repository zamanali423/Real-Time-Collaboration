import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../context/userContext/userContext";

const Signup = () => {
  const { setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [inputData, setinputData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setinputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  //! submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fetchData = await fetch(
        "http://localhost:3001/auth/users/register/newUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputData }),
        }
      );
      const data = await fetchData.json();
      if (!fetchData.ok) {
        return toast.error(data.msg);
      } else {
        const token = data.token;
        setToken(token);
        localStorage.setItem("token", token);
        navigate("/");
        toast.success(data.msg);
      }

    } catch (error) {
      console.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="big">
      <div className="wrapper1">
        <h2>Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter your name"
              required
              name="fullName"
              value={inputData.fullName}
              onChange={handleInput}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter your email"
              required
              name="email"
              value={inputData.email}
              onChange={handleInput}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Create password"
              required
              name="password"
              value={inputData.password}
              onChange={handleInput}
            />
          </div>
          <div className="input-box button">
            <input type="Submit" value="Register Now" />
          </div>
          <div className="text">
            <h3>
              Already have an account? <Link to="/login">Login now</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
