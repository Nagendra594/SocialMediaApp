const router = require("express").Router();
const messageControllers = require("../Controllers/messageControllers");
router.post("/", messageControllers.postNewMessage);
router.get("/:id", messageControllers.getMessages);

module.exports = router;
