import { Property } from "../models/property.model.js";
import { User } from "../models/user.model.js";

export const viewProperties = async (req, res) => {
  try {
    const { userid } = req.params;
    console.log(req.params);
    console.log('Fetching properties for userId:', userid);
    
    const user = await User.findOne({ userId: userid });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.properties || user.properties.length === 0) {
      return res.status(200).json({ success: true, properties: [] });
    }

    let properties = await Property.find({ 
      rootId: { $in: user.properties } 
    });

    if (properties.length === 0) {
      properties = await Property.find({ 
        rootId: { $in: user.properties } 
      });
    }

    return res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error('Error in viewProperties:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const generateRootId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const addProperty = async (req, res) => {
  try {
    const { userid } = req.params;
    const {
      propertyName,
      district,
      municipality,
      wardNumber,
      typeOfProperty,
      holdingNumber,
      flatId,
      exactLocation
    } = req.body;

    if (!propertyName || !district || !municipality || !wardNumber || !typeOfProperty) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (typeOfProperty !== "Personal Property" && typeOfProperty !== "Apartment") {
      return res.status(400).json({ success: false, message: "Invalid property type" });
    }

    if (typeOfProperty === "Personal Property" && !holdingNumber) {
      return res.status(400).json({ success: false, message: "Holding number is required for personal property" });
    }

    if (typeOfProperty === "Apartment" && !flatId) {
      return res.status(400).json({ success: false, message: "Flat ID is required for apartment" });
    }

    const user = await User.findOne({ userId: userid });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const rootId = generateRootId();

    const tenantCode = '000';

    const newProperty = new Property({
      propertyName,
      district,
      municipality,
      wardNumber,
      holdingNumber: typeOfProperty === "Personal Property" ? holdingNumber : undefined,
      flatId: typeOfProperty === "Apartment" ? flatId : undefined,
      rootId,
      numberOfTenants: 1,
      families: [],
      typeOfProperty,
      exactLocation: exactLocation || ""
    });

    await newProperty.save();

    const waterId = `${rootId}_${tenantCode}`;

    user.tenantCode = tenantCode;
    user.waterId = waterId;
    user.properties = user.properties ? [...user.properties, rootId] : [rootId];

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: newProperty,
      user: {
        userId: user.userId,
        waterId: user.waterId,
        tenantCode: user.tenantCode,
        properties: user.properties
      }
    });

  } catch (error) {
    console.error("Error in addProperty:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { rootid } = req.params;

    const property = await Property.findOne({ rootId: rootid });

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    await Property.deleteOne({ rootId: rootid });

    await User.updateMany(
      { properties: rootid },
      { $pull: { properties: rootid } }
    );

    return res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProperty:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};