const express = require("express");
const router = express.Router();
const Messages = require("../../database/messages/messagesData");


// Get messages for a specific document
router.get("/:documentId", async (req, res) => {
  const { documentId } = req.params;
  try {
    const messages = await Messages.find({ documentId }).sort({ timestamp: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});



module.exports = router;
