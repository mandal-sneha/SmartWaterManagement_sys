import { User } from "../models/user.model.js";
import { Property } from "../models/property.model.js";
import { Invitation } from "../models/invitation.model.js";
import { WaterRegistration } from "../models/waterregistration.model.js";

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

export const registerInvitation = async (req, res) => {
  try {
    const { hostid, hostwaterid } = req.params;
    const { guests, arrivalTime, stayDuration } = req.body;

    if (
      !Array.isArray(guests) || guests.length === 0 ||
      typeof arrivalTime !== 'object' || !Object.keys(arrivalTime).length ||
      typeof stayDuration !== 'object' || !Object.keys(stayDuration).length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data format"
      });
    }

    const uniqueGuests = [...new Set(guests)];
    if (uniqueGuests.length !== guests.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate guest invitations are not allowed"
      });
    }

    const invitedGuests = {};
    for (const userId of uniqueGuests) {
      if (!arrivalTime[userId] || !stayDuration[userId]) {
        return res.status(400).json({
          success: false,
          message: `Missing arrivalTime or stayDuration for user ${userId}`
        });
      }
      invitedGuests[userId] = "pending";
    }

    const invitation = await Invitation.findOneAndUpdate(
      { hostwaterId: hostwaterid },
      {
        hostId: hostid,
        hostwaterId: hostwaterid,
        invitedGuests,
        arrivalTime,
        stayDuration,
        otp: {}
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: "Invitation registered or updated",
      invitationId: invitation._id
    });

  } catch (error) {
    console.error("Error in registerInvitation:", error);
    return res.status(500).json({
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

        if (status === 'declined') {
            invitation.invitedGuests.delete(userid);
            invitation.arrivalTime.delete(userid);
            invitation.stayDuration.delete(userid);
            invitation.otp.delete(userid);

            const isAllCleared =
                invitation.invitedGuests.size === 0 &&
                invitation.arrivalTime.size === 0 &&
                invitation.stayDuration.size === 0;

            if (isAllCleared) {
                await Invitation.findByIdAndDelete(invitationid);
                return res.status(200).json({
                    success: true,
                    message: "Invitation declined and deleted as no guests remain."
                });
            }
        } else {
            invitation.invitedGuests.set(userid, status);

            const waterReg = await WaterRegistration.findOne({ waterId: invitation.waterId });
            if (waterReg && !waterReg.invitedGuests.includes(userid)) {
                waterReg.invitedGuests.push(userid);
                await waterReg.save();
            }
        }

        await invitation.save();

        return res.status(200).json({
            success: true,
            message: "Invitation status updated successfully.",
            data: invitation
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};