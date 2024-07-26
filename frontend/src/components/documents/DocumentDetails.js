import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../context/userContext/userContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import Users from "../Users";
import { toast } from "react-toastify";

const DocumentDetails = () => {
  const { user, logout } = useContext(userContext);
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [accessId, setAccessId] = useState("");
  const navigate = useNavigate();

  const handleExpiredToken = async (response) => {
    const data = await response.json();
    if (data.msg === "Token Expired. Please log in again.") {
      logout();
      navigate("/login");
    } else {
      console.error("Unauthorized access");
    }
  };

  //! get documents
  const fetchDocument = async () => {
    if (!user) {
      console.error("User not available");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/documents/${documentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 401) {
        handleExpiredToken(response);
      } else if (response.ok) {
        const doc = await response.json();
        setDocument(doc);
      } else {
        const error = await response.json();
        console.error("Error:", error.msg);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  //! update document
  const accessToDoc = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/documents/accessTo/${documentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      setAccessId(userId);
      const updateDoc = await response.json();
      toast.info(updateDoc.msg);
      console.log("updateDoc", updateDoc);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  if (!document) return <div>Loading...</div>;

  return (
    <>
      <div className="container">
        <header className="header">
          <h1>Document Details</h1>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Give Access
          </button>
        </header>

        <section className="document-details">
          <h2>
            Title: <span id="document-title">{document.title}</span>
          </h2>
          <p>
            <strong>Introduction:</strong>{" "}
            <span
              id="document-intro"
              dangerouslySetInnerHTML={{
                __html: document.intro,
              }}
            />
          </p>
          <p>
            <strong>Objectives:</strong>{" "}
            <span id="document-objectives">{document.objectives}</span>
          </p>
          <p>
            <strong>Scope:</strong>{" "}
            <span id="document-scope">{document.scope}</span>
          </p>
          <p>
            <strong>Timeline:</strong>{" "}
            <span id="document-timeline">{document.timeline}</span>
          </p>
          <p>
            <strong>Budget:</strong>{" "}
            <span id="document-budget">{document.budget}</span>
          </p>
        </section>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                What do you want to send a message to?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Users accessToDoc={accessToDoc} accessId={accessId} />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentDetails;
