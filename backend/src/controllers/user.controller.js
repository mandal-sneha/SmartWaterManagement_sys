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
    const { username, userId, password, email, adhaarNumber } = req.body;
    const imageFile = req.files?.image;
    
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const imageUrl = await uploadToCloudinary(imageFile);

    const form = new FormData();
    form.append("image", imageFile.data, {
      filename: imageFile.name,
      contentType: imageFile.mimetype
    });
    
    const flaskRes = await axiosInstance.post("/extract-embedding", form, {
      headers: {
        ...form.getHeaders(),
        'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`
      },
      timeout: 30000 
    });
    
    const embedding = flaskRes.data.embedding;
    
    const newUser = new User({
      userName: username,
      userId: userId,
      email: email,
      password: hashedPassword,
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
        email: newUser.email,
        adhaarNumber: newUser.adhaarNumber,
        profilePhoto: imageUrl
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "Face recognition service unavailable"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.response?.data?.message || error.message
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    let user;
    
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ userId: identifier });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.userName,
        userId: user.userId,
        email: user.email,
        adhaarNumber: user.adhaarNumber,
        profilePhoto: user.userProfilePhoto
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error logging in", 
      error: error.message 
    });
  }
};

export const userLogout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please clear the token from localStorage."
  });
};