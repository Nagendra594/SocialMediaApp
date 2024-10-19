const messageModel = require("../Models/messagesModel");
exports.postNewMessage = async (req, res, next) => {
  try {
    const newMessage = new messageModel(req.body);
    const message = await newMessage.save();
    return res.status(200).json(message);
  } catch (err) {
    return res.status(500).json({ message: "an error occured" });
  }
};
exports.getMessages = async (req, res, next) => {
  try {
    const id = req.params.id;
    const messages = await messageModel.find({ conversationId: id });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ message: "an error occured" });
  }
};
