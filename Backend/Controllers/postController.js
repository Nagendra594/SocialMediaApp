const postModel = require("../Models/postModel");
const userModel = require("../Models/userModel");

let postsPerPage = 5;
exports.newPost = async (req, res, next) => {
  const image = req.file.key;
  const newPost = new postModel({ ...req.body, image });
  try {
    const post = await newPost.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};
exports.updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const requestedUserId = req.body.userId;
  try {
    const fetchedPost = await postModel.findById(postId);
    if (!fetchedPost) {
      return res.status(422).json({ message: "no post found" });
    }
    if (String(fetchedPost.userId) !== requestedUserId) {
      return res
        .status(403)
        .json({ message: "Cant update post which is not belongs to you" });
    }
    const { userId, ...other } = req.body;
    await fetchedPost.updateOne({ $set: other });
    return res.status(200).json({ message: "updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  const requestedUserId = req.body.userId;
  try {
    const fetchedPost = await postModel.findById(postId);

    if (!fetchedPost) {
      return res.status(422).json({ message: "no post found" });
    }
    if (String(fetchedPost.userId) !== requestedUserId) {
      return res
        .status(403)
        .json({ message: "Cant delete post which is not belongs to you" });
    }
    await fetchedPost.deleteOne();
    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.interactToPost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  try {
    const fetchedPost = await postModel.findById(postId);
    if (!fetchedPost) {
      return res.status(422).json({ message: "no post found to interact" });
    }
    if (fetchedPost.likes.includes(userId)) {
      await fetchedPost.updateOne({ $pull: { likes: userId } });
      return res
        .status(200)
        .json({ message: "Dislike the post is successfull" });
    }

    await fetchedPost.updateOne({ $push: { likes: userId } });
    return res.status(200).json({ message: "Like the post is successfull" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAPost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const fetchedPost = await postModel.findById(postId);
    if (!fetchedPost) {
      return res.status(422).json({ message: "no post found" });
    }
    return res.status(200).json(fetchedPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTimeLinePosts = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticted" });
  }
  const id = req.session.user._id;
  const pageNumber = req.query.page || 1;

  try {
    const skipItems = (pageNumber - 1) * postsPerPage;
    const currentUserFriends = await userModel
      .findById(id)
      .select("followings");

    const ids = [id];
    currentUserFriends.followings.forEach((following) => {
      if (following.status === "success") {
        ids.push(following.id);
      }
    });
    const fetchedPosts = await postModel
      .find({ userId: { $in: ids } })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(postsPerPage);

    return res.status(200).json(fetchedPosts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getUserAllPosts = async (req, res, next) => {
  const userId = req.params.id;
  const pageNumber = req.query.page || 1;
  try {
    const skipItems = (pageNumber - 1) * postsPerPage;

    const fetchedPosts = await postModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(postsPerPage);

    return res.status(200).json(fetchedPosts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
