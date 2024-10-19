const router = require("express").Router();
const postControllers = require("../Controllers/postController");
router.post("/new", postControllers.newPost);
router.put("/update/:id", postControllers.updatePost);
router.delete("/delete/:id", postControllers.deletePost);
router.put("/:id", postControllers.interactToPost);
router.get("/:id", postControllers.getAPost);
router.get("/timeline/posts", postControllers.getTimeLinePosts);
router.get("/userPosts/posts/:id", postControllers.getUserAllPosts);

module.exports = router;
