import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    email: {
        type: String
    },

    otp: {
        type: Number
    },

    expiry: {
        type: Date
    }

}, { timestamps: true });

export const Verification = mongoose.model("Verification", verificationSchema);