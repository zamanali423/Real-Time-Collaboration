const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  objectives: {
    type: String,
  },
  scope: {
    type: String,
  },
  timeline: {
    type: String,
  },
  budget: {
    type: Number,
  },
  owner: {
    type: String,
  },
  accessTo: {
    type: String,
  },
});

module.exports = mongoose.model("documents", documentsSchema);
