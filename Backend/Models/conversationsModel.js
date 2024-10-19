const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("conversation", conversationSchema);
