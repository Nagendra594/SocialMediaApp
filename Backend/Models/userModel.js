const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followings: [
      {
        id: {
          type: String,
        },
        status: {
          type: String,
        },
      },
    ],
    followers: [
      {
        id: {
          type: String,
        },
        status: {
          type: String,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    info: {
      city: {
        type: String,
        max: 10,
      },
      from: {
        type: String,
        max: 10,
      },
      relationShip: {
        type: Number,
        enum: [1, 2, 3],
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
