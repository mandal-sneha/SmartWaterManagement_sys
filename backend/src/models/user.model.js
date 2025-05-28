import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },

    userId: {
        type: String,
        trim: true,
        required: true
    },

    houseNo: {
        type: String
    },

    userProfilePhoto: {
        type: String,
        required: false
    },

    adhaarNumber: {
        type: Number,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    tenantCode: {
        type: String,
        required: false
    },

    isTenant: {
        type: Boolean,
        required: false
    },

    waterId: {
        type: String,
        required: false
    },

    embeddingVector: {
        type: [],
        required: false 
    }

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);