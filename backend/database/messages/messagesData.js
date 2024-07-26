const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  documentId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  senderName: {
    type: String,
  },
  receiverId: {
    type: String,
  },
  messages: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  attachments: {
    type: String,
  },
});

module.exports = mongoose.model("messages", messagesSchema);
