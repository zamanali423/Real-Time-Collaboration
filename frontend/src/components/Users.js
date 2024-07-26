import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext/userContext";

const Users = ({ accessToDoc, accessId }) => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(userContext);

  const allUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/users");
      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  const sendReq = (user) => {
    accessToDoc(user._id);
  };

  useEffect(() => {
    allUsers();
  }, []);
  return (
    <>
      {users.map((users, i) => {
        return (
          <div key={i}>
            {user._id !== users._id ? (
              <button
                className="btn btn-primary"
                onClick={() => sendReq(users)}
                disabled={accessId === users._id}
              >
                {users.fullName}
              </button>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default Users;
