import { Invitation } from "../models/invitation.model.js";
import { Property } from "../models/property.model.js";

export const viewInvitations = async (req, res) => {
    try {
        const { userid } = req.params;

        const invitations = await Invitation.find({ guests: userid });

        const response = [];

        for (const invite of invitations) {
            const property = await Property.findOne({ rootId: invite.hostpropertyId });

            if (!property) continue;

            const arrival = invite.arrivalTime?.get(userid) || null;
            const duration = invite.stayDuration?.get(userid) || null;

            response.push({
                propertyName: property.propertyName,
                municipality: property.municipality,
                district: property.district,
                arrivalTime: arrival,
                stayDuration: duration
            });
        }

        res.status(200).json({
            success: true,
            invitations: response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
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