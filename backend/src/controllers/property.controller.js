import { Property } from "../models/property.model.js";
import { User } from "../models/user.model.js";

export const viewProperties = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ userId: userid });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const properties = await Property.find({ rootId: { $in: user.properties || [] } });
    const enriched = properties.map((prop) => ({
      ...prop.toObject(),
      tenantCount: Math.max((prop.numberOfTenants || 1) - 1, 0)
    }));

    return res.status(200).json({ success: true, properties: enriched });
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
      exactLocation,
      idType,
      id
    } = req.body;

    if (!propertyName || !district || !municipality || !wardNumber || !typeOfProperty) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (typeOfProperty !== "Personal Property" && typeOfProperty !== "Apartment") {
      return res.status(400).json({ success: false, message: "Invalid property type" });
    }

    if (!id || !id.trim()) {
      const fieldName = typeOfProperty === "Personal Property" ? "Holding number" : "Flat ID";
      return res.status(400).json({ success: false, message: `${fieldName} is required` });
    }

    const user = await User.findOne({ userId: userid });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const propertyIdType = typeOfProperty === "Personal Property" ? "holdingNumber" : "flatId";
    const propertyId = id.trim();

    const existingProperty = await Property.findOne({ 
      idType: propertyIdType,
      id: propertyId
    });

    if (existingProperty) {
      const fieldName = typeOfProperty === "Personal Property" ? "holding number" : "flat ID";
      return res.status(400).json({ success: false, message: `A property with this ${fieldName} already exists` });
    }

    const rootId = generateRootId();
    const tenantCode = "000";
    const waterId = `${rootId}_${tenantCode}`;

    const newPropertyFields = {
      propertyName: propertyName.trim(),
      district: district.trim(),
      municipality: municipality.trim(),
      wardNumber: parseInt(wardNumber),
      rootId,
      numberOfTenants: 1,
      families: [],
      typeOfProperty,
      idType: propertyIdType,
      id: propertyId,
      exactLocation: exactLocation || ""
    };

    const newProperty = new Property(newPropertyFields);
    await newProperty.save();

    user.tenantCode = tenantCode;
    user.waterId = waterId;
    user.properties = [...(user.properties || []), rootId];
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
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'idType' || field === 'id'
        ? "A property with these details already exists"
        : "A property with these details already exists";
      
      return res.status(400).json({ 
        success: false, 
        message 
      });
    }
    
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