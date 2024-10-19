const router = require("express").Router();

const conversationControllers = require("../Controllers/conversationController");

router.post("/:id", conversationControllers.postNewConv);
router.get("/", conversationControllers.getConv);

module.exports = router;
