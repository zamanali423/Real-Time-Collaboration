import React, { useContext } from "react";
import { userContext } from "../context/userContext/userContext";
import { useNavigate } from "react-router";

const Logout = () => {
  const { logout } = useContext(userContext);
  const navigate = useNavigate();

  const logOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <li className="logout" onClick={logOut}>
        Logout
      </li>
    </>
  );
};

export default Logout;
