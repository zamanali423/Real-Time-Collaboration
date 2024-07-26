import React, { useContext, useEffect } from "react";
import { userContext } from "../../context/userContext/userContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import io from "socket.io-client";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";

const socket = io("http://localhost:3001");

const UpdateTask = ({
  inputFields,
  setInputFields,
  setUserDocuments,
  getId,
}) => {
  const { user, logout } = useContext(userContext);
  const navigate = useNavigate();
  const handleInput = (e) => {
    const updatedDocument = { ...inputFields, [e.target.name]: e.target.value };
    setInputFields(updatedDocument);
    socket.emit("documentChange", updatedDocument);
  };

  const handleQuillChange = (value) => {
    setInputFields({ ...inputFields.intro, intro: DOMPurify.sanitize(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("User not available");
      return;
    }
    console.log("id", getId);
    if (!getId) {
      console.error("Document ID is missing");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/documents/updateDocument/${getId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(inputFields),
        }
      );

      if (response.status === 401) {
        const data = await response.json();
        if (data.msg === "Token Expired. Please log in again.") {
          logout();
          navigate("/login");
        } else {
          console.error("Unauthorized access");
        }
      } else {
        const updateDocument = await response.json();
        toast.success(updateDocument.msg);
        document.querySelector("#exampleModal .btn-close").click();
        socket.emit("documentChange", updateDocument.document);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  useEffect(() => {
    socket.on("documentUpdated", (updatedDocument) => {
      setUserDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc._id === updatedDocument._id ? updatedDocument : doc
        )
      );
    });

    return () => {
      socket.off("documentUpdated");
    };
  }, [setUserDocuments]);

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={inputFields.title}
          onChange={handleInput}
          required
        />

        <label htmlFor="intro">Introduction:</label>
        <ReactQuill
          style={{
            height: "90px",
            overflowY: "scroll",
            marginBottom: "10px",
          }}
          className="mt-4 w-100"
          theme="snow"
          value={inputFields.intro}
          onChange={handleQuillChange}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          }}
          placeholder="Type your introduction here..."
        />

        <label htmlFor="objectives">Objectives:</label>
        <input
          type="text"
          id="objectives"
          name="objectives"
          value={inputFields.objectives}
          onChange={handleInput}
          required
        />

        <label htmlFor="scope">Scope:</label>
        <input
          type="text"
          id="scope"
          name="scope"
          value={inputFields.scope}
          onChange={handleInput}
          required
        />

        <label htmlFor="timeline">Timeline:</label>
        <input
          type="text"
          id="timeline"
          name="timeline"
          value={inputFields.timeline}
          onChange={handleInput}
          required
        />

        <label htmlFor="budget">Budget:</label>
        <input
          type="text"
          id="budget"
          name="budget"
          value={inputFields.budget}
          onChange={handleInput}
          required
        />

        <button type="submit">Update Document</button>
      </form>
    </>
  );
};

export default UpdateTask;
