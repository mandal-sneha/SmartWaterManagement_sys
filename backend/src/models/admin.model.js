import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({}, {timestamps: true});

export const Admin = mongoose.model("Admin", adminSchema);