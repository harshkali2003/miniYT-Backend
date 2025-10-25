const mongoose = require("mongoose");
const likeData = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videos",
      required: true,
    },
  },
  { timestamps: true }
);

likeData.index({user : 1 , video : 1} , {unique : true})

module.exports = mongoose.model("likes", likeData);
