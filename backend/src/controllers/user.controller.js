import { User } from "../models/user.model.js";
import { Family } from "../models/family.model.js";
import { generateToken } from "../utils/generate.token.js";
import { axiosInstance } from "../lib/axios.js";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import dotenv from "dotenv";
import streamifier from "streamifier";
import moment from "moment-timezone";
import bcrypt from "bcryptjs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const convertMapToObject = (mapData) => {
  if (!mapData) return {};

  if (mapData.constructor === Object) return mapData;
  if (mapData instanceof Map) return Object.fromEntries(mapData);
  if (typeof mapData.toObject === "function") return mapData.toObject();
  if (typeof mapData.entries === "function")
    return Object.fromEntries(mapData.entries());

  return {};
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;

  const formats = [
    "YYYY-MM-DD",
    "MM-DD-YYYY",
    "DD-MM-YYYY",
    "YYYY/MM/DD",
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    moment.ISO_8601,
  ];

  for (const format of formats) {
    const date = moment(dateStr, format, true);
    if (date.isValid()) return date;
  }

  const date = moment(dateStr);
  return date.isValid() ? date : null;
};

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
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = await uploadToCloudinary(imageFile);

    const form = new FormData();
    form.append("image", imageFile.data, {
      filename: imageFile.name,
      contentType: imageFile.mimetype,
    });

    const flaskRes = await axiosInstance.post("/extract-embedding", form, {
      headers: {
        ...form.getHeaders(),
        "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
      },
      timeout: 30000,
    });

    const embedding = flaskRes.data.embedding;

    const newUser = new User({
      userName: username,
      userId: userId,
      email: email,
      password: hashedPassword,
      userProfilePhoto: imageUrl,
      adhaarNumber: Number(adhaarNumber),
      embeddingVector: embedding,
    });

    await newUser.save();

    const savedUser = await User.findById(newUser._id);

    const token = generateToken(savedUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        email: savedUser.email,
        userName: savedUser.userName,
        userId: savedUser.userId,
        waterId: savedUser.waterId || "",
      },
      token,
    });
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "Face recognition service unavailable",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.response?.data?.message || error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ userId: identifier });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        email: user.email,
        userName: user.userName,
        userId: user.userId,
        waterId: user.waterId,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findOne({ userId: userid }).select(
      "userProfilePhoto userId userName waterId properties"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userProfilePhoto: user.userProfilePhoto,
        userId: user.userId,
        userName: user.userName,
        waterId: user.waterId,
        properties: user.properties,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getFamilyMembers = async (req, res) => {
 try {
   const { userid } = req.params;

   const currentUser = await User.findOne({ userId: userid });

   if (!currentUser) {
     return res
       .status(404)
       .json({ success: false, message: "User not found" });
   }

   const { waterId } = currentUser;

   if (!waterId || waterId === "") {
     return res
       .status(200)
       .json({
         success: true,
         members: [],
       });
   }

   const familyMembers = await User.find(
     { waterId },
     { userId: 1, userName: 1, userProfilePhoto: 1, _id: 0 }
   );

   return res.status(200).json({
     success: true,
     members: familyMembers,
   });
 } catch (error) {
   console.error("Error in getFamilyMembers:", error);
   return res.status(500).json({
     success: false,
     message: "Internal server error",
   });
 }
};

export const addFamilyMember = async (req, res) => {
  try {

  } catch (error) {

  }
};

export const fetchDashboardDetails = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findOne({ userId: userid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.waterId) {
      return res.status(200).json({
        success: true,
        hasWaterId: false,
      });
    }

    const waterIdParts = user.waterId.split("_");
    if (waterIdParts.length < 2) {
      return res.status(200).json({
        success: true,
        hasWaterId: false,
      });
    }

    const [rootId, tenantCode] = waterIdParts;

    if (!rootId || !tenantCode) {
      return res.status(200).json({
        success: true,
        hasWaterId: false,
      });
    }

    const family = await Family.findOne({ rootId, tenantCode });

    if (!family) {
      return res.status(200).json({
        success: true,
        hasWaterId: true,
        waterUsedThisMonth: 0,
        waterUsedThisWeek: 0,
        guestsThisMonth: 0,
        billThisMonth: 0,
        lastMonthBill: 0,
        billStatus: "paid",
        dueDate: new Date().toISOString().split("T")[0],
        nextSupplyTime: "8 AM",
        hoursUntilNext: 0,
      });
    }

    const now = moment().tz("Asia/Kolkata");
    const currentMonth = now.format("YYYY-MM");
    const currentWeekStart = now.clone().startOf("week");
    const lastMonth = now.clone().subtract(1, "month").format("YYYY-MM");

    let waterUsedThisMonth = 0;
    let waterUsedThisWeek = 0;
    let lastMonthWaterUsage = 0;

    if (family.waterUsage) {
      try {
        const usageData = convertMapToObject(family.waterUsage);

        for (const [dateStr, usage] of Object.entries(usageData)) {
          if (!dateStr || (!usage && usage !== 0)) continue;

          const usageValue = Number(usage);
          if (isNaN(usageValue)) continue;

          const date = parseDate(dateStr);
          if (!date) continue;

          if (date.format("YYYY-MM") === currentMonth) {
            waterUsedThisMonth += usageValue;
          }
          if (date.isSameOrAfter(currentWeekStart, "day")) {
            waterUsedThisWeek += usageValue;
          }
          if (date.format("YYYY-MM") === lastMonth) {
            lastMonthWaterUsage += usageValue;
          }
        }
      } catch (error) {
        console.error("Error processing waterUsage:", error);
      }
    }

    let guestsThisMonth = 0;
    if (family.numberOfGuests) {
      try {
        const guestData = convertMapToObject(family.numberOfGuests);

        for (const [dateStr, guestCount] of Object.entries(guestData)) {
          if (!dateStr || (!guestCount && guestCount !== 0)) continue;

          const guestValue = Number(guestCount);
          if (isNaN(guestValue)) continue;

          const date = parseDate(dateStr);
          if (!date) continue;

          if (date.format("YYYY-MM") === currentMonth) {
            guestsThisMonth += guestValue;
          }
        }
      } catch (error) {
        console.error("Error processing numberOfGuests:", error);
      }
    }

    const billThisMonth = Math.max(0, Math.round(waterUsedThisMonth * 10));
    const lastMonthBill = Math.max(0, Math.round(lastMonthWaterUsage * 10));

    let dueDate;
    try {
      dueDate = `${now.format("YYYY")}-${now.format("MM")}-05`;
    } catch (error) {
      dueDate = new Date().toISOString().split("T")[0];
    }

    const supplyTimes = [
      { time: "08:00", display: "8 AM" },
      { time: "12:00", display: "12 PM" },
      { time: "15:00", display: "3 PM" },
    ];

    const currentHour = now.hour();
    const currentMinute = now.minute();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    let nextSupplyTime = "8 AM";
    let hoursUntilNext = 0;

    try {
      let foundNext = false;

      for (let supply of supplyTimes) {
        const [hour, minute] = supply.time.split(":").map(Number);
        const supplyTimeInMinutes = hour * 60 + minute;

        if (currentTimeInMinutes < supplyTimeInMinutes) {
          nextSupplyTime = supply.display;
          const minutesUntilNext = supplyTimeInMinutes - currentTimeInMinutes;
          hoursUntilNext = Math.max(1, Math.ceil(minutesUntilNext / 60));
          foundNext = true;
          break;
        }
      }

      if (!foundNext) {
        nextSupplyTime = "8 AM (Tomorrow)";
        const tomorrow8AM = now
          .clone()
          .add(1, "day")
          .startOf("day")
          .add(8, "hours");
        hoursUntilNext = Math.ceil(tomorrow8AM.diff(now, "minutes") / 60);
      }
    } catch (error) {
      console.error("Error calculating next supply time:", error);
      nextSupplyTime = "8 AM";
      hoursUntilNext = 0;
    }

    const responseData = {
      success: true,
      hasWaterId: true,
      waterUsedThisMonth: Math.round(waterUsedThisMonth * 100) / 100,
      waterUsedThisWeek: Math.round(waterUsedThisWeek * 100) / 100,
      guestsThisMonth: guestsThisMonth,
      billThisMonth: billThisMonth,
      lastMonthBill: lastMonthBill,
      billStatus: "paid",
      dueDate: dueDate,
      nextSupplyTime: nextSupplyTime,
      hoursUntilNext: hoursUntilNext,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching dashboard data",
      error: error.message,
    });
  }
};