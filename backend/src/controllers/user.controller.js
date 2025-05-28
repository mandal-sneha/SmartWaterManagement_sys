import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generate.token.js";
import { axiosInstance } from "../lib/axios.js";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user_profiles" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    
    streamifier.createReadStream(file.data).pipe(uploadStream);
  });
};

export const userSignup = async (req, res) => {
  try {
    const { username, userId, password, houseNo, address, pinCode, wardNumber, adhaarNumber } = req.body;
    const imageFile = req.files?.image;
    
    if (!imageFile) return res.status(400).json({ success: false, message: "Image is required" });
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const imageUrl = await uploadToCloudinary(imageFile);

    const form = new FormData();
    form.append("image", imageFile.data, imageFile.name);

    const flaskRes = await axiosInstance.post("/extract-embedding", form, {
      headers: form.getHeaders()
    });

    const embedding = flaskRes.data.embedding;
    
    const newUser = new User({
      userName: username,
      userId: userId,
      password: hashedPassword,
      houseNo: houseNo,
      address,
      pincode: pinCode,
      wardNumber,
      userProfilePhoto: imageUrl,
      adhaarNumber: Number(adhaarNumber),
      embeddingVector: embedding
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.userName,
        userId: newUser.userId,
        houseNo: newUser.houseNo,
        adhaarNumber: newUser.adhaarNumber,
        profilePhoto: imageUrl
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.response?.data || error.message
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    let user;
    
    if (/^\d+$/.test(identifier)) {
      user = await User.findOne({ adhaarNumber: Number(identifier) });
    } else {
      user = await User.findOne({ userName: identifier });
    }

    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);
      return res.json({
        success: true,
        message: "User logged in successfully",
        user: {
          id: user._id,
          username: user.userName,
          userId: user.userId,
          houseNo: user.houseNo,
          adhaarNumber: user.adhaarNumber
        },
        token
      });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging in", error: error.message });
  }
};

export const userLogout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please clear the token from localStorage."
  });
};