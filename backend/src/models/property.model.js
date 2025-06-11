import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: true
    },

    rootId: {
        type: String,
        required: true,
    },

    district: {
        type: String,
        required: true,
    },

    municipality: {
        type: String,
        required: true,
    },

    wardNumber: {
        type: Number,
        required: true, 
    },

    holdingNumber: {
        type: String,
        unique: true,
        trim: true,
    },

    flatId: {
        type: String,
        unique: true,
        trim: true,
    },

    numberOfTenants: {
        type: Number,
        required: false,
    },

    families: {
        type: [],
        required: false,
    },

    typeOfProperty: {
        type: Boolean
    },

    exactLocation :{
        type: String,
        required: false
    }
    
}, {timestamps: true});

export const Property = mongoose.model("Property", propertySchema);