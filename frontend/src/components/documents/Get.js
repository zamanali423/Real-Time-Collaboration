import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../context/userContext/userContext";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faEye,
  faPenSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import Update from "./Update";

const GetTask = () => {
  const { user, logout, setId, setreceiverId } = useContext(userContext);
  const [userDocuments, setUserDocuments] = useState([]);
  const navigate = useNavigate();
  const [getId, setgetId] = useState("");
  const [inputFields, setInputFields] = useState({
    title: "",
    intro: "",
    objectives: "",
    timeline: "",
    scope: "",
    budget: "",
  });

  const handleExpiredToken = async (response) => {
    const data = await response.json();
    if (data.msg === "Token Expired. Please log in again.") {
      logout();
      navigate("/login");
    } else {
      console.error("Unauthorized access");
    }
  };

  const getDocuments = async () => {
    if (!user) {
      console.error("User not available");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/documents/getDocs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 401) {
        handleExpiredToken(response);
      } else {
        const documents = await response.json();
        if (Array.isArray(documents)) {
          console.log(documents);
          setUserDocuments(documents);
        } else {
          console.error("Unexpected response format", documents);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleUpdate = (document) => () => {
    if (!document) {
      console.error("Document is undefined");
      return;
    }
    const sanitizeHtml = (html) => {
      return DOMPurify.sanitize(html);
    };
    setgetId(document._id);
    setInputFields({
      title: document.title,
      intro: sanitizeHtml(document.intro),
      objectives: document.objectives,
      scope: document.scope,
      timeline: document.timeline,
      budget: document.budget,
    });
  };

  const deleteDocument = async (document) => {
    if (!user) {
      console.error("User not available");
      return;
    }
    if (!document || !document._id) {
      console.error("Document or document ID is undefined");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/documents/deleteDocument/${document._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 401) {
        handleExpiredToken(response);
      } else {
        const deletedDocument = await response.json();
        setUserDocuments((prevDocs) =>
          prevDocs.filter((t) => t._id !== document._id)
        );
        toast.success(deletedDocument.msg);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [user]);

  return (
    <>
      <div className="container">
        <h2>Document List</h2>
        <table className="task-table">
          <thead>
            <tr>
              <th>Doc #</th>
              <th>Title</th>
              <th>Introduction</th>
              <th>Objectives</th>
              <th>Scope</th>
              <th>Timeline</th>
              <th>Budget</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userDocuments &&
              userDocuments.map((doc, index) => (
                <tr key={doc._id}>
                  <td>{index + 1}</td>
                  <td>{doc.title}</td>
                  <td
                    className="w-25"
                    dangerouslySetInnerHTML={{
                      __html: doc.intro,
                    }}
                  />
                  <td>{doc.objectives}</td>
                  <td>{doc.scope}</td>
                  <td>{doc.timeline}</td>
                  <td>{doc.budget}</td>
                  <td>
                    <Link to={"/chat"}>
                      <FontAwesomeIcon
                        className="ms-1 icon"
                        icon={faComment}
                        onClick={() => {
                          setId(doc._id);
                          setreceiverId(doc.owner);
                        }}
                      />
                    </Link>
                    <Link to={`/documents/${doc._id}`}>
                      <FontAwesomeIcon className="ms-1 icon" icon={faEye} />
                    </Link>
                    <FontAwesomeIcon
                      className="ms-1 icon"
                      icon={faPenSquare}
                      onClick={handleUpdate(doc)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    />
                    <FontAwesomeIcon
                      className="ms-1 icon"
                      icon={faTrashAlt}
                      onClick={() => deleteDocument(doc)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
                Update Task
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Update
                inputFields={inputFields}
                setInputFields={setInputFields}
                setUserDocuments={setUserDocuments}
                getId={getId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetTask;
