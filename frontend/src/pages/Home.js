import React, { useState } from "react";
import Chat from "../components/Chat";
import Create from "../components/documents/Create";
import Get from "../components/documents/Get";

const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showGet, setShowGet] = useState(true);

  const handleCreate = () => {
    setShowCreate(true);
    setShowGet(false);
  };
  return (
    <>
      <button className="btn btn-warning mt-4 ms-4" onClick={handleCreate}>
        Create Document
      </button>
      {showCreate ? (
        <Create setShowCreate={setShowCreate} setShowGet={setShowGet} />
      ) : (
        <Get />
      )}
    </>
  );
};

export default Home;
