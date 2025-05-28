import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
    members: {
        type: [],
        required: false,
    },

    rootId: {
        type: String,
        required: false,
    },

    tenantCode: {
        type: String,
        required: false,
    },

    numberOfGuests: {
        type: Map,
        of: Number,
        required: false,
    },

    extraWaterDates: {
        type: [String],
        required: false,
    },

    fineDates: {
        type: Map,
        of: Number,
        required: false,
    },

    waterUsage: {
        type: Map,
        of: Number,
        required: false,
    },

}, {timestamps: true});

export const Family = mongoose.model("Family", familySchema);