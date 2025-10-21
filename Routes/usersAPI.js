const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");

const router = express.Router();

const userModel = require("../Models/users");
const { generateToken, verifyToken } = require("../Middleware/jwtImplementation");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/sign", upload.single("file"), async (req, resp) => {
  try {
    const { name, email, password, phone_no } = req.body;

    if (!name || !email || !password || !phone_no) {
      return resp.status(400).json({ message: "all fields are required" });
    }

    if (!req.file) {
      return resp.status(400).json({ message: "all fields are required" });
    }

    const filename = req.file.filename;
    const filedata = `uploads/${filename}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return resp.status(401).json({ message: "email already exists" });
    }

    let data = await userModel({
      name,
      email,
      password: hashedPassword,
      phone_no,
      filename: filedata,
    });

    data = await data.save();
    const token = generateToken(data)
    data = data.toObject()
    delete data.password
    if (!data) {
      return resp.status(400).json({ message: "something went wrong" });
    }

    resp.status(201).json({ message: "success", data , token });
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

router.post("/log", async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ message: "all fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return resp.status(401).json({ message: "invalid email" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return resp.status(401).json({ message: "invalid password" });
    }

    const token = generateToken(user)
    let data = user.toObject();
    delete data.password;
    resp.status(200).json({ message: "success", data , token });
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

router.post("/google-login", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await users.findOne({ email: payload.email });
    if (!user) {
      user = await users.create({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    }

    const myToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "6h" }
    );

    res.json({ message: "success", data: user, token: myToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

router.get("/user/:id", verifyToken , async (req, resp) => {
  try {
    let data = await userModel.findById(req.params.id);
    if (!data) {
      return resp.status(400).json({ message: "something went wrong" });
    }
    resp.status(200).json({ message: "success", data });
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

router.put("/edit/:id", verifyToken , upload.single("file"), async (req, resp) => {
  try {
    const { name, email, password, phone_no } = req.body;
    if (!name || !email || !password || !phone_no) {
      return resp.status(400).json({ message: "all fields are required" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let updateData = { name, email, password: hashedPassword, phone_no };
    if (req.file) {
      (filename = req.file.filename), (filedata = `uploads/${filename}`);
      updateData.filename = filedata;
    }

    let data = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    if (!data) {
      return resp.status(404).json({ message: "user not found" });
    }

    resp.status(201).json({message : "success" , data})
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:id", verifyToken , async (req, resp) => {
  try {
    let data = await userModel.findByIdAndDelete({ _id: req.params.id });
    if (!data) {
      return resp.status(400).json({ message: "failed to delete user" });
    }
    resp.status(200).json({ message: "success", data });
  } catch (e) {
    resp.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
