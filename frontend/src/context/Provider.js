import React, { useEffect, useState } from "react";
import { userContext } from "./userContext";

const Provider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [id, setId] = useState("");
  const [receiverId, setreceiverId] = useState("");

  let isLogin = !!token;

  const logout = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  //! Get User
  const authenticateUser = async () => {
    if (!token) {
      console.log("No token found, please login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/users/getUser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.log("Unauthorized access - Invalid token");
        } else {
          console.log("Failed to fetch user data:", res.status, res.statusText);
        }
        return;
      }

      const user = await res.json();
      console.log("user", user);
      setUser(user);
    } catch (error) {
      console.log("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);
  return (
    <userContext.Provider
      value={{
        logout,
        isLogin,
        user,
        setToken,
        token,
        id,
        setId,
        receiverId,
        setreceiverId,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default Provider;
