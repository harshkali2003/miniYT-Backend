const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const videoModel = require("../Models/videos");
const user = require("../Models/users");
const cloudinary = require("../Cloudinary/configFile");
const { default: mongoose } = require("mongoose");
const {verifyToken} = require('../Middleware/jwtImplementation')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./videos/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload/:id", verifyToken , upload.single("video"), async (req, resp) => {
  try {
    const validUser = await user.findById(req.params.id);
    if (!validUser) {
      return resp.status(403).json({ message: "Not a valid user" });
    }

    const { title, description, hashtags, uploadedBy, uploadedAt } = req.body;
    if (!title || !description || !hashtags || !uploadedBy || !uploadedAt) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return resp.status(400).json({ message: "Video file is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
    });

    const userId = new mongoose.Types.ObjectId(String(uploadedBy));

    let data = new videoModel({
      title,
      description,
      hashtags: hashtags.split(","),
      uploadedBy: userId,
      filename: result.secure_url,
      uploadedAt: uploadedAt || Date.now(),
    });

    await data.save();

    resp.status(201).json({ message: "success", data });
  } catch (e) {
    console.error("Upload Error:", e);
    resp.status(500).json({ message: e.message || "Internal server error" });
  }
});


// for homepage
router.get("/videos", async (req, resp) => {
  try {
    const videos = await videoModel
      .find()
      .populate("uploadedBy")
      .sort({ uploadedAt: -1 });
    resp.status(200).json(videos);
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

// used to get all videos
router.get("/homepageVideos", async (req, resp) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const videos = await videoModel
      .find()
      .limit(limit)
      .populate("uploadedBy")
      .sort({ uploadedAt: -1 });
    resp.status(200).json(videos);
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

// used to stream videos on larger page
router.get("/video/:id", async (req, resp) => {
  try {
    const video = await videoModel
      .findById(req.params.id)
      .populate("uploadedBy");
    if (!video) {
      return resp.status(404).json({ message: "Video not found" });
    }
    resp.status(200).json(video);
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

// users specific profile api
router.get("/videos/user/:userId", verifyToken , async (req, resp) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return resp.status(400).json({ message: "Invalid user ID" });
    }

    const videos = await videoModel
      .find({ uploadedBy: userId })
      .populate("uploadedBy")
      .sort({ uploadedAt: -1 });

    if (videos.length === 0) {
      return resp
        .status(404)
        .json({ message: "No videos found for this user" });
    }

    resp.status(200).json(videos);
  } catch (e) {
    console.error(e);
    resp.status(500).json({ message: "Internal server error" });
  }
});

// search api
router.get("/videos/search", async (req, resp) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return resp.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");
    let data = await videoModel
      .find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { hashtags: { $regex: searchRegex } },
        ],
      })
      .populate("uploadedBy")
      .sort({ uploadedAt: -1 });

    if (data.length === 0) {
      return resp.status(404).json({ message: "No videos found" });
    }

    resp.status(200).json(data);
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
