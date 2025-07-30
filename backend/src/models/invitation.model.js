import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    hostwaterId: {
        type: String,
    },

    hostId: {
        type: String,
        required: true
    },

    invitedGuests: {
        type: Map,
        of: String
    },

    arrivalTime: {
        type: Map,
        of: String
    },

    stayDuration: {
        type: Map,
        of: String
    },

    otp: {
        type: Map, 
        of: String
    }
}, { timestamps: true }); 

export const Invitation = mongoose.model("Invitation", invitationSchema);