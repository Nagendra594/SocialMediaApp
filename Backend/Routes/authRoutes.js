const express = require("express");

const router = express.Router();
const authControllers = require("../Controllers/authController");
router.post("/signup/newUser", authControllers.postSignup);
router.post("/login/user", authControllers.postLogin);
router.get("/logout", authControllers.postLogOut);
router.put("/updateUser/:id", authControllers.updateUser);
router.delete("/delete/:id", authControllers.deleteUser);
router.get("/getUser/main", authControllers.getUser);
router.get("/:id", authControllers.getUserFromID);
router.put("/:id/follow", authControllers.followUser);
router.put("/:id/followAccept", authControllers.followAccept);
router.put("/:id/followDecline", authControllers.followDecline);
router.put("/:id/unfollow", authControllers.unfollowUser);
router.get("/user/friends/:id", authControllers.userFriends);
router.get("/users/search/:keyword", authControllers.getUsers);
module.exports = router;
