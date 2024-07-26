import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext/userContext";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const { setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [inputData, setinputData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setinputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fetchData = await fetch("http://localhost:3001/auth/users/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      const data = await fetchData.json();
      console.log(data)
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
      toast.error(error.message || "Login failed");
      console.error("Login failed", error);
    }
  };
  return (
    <>
      <div className="container2">
        <div className="wrapper">
          <div className="title">
            <span>Login</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <FontAwesomeIcon className="icon" icon={faEnvelope} />
              <input
                type="text"
                placeholder="Email"
                required
                name="email"
                value={inputData.email}
                onChange={handleInput}
              />
            </div>
            <div className="row">
              <FontAwesomeIcon className="icon" icon={faLock} />
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={inputData.password}
                onChange={handleInput}
              />
            </div>

            <div className="pass">
              <Link href="#">Forgot password?</Link>
            </div>
            <div className="row button">
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Not a member? <Link to="/register">Signup</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
