const conversationModel = require("../Models/conversationsModel");

exports.postNewConv = async (req, res, next) => {
  try {
    const existingConversation = await conversationModel.findOne({
      $or: [
        {
          $and: [
            { senderId: req.session.user._id },
            { receiverId: req.params.id },
          ],
        },
        {
          $and: [
            { senderId: req.params.id },
            { receiverId: req.session.user._id },
          ],
        },
      ],
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }
    const newConversation = new conversationModel({
      receiverId: req.params.id,
      senderId: req.session.user._id,
    });
    const conversation = await newConversation.save();
    return res.status(200).json(conversation);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "an error Occured" });
  }
};
exports.getConv = async (req, res, next) => {
  const id = req.session.user._id;
  if (!id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const conversations = await conversationModel.find({
      $or: [{ senderId: id }, { receiverId: id }],
    });
    return res.status(200).json(conversations);
  } catch (err) {
    return res.status(500).json({ message: "an error occured" });
  }
};
