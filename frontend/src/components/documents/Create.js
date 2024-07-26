import React, { useContext, useState } from "react";
import { userContext } from "../../context/userContext/userContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

const Tasks = ({ setShowCreate, setShowGet }) => {
  const { user, logout } = useContext(userContext);
  const navigate = useNavigate();
  const [inputFields, setInputFields] = useState({
    title: "",
    intro: "",
    objectives: "",
    timeline: "",
    scope: "",
    budget: "",
  });

  const handleInput = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (value) => {
    setInputFields({ ...inputFields, intro: DOMPurify.sanitize(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("User not available");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3001/documents/createDocument",
        {
          method: "POST",
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
        const document = await response.json();
        toast.success(document.msg);
        setInputFields({
          title: "",
          intro: "",
          objectives: "",
          timeline: "",
          scope: "",
          budget: "",
        });
        setShowCreate(false);
        setShowGet(true);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <div className="mainForm2">
      <div className="container2">
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>Create a Document</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={inputFields.title}
              onChange={handleInput}
              required
            />
          </div>
          <div
            className="form-group"
            style={{
              height: "150px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            <label htmlFor="intro">Introduction</label>
            <ReactQuill
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
          </div>
          <div className="form-group">
            <label htmlFor="objectives">Objectives</label>
            <input
              type="text"
              id="objectives"
              name="objectives"
              value={inputFields.objectives}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="scope">Scope</label>
            <input
              type="text"
              id="scope"
              name="scope"
              value={inputFields.scope}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeline">Timeline</label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={inputFields.timeline}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={inputFields.budget}
              onChange={handleInput}
              required
            />
          </div>
          <button className="button" type="submit">
            Create Document
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tasks;
