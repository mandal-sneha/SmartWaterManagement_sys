import { User } from "../models/user.model.js";
import { Family } from "../models/family.model.js";
import { Property } from "../models/property.model.js";
import { Invitation } from "../models/invitation.model.js";
import { Verification } from "../models/verification.model.js";
import { generateToken } from "../utils/generate.token.js";
import { axiosInstance } from "../lib/axios.js";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import dotenv from "dotenv";
import streamifier from "streamifier";
import moment from "moment-timezone";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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
      verificationPhoto: "",
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

export const verifyEmail = async (req, res) => {
  try {
    const { useremail } = req.params;

    if (!useremail) {
      return res.status(400).json({ message: "Email parameter is missing." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await Verification.findOneAndUpdate(
      { email: useremail },
      { otp, expiry },
      { new: true, upsert: true }
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"HydraOne" <${process.env.EMAIL_USER}>`,
      to: useremail,
      subject: "Email Verification - One-Time Password",
      html: `
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Inter', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header with gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">HydraOne</h1>
                <div style="width: 60px; height: 3px; background: rgba(255,255,255,0.3); margin: 15px auto; border-radius: 2px;"></div>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">Verify Your Account</h2>
                    <p style="color: #718096; font-size: 16px; margin: 0;">Enter this code to complete your verification</p>
                </div>
                
                <!-- OTP Display -->
                <div style="text-align: center; margin: 40px 0;">
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 30px; display: inline-block; position: relative;">
                        <div style="position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; z-index: -1; opacity: 0.1;"></div>
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">${otp}</span>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                        ⏰ This code expires in 10 minutes for your security
                    </p>
                </div>
                
                <p style="color: #718096; font-size: 14px; text-align: center; margin: 30px 0 0 0; line-height: 1.6;">
                    Didn't request this? You can safely ignore this email or 
                    <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">contact support</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} HydraOne. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
   `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Verification OTP has been sent to ${useremail}.`,
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the verification email.",
      error: error.message,
    });
  }
};

export const addFamilyMember = async (req, res) => {
  try {
    const { userid, memberid } = req.params;

    const user = await User.findOne({ userId: userid });
    if (!user) {
      return res.status(404).json({ message: "Adding user not found" });
    }

    const { tenantCode, waterId } = user;

    const member = await User.findOne({ userId: memberid });
    if (!member) {
      return res.status(404).json({ message: "Member user not found" });
    }

    const rootId = waterId.split("_")[0];

    member.tenantCode = tenantCode;
    member.waterId = waterId;

    if (!member.properties.includes(rootId)) {
      member.properties.push(rootId);
    }

    await member.save();

    res
      .status(200)
      .json({ message: "Family member added successfully", member });
  } catch (error) {
    console.error("Error adding family member:", error);
    res
      .status(500)
      .json({ message: "Server error while adding family member" });
  }
};

export const getCurrentDayGuests = async (req, res) => {
  try {
    const { waterid } = req.params;

    const invitation = await Invitation.findOne({ hostwaterId: waterid }).lean();

    if (!invitation) {
      return res.status(200).json([]);
    }

    const invitedGuests = invitation.invitedGuests || {};
    const arrivalTime = invitation.arrivalTime || {};
    const stayDuration = invitation.stayDuration || {};

    const guestIds = Object.keys(invitedGuests);

    if (!guestIds.length) {
      return res.status(200).json([]);
    }

    const users = await User.find({ userId: { $in: guestIds } })
      .lean()
      .select("userId userName userProfilePhoto");

    const payload = users.map((u) => ({
      userId: u.userId,
      userName: u.userName,
      userProfilePhoto: u.userProfilePhoto,
      arrivalTime: arrivalTime[u.userId] || "",
      stayDuration: (stayDuration[u.userId] || "").replace(/\s*day$/i, ""),
      status: invitedGuests[u.userId] || ""
    }));

    return res.status(200).json(payload);

  } catch (e) {
    console.error("Error in getCurrentDayGuests:", e);
    return res.status(500).json({ message: e.message });
  }
};

export const viewInvitedGuests = async (req, res) => {
  try {
    const { waterid } = req.params;

    const invitations = await Invitation.find({ hostwaterId: waterid });

    const invitedGuests = [];

    for (const invitation of invitations) {
      if (!Array.isArray(invitation.invitedGuests)) continue;

      for (const userId of invitation.invitedGuests) {
        const user = await User.findOne(
          { userId },
          { userId: 1, userName: 1, userProfilePhoto: 1 }
        );

        if (user) {
          invitedGuests.push({
            userId: user.userId,
            userName: user.userName,
            userProfilePhoto: user.userProfilePhoto,
            arrivalTime: invitation.arrivalTime?.get(userId) || null,
            stayDuration: invitation.stayDuration?.get(userId) || null,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      invitedGuests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const viewMonthwiseDetails = async (req, res) => {
  try {
    const { waterid } = req.params;
    const [rootId, tenantCode] = waterid.split("_");

    const family = await Family.findOne({
      rootId: rootId,
      tenantCode: tenantCode,
    });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    const currentYear = new Date().getFullYear();
    const monthlyAggregated = {};
    const monthlyDailyDetails = {};

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let month = 0; month < 12; month++) {
      const monthName = monthNames[month];
      monthlyAggregated[monthName] = {
        totalWaterUsed: 0,
        totalFines: 0,
      };
      monthlyDailyDetails[monthName] = {};
    }

    if (family.waterUsage && family.waterUsage.size > 0) {
      for (const [dateStr, usage] of family.waterUsage) {
        const date = new Date(dateStr);
        if (date.getFullYear() === currentYear) {
          const monthName = monthNames[date.getMonth()];
          const day = date.getDate();

          monthlyAggregated[monthName].totalWaterUsed += usage;

          if (!monthlyDailyDetails[monthName][day]) {
            monthlyDailyDetails[monthName][day] = {
              waterUsed: 0,
              guests: [],
            };
          }

          monthlyDailyDetails[monthName][day].waterUsed += usage;
        }
      }
    }

    if (family.guests && family.guests.size > 0) {
      for (const [dateStr, guestIds] of family.guests) {
        const date = new Date(dateStr);
        if (date.getFullYear() === currentYear) {
          const monthName = monthNames[date.getMonth()];
          const day = date.getDate();

          if (!monthlyDailyDetails[monthName][day]) {
            monthlyDailyDetails[monthName][day] = {
              waterUsed: 0,
              guests: [],
            };
          }

          if (Array.isArray(guestIds) && guestIds.length > 0) {
            const guestDetails = await User.find(
              { userId: { $in: guestIds } },
              { userId: 1, userName: 1, userProfilePhoto: 1 }
            );

            monthlyDailyDetails[monthName][day].guests = guestDetails.map(
              (guest) => ({
                userId: guest.userId,
                userName: guest.userName,
                userProfilePhoto: guest.userProfilePhoto,
              })
            );
          }
        }
      }
    }

    if (family.fineDates && Array.isArray(family.fineDates)) {
      family.fineDates.forEach((dateStr) => {
        const date = new Date(dateStr);
        if (date.getFullYear() === currentYear) {
          const monthName = monthNames[date.getMonth()];
          monthlyAggregated[monthName].totalFines += 1;
        }
      });
    }

    const aggregatedData = Object.entries(monthlyAggregated).map(
      ([monthName, data]) => ({
        month: monthName,
        totalWaterUsed: `${data.totalWaterUsed}L`,
        totalFines: data.totalFines,
      })
    );

    const dailyDetailsData = {};
    Object.entries(monthlyDailyDetails).forEach(([monthName, monthData]) => {
      dailyDetailsData[monthName] = Object.entries(monthData)
        .map(([day, dayData]) => ({
          day: parseInt(day),
          waterUsed: `${dayData.waterUsed}L`,
          guestCount: dayData.guests.length,
          guests: dayData.guests,
        }))
        .sort((a, b) => a.day - b.day);
    });

    return res.status(200).json({
      success: true,
      data: {
        aggregatedMonthlyData: aggregatedData,
        dailyDetailsData: dailyDetailsData,
      },
    });
  } catch (error) {
    console.error("Error in viewMonthwiseDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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

export const getProfileDetails = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findOne({ userId: userid }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const userDetails = {
      userName: user.userName,
      userId: user.userId,
      userProfilePhoto: user.userProfilePhoto,
      adhaarNumber: user.adhaarNumber,
      waterId: user.waterId,
    };

    const propertyRootIds = user.properties || [];

    const ownerPropertiesDocs = await Property.find({
      rootId: { $in: propertyRootIds },
    }).lean();

    const ownerProperties = ownerPropertiesDocs.map((p) => ({
      propertyName: p.propertyName,
      municipality: p.municipality,
      wardNumber: p.wardNumber,
      district: p.district,
      numberOfTenants: p.numberOfTenants,
      typeOfProperty: p.typeOfProperty,
      label: "owner",
    }));

    const waterIdParts = user.waterId?.split("_") || [];
    let tenantProperty = null;

    if (waterIdParts[1] && waterIdParts[1] !== "000") {
      const tenantRootId = waterIdParts[0];
      const tenantPropertyDoc = await Property.findOne({ rootId: tenantRootId }).lean();
      if (tenantPropertyDoc) {
        tenantProperty = {
          propertyName: tenantPropertyDoc.propertyName,
          municipality: tenantPropertyDoc.municipality,
          wardNumber: tenantPropertyDoc.wardNumber,
          district: tenantPropertyDoc.district,
          numberOfTenants: tenantPropertyDoc.numberOfTenants,
          typeOfProperty: tenantPropertyDoc.typeOfProperty,
          label: "tenant",
        };
      }
    }

    const properties = tenantProperty ? [...ownerProperties, tenantProperty] : ownerProperties;

    return res.status(200).json({
      user: userDetails,
      properties,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
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
      return res.status(200).json({
        success: true,
        members: [],
      });
    }

    const familyMembers = await User.find(
      { waterId },
      { userId: 1, userName: 1, userProfilePhoto: 1, adhaarNumber: 1, email: 1 }
    );

    const allFieldsMembers = await User.find({ waterId });

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

export const updateUserProfile = async (req, res) => {
  try {
    const { userid } = req.params;
    const { userName, userProfilePhoto, email, userId: newUserId } = req.body;

    const updateFields = {};
    if (userName !== undefined && userName !== null)
      updateFields.userName = userName;
    if (userProfilePhoto !== undefined && userProfilePhoto !== null)
      updateFields.userProfilePhoto = userProfilePhoto;

    if (email !== undefined && email !== null) {
      const existingEmailUser = await User.findOne({
        email,
        userId: { $ne: userid },
      });
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      updateFields.email = email;
    }

    if (newUserId !== undefined && newUserId !== null && newUserId !== userid) {
      const existingUserIdUser = await User.findOne({ userId: newUserId });
      if (existingUserIdUser) {
        return res.status(400).json({
          success: false,
          message: "User ID already exists",
        });
      }
      updateFields.userId = newUserId;
    }

    const existingUser = await User.findOne({ userId: userid });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.updateOne({ userId: userid }, { $set: updateFields });

    const updatedUser = await User.findOne({ userId: newUserId || userid });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};