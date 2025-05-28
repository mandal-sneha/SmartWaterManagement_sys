import { Property } from "../models/property.model.js";

const generateRootId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const addProperty = async(req, res) => {
    try {
        const { district, municipality, wardNumber, holdingNumber, flatId, numberOfTenants, families, typeOfProperty, exactLocation } = req.body;

        if (!district || !municipality || !wardNumber || typeOfProperty === undefined) {
            return res.status(400).json({
                success: false,
                message: "District, municipality, wardNumber and typeOfProperty are required"
            });
        }

        if (typeOfProperty === 0 && !holdingNumber) {
            return res.status(400).json({
                success: false,
                message: "Holding number is required for Personal House"
            });
        }

        if (typeOfProperty === 1 && !flatId) {
            return res.status(400).json({
                success: false,
                message: "Flat ID is required for Apartment"
            });
        }

        const rootId = generateRootId();

        const propertyData = {
            rootId,
            district,
            municipality,
            wardNumber,
            typeOfProperty,
            numberOfTenants,
            families,
            exactLocation
        };

        if (typeOfProperty === 0) {
            propertyData.holdingNumber = holdingNumber;
        } else {
            propertyData.flatId = flatId;
        }

        const property = new Property(propertyData);
        await property.save();

        res.status(201).json({
            success: true,
            message: "Property added successfully",
            data: property
        });
        
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}