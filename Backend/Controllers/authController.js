const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
exports.postSignup = async (req, res, next) => {
  try {
    //gentering hashedPassword
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    //creating the new user
    const USER = new userModel({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    });
    await USER.save();
    return res.status(200).json(USER);
  } catch (err) {
    return res.status(422).json({ message: "invalid input" });
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(422).json({ message: "user not found" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(422).json({ message: "Invalid password" });
    }

    req.session.isLogged = true;
    req.session.user = user;
    await req.session.save();
    const { password: pass, createdAt, updatedAt, info, ...other } = user._doc;
    return res
      .status(200)
      .json({ message: "Login successfull", userDetails: other });
  } catch (err) {
    res.status(505).json({ message: err.message });
  }
};

exports.postLogOut = async (req, res, next) => {
  req.session?.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "server error" });
    }
    return res.status(200).json({ message: "logout success" });
  });
};

exports.updateUser = async (req, res, next) => {
  const loggedInUserId = req.body.userId;
  const queryID = req.params.id;
  if (loggedInUserId !== queryID) {
    return res.status(422).json({ message: "Can't update the different user" });
  }
  try {
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      req.body.password = hashedPassword;
    }
    await userModel.findByIdAndUpdate(queryID, { $set: req.body });
    return res.status(200).json({ message: "successfully updated the user" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const loggedInUserId = req.body.userId;
  const paramsId = req.params.id;
  if (loggedInUserId !== paramsId)
    return res.status(422).json({ message: "cant delete different user" });
  try {
    await userModel.findByIdAndDelete(loggedInUserId);
    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

exports.getUser = async (req, res, next) => {
  if (!req.session.isLogged || !req.session.user) {
    return res.status(401).json({ message: "Not Authenticted" });
  }

  try {
    const user = await userModel.findOne({ _id: req.session.user._id });
    if (!user) {
      return res.status(422).json({ message: "no user found" });
    }
    const { password, updatedAt, info, ...other } = user._doc;

    return res.status(200).json({ ...other, message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};
exports.getUserFromID = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(422).json({ message: "no user found" });
    }
    const { password, updatedAt, info, ...other } = user._doc;

    return res.status(200).json({ ...other, message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

exports.followUser = async (req, res, next) => {
  const followId = req.params.id;
  const userId = req.session?.user._id;
  if (followId === userId) {
    return res.status(403).json({ message: "Cant follow yourself" });
  }
  try {
    const presentUser = await userModel.findById(userId);
    const followUser = await userModel.findById(followId);
    if (!presentUser || !followUser) {
      return res.status(422).json({ message: "user not found" });
    }
    const isIncluded = presentUser.followings.filter((following) => {
      if (following.status === "success" && following.id === followId) {
        return true;
      }
      return false;
    });
    if (isIncluded.length > 0) {
      return res
        .status(422)
        .json({ message: "you already following that account" });
    }
    await presentUser.updateOne({
      $push: { followings: { id: followId, status: "pending" } },
    });
    await followUser.updateOne({
      $push: { followers: { id: userId, status: "pending" } },
    });
    return res.status(200).json({ message: "status success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.followAccept = async (req, res, next) => {
  const acceptId = req.params.id;
  const userId = req.session.user._id;
  if (acceptId === userId.toString()) {
    return res.status(403).json({ message: "Cant follow yourself" });
  }
  try {
    const presentUser = await userModel.findById(userId);
    const acceptUser = await userModel.findById(acceptId);
    if (!presentUser || !acceptUser) {
      return res.status(422).json({ message: "user not found" });
    }
    const isIncluded = presentUser.followers.filter((follower) => {
      if (follower.status === "success" && follower.id === acceptId) {
        return true;
      }
      return false;
    });
    if (isIncluded.length > 0) {
      return res
        .status(422)
        .json({ message: "you already following that account" });
    }
    const presentUserFollowers = presentUser.followers;
    presentUserFollowers.forEach((follower) => {
      if (follower.id === acceptId) {
        follower.status = "success";
      }
    });
    await presentUser.save();
    const acceptUserFollowings = acceptUser.followings;
    acceptUserFollowings.forEach((following) => {
      if (following.id === userId.toString()) {
        following.status = "success";
      }
    });
    await acceptUser.save();

    return res.status(200).json({ message: "status success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.followDecline = async (req, res, next) => {
  const acceptId = req.params.id;
  const userId = req.session.user._id;

  if (acceptId === userId.toString()) {
    return res.status(403).json({ message: "Cant follow yourself" });
  }
  try {
    const presentUser = await userModel.findById(userId);
    const acceptUser = await userModel.findById(acceptId);
    if (!presentUser || !acceptUser) {
      return res.status(422).json({ message: "user not found" });
    }
    const isIncluded = presentUser.followers.filter((follower) => {
      if (follower.status === "success" && follower.id === acceptId) {
        return true;
      }
      return false;
    });
    if (isIncluded.length > 0) {
      return res
        .status(422)
        .json({ message: "you already following that account" });
    }
    presentUser.followers = presentUser.followers.filter(
      (follower) => follower.id !== acceptId
    );
    await presentUser.save();
    acceptUser.followings = acceptUser.followings.filter(
      (following) => following.id !== userId.toString()
    );
    await acceptUser.save();

    return res.status(200).json({ message: "status success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.unfollowUser = async (req, res, next) => {
  const unFollowId = req.params.id;
  const userId = req.session.user._id;
  if (unFollowId === userId.toString()) {
    return res.status(403).json({ message: "Cant unfollow yourself" });
  }
  try {
    const presentUser = await userModel.findById(userId);
    const unFollowUser = await userModel.findById(unFollowId);
    if (!presentUser || !unFollowUser) {
      return res.status(422).json({ message: "user not found" });
    }
    const presentUserFollowings = [];
    presentUser.followings.forEach((following) => {
      if (following.status === "success") {
        presentUserFollowings.push(following.id);
      }
    });
    const isIncluded = presentUserFollowings.includes(unFollowId);
    if (!isIncluded) {
      return res
        .status(422)
        .json({ message: "you already unfollowing that account" });
    }
    presentUser.followings = presentUser.followings.filter(
      (following) => following.id !== unFollowId
    );
    await presentUser.save();
    unFollowUser.followers = unFollowUser.followers.filter(
      (follower) => follower.id !== userId.toString()
    );
    await unFollowUser.save();

    return res.status(200).json({ message: "status success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.userFriends = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(422).json({ message: "No user Found" });
    }
    const userFollowings = [];
    const userFollowers = [];

    user.followings.forEach((following) => {
      if (following.status === "success") {
        userFollowings.push(following.id);
      }
    });
    user.followers.forEach((follower) => {
      if (follower.status === "success") {
        userFollowers.push(follower.id);
      }
    });
    const friendsList = await userModel
      .find({
        $or: [
          { _id: { $in: userFollowings } },
          { _id: { $in: userFollowers } },
        ],
      })
      .select(" profilePicture userName");
    return res.status(200).json(friendsList);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res, next) => {
  const keyWord = req.params.keyword;
  try {
    const users = await userModel
      .find({
        $and: [
          { userName: { $regex: `^${keyWord}`, $options: "i" } },
          { _id: { $ne: req.session.user?._id } },
        ],
      })
      .select("userName profilePicture");

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
