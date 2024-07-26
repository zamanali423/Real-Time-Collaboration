import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { userContext } from "../context/userContext/userContext";
import { useNavigate } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const socket = io("http://localhost:3001"); // Ensure this matches your server's URL

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { id, user, receiverId } = useContext(userContext);
  const quillRef = useRef(null); // Create a ref for ReactQuill
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial messages for the document
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/messages/${id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Join the document room
    socket.emit("joinDocument", id);

    // Listen for real-time updates
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    if (id === "") {
      navigate("/");
    }

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveDocument", id);
    };
  }, [id, navigate]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    socket.emit("sendMessage", {
      documentId: id,
      senderId: user._id,
      senderName: user.fullName,
      receiverId: receiverId,
      messages: newMessage,
      timestamp: new Date(),
    });
    toast.success("Message Sended");
    setNewMessage(""); // Clear the editor
  };

  return (
    <>
      <div
        style={{ height: "250px", overflowY: "scroll", marginBottom: "10px" }}
      >
        {messages.map((msg) => (
          <div
            className="mt-2 ms-3"
            key={msg._id}
            style={{ padding: "10px 0 0 3px", borderBottom: "1px solid #ccc" }}
          >
            <strong>{msg.senderName}: </strong>
            <div
              className="ms-2"
              dangerouslySetInnerHTML={{ __html: msg.messages }}
              style={{ display: "inline-block" }}
            />
          </div>
        ))}
      </div>
      <ReactQuill
        className="mt-4 ms-3 w-50"
        theme="snow"
        value={newMessage}
        onChange={setNewMessage}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        }}
        placeholder="Type your message here..."
        ref={quillRef} // Attach ref to ReactQuill
      />
      <button className="mt-1 ms-3 btn btn-primary" onClick={handleSendMessage}>
        Send
      </button>
    </>
  );
};

export default Chat;
