const express = require("express");
const router = express.Router();
const Documents = require("../../database/documents/doumentsData");
const authenticateToken = require("../../middleware/authUser");
const userData = require("../../database/users/userData");

router.get("/getDocs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await Documents.find({
      $or: [{ owner: userId }, { accessTo: userId }],
    });
    return res.status(200).json(documents);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
});

//! Get Documents
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const document = await Documents.findOne({
      _id: req.params.id,
      $or: [{ owner: userId }, { accessTo: userId }],
    });

    if (!document) {
      return res.status(404).json({ msg: "document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Access of Documents
router.put("/accessTo/:id", authenticateToken, async (req, res) => {
  const { userId } = req.body; // User ID to add to the document
  try {
    const document = await Documents.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
        accessTo: { $ne: userId },
      },
      { $push: { accessTo: userId } },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({
        msg: "User already has access to this document or document not found",
      });
    }

    return res.status(200).json({ msg: "Access given to this user", document });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Create Documents
router.post("/createDocument", authenticateToken, async (req, res) => {
  const { title, intro, objectives, timeline, scope, budget } = req.body;
  try {
    const document = new Documents({
      title,
      intro,
      objectives,
      timeline,
      scope,
      budget,
      owner: req.user.id,
    });
    if (!document) {
      return res.status(202).json({ msg: "Document not create" });
    }
    await document.save();
    return res
      .status(201)
      .json({ msg: "Document created successfully", document });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Update Documents
router.put("/updateDocument/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, intro, objectives, timeline, scope, budget } = req.body;

  try {
    const document = await Documents.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { title, intro, objectives, timeline, scope, budget },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    req.io.emit("documentChange", document);
    return res
      .status(200)
      .json({ msg: "Document updated successfully", document });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Delete Documents
router.delete("/deleteDocument/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Documents.findByIdAndDelete({
      _id: id,
      owner: req.user.id,
    });
    return res
      .status(200)
      .json({ msg: "Document deleted successfully", document });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

module.exports = router;
