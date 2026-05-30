import { User } from "../models/user.model.js";
import { WaterRegistration } from "../models/waterregistration.model.js";
import { Property } from "../models/property.model.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getRegistrationDetails = async (req, res) => {
    try {
        const { waterid } = req.params;

        const currentIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const currentHour = currentIST.getHours(); 2;

        let slot;
        if (currentHour < 8) {
            slot = 8;
        } else if (currentHour < 12) {
            slot = 12;
        } else if (currentHour < 15) {
            slot = 15;
        } else {
            return res.status(200).json({
                success: true,
                data: {
                    primaryMembers: [],
                    invitedGuests: []
                }
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const registration = await WaterRegistration.findOne({ 
            waterId: waterid, 
            slot,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        if (!registration) {
            return res.status(200).json({
                success: true,
                data: {
                    primaryMembers: [],
                    invitedGuests: []
                }
            });
        }

        const { primaryMembers = [], specialMembers = [], invitedGuests = [] } = registration;

        const fetchUsers = async (userIds = []) => {
            const users = await User.find(
                { userId: { $in: userIds } },
                "userId userName userProfilePhoto"
            );
            return users.map(user => ({
                userId: user.userId,
                userName: user.userName,
                userProfilePhoto: user.userProfilePhoto,
                isSpecial: specialMembers.includes(user.userId)
            }));
        };

        const primaryMemberDetails = await fetchUsers(primaryMembers);
        const invitedGuestDetails = await fetchUsers(invitedGuests);

        res.status(200).json({
            success: true,
            data: {
                primaryMembers: primaryMemberDetails,
                invitedGuests: invitedGuestDetails,
                status: registration.status,
                rejectionReason: registration.rejectionReason,
                slot: registration.slot,
                extraWaterRequested: registration.extraWaterRequested
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const registerForWater = async (req, res) => {
    try {
        const { waterid } = req.params;
        const { primaryMembers, specialMembers, extraWaterRequested, guests } = req.body;

        if (!primaryMembers || !Array.isArray(primaryMembers) || primaryMembers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Primary members are required"
            });
        }

        const currentIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const currentHour = currentIST.getHours();

        let slot;
        if (currentHour < 8) {
            slot = 8;
        } else if (currentHour < 12) {
            slot = 12;
        } else if (currentHour < 15) {
            slot = 15;
        } else {
            return res.status(400).json({
                success: false,
                message: "No slots available for today"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existing = await WaterRegistration.findOne({ 
            waterId: waterid, 
            slot,
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `You already have a ${slot === 8 ? "8 AM" : slot === 12 ? "12 PM" : "3 PM"} slot registration for today. Please wait for admin approval or contact municipality.`
            });
        }

        const guestIds = guests && Array.isArray(guests) ? guests.map(g => g.userId) : [];

        const registration = new WaterRegistration({
            waterId: waterid,
            primaryMembers,
            specialMembers: specialMembers || [],
            invitedGuests: guestIds,
            slot,
            extraWaterRequested: !!extraWaterRequested,
            status: 'pending',
            submittedAt: new Date()
        });

        await registration.save();

        res.status(201).json({
            success: true,
            message: "Water registration submitted for admin approval",
            data: {
                slot: registration.slot,
                status: registration.status,
                submittedAt: registration.submittedAt
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getRequestStatus = async (req, res) => {
    try {
        const { waterid } = req.params;

        const currentIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const currentHour = currentIST.getHours();

        let slot;
        if (currentHour < 8) {
            slot = 8;
        } else if (currentHour < 12) {
            slot = 12;
        } else if (currentHour < 15) {
            slot = 15;
        } else {
            return res.status(200).json({
                success: true,
                data: {
                    hasRequest: false
                }
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const registration = await WaterRegistration.findOne({
            waterId: waterid,
            slot,
            createdAt: { $gte: today, $lt: tomorrow }
        }).sort({ createdAt: -1 });

        if (!registration) {
            return res.status(200).json({
                success: true,
                data: {
                    hasRequest: false
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                hasRequest: true,
                status: registration.status,
                rejectionReason: registration.rejectionReason,
                submittedAt: registration.submittedAt,
                respondedAt: registration.respondedAt,
                slot: registration.slot,
                extraWaterRequested: registration.extraWaterRequested
            }
        });

    } catch (error) {
        console.error("Error getting request status:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};