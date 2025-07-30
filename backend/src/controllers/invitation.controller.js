import { User } from "../models/user.model.js";
import { Property } from "../models/property.model.js";
import { Invitation } from "../models/invitation.model.js";

export const viewInvitations = async (req, res) => {
    try {
        const { userid: userId } = req.params;

        const invitations = await Invitation.aggregate([
            {
                $addFields: {
                    guestsAsArray: { $objectToArray: "$invitedGuests" }
                }
            },
            {
                $match: {
                    "guestsAsArray.k": userId
                }
            }
        ]);

        if (!invitations || invitations.length === 0) {
            return res.status(200).json({
                success: true,
                invitations: [],
            });
        }

        const response = [];
        for (const invite of invitations) {
            const hostwaterId = invite.hostwaterId;

            if (!hostwaterId || typeof hostwaterId !== 'string') {
                continue;
            }
            
            const rootId = hostwaterId.split('_')[0];
            const property = await Property.findOne({ rootId: rootId });

            if (!property) {
                continue;
            }

            const host = await User.findOne({ userId: invite.hostId });

            const arrival = invite.arrivalTime ? invite.arrivalTime[userId] : null;
            const duration = invite.stayDuration ? invite.stayDuration[userId] : null;

            response.push({
                _id: invite._id,
                hostId: invite.hostId,
                propertyName: property.propertyName,
                municipality: property.municipality,
                district: property.district,
                arrivalTime: arrival,
                stayDuration: duration,
                userName: host ? host.userName : null,
                userProfilePhoto: host ? host.userProfilePhoto : null,
                invitedGuests: invite.invitedGuests
            });
        }

        res.status(200).json({
            success: true,
            invitations: response,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const registerinvitation = async (req, res) => {
    try {
        const { rootid } = req.params;
        const { guests, arrivalTime, stayDuration } = req.body;

        const property = await Property.findOne({ rootId: rootid });
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const invitation = new Invitation({
            hostpropertyId: rootid,
            guests,
            arrivalTime: new Map(Object.entries(arrivalTime)),
            stayDuration: new Map(Object.entries(stayDuration)),
            otp: new Map()
        });

        await invitation.save();

        res.status(201).json({
            success: true,
            message: "Invitation registered",
            invitationId: invitation._id
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const invitationStateUpdate = async (req, res) => {
    try {
        const { invitationid, userid } = req.params;
        const { status } = req.body;

        if (!status || !['accepted', 'declined'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status provided. Status must be 'accepted' or 'declined'."
            });
        }

        const invitation = await Invitation.findById(invitationid);

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found."
            });
        }

        if (!invitation.invitedGuests.has(userid)) {
            return res.status(403).json({
                success: false,
                message: "User is not part of this invitation."
            });
        }

        invitation.invitedGuests.set(userid, status);

        await invitation.save();

        res.status(200).json({
            success: true,
            message: "Invitation status updated successfully.",
            data: invitation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};