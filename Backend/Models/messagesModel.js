const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("message", messageSchema);
