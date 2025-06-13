import { User } from '../models/user.model.js';
import { Property } from '../models/property.model.js';
import { Family } from '../models/family.model.js';

export const getPropertyTenants = async (req, res) => {
    try {
        const { propertyid } = req.params;

        if (!propertyid) {
            return res.status(400).json({
                success: false,
                message: "Property ID is required"
            });
        }

        const property = await Property.findById(propertyid);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        if (!property.families || property.families.length <= 1) {
            return res.status(200).json({
                success: true,
                tenants: [],
                message: "No tenants found for this property"
            });
        }

        const tenantWaterIds = property.families.slice(1); // Exclude root owner

        const tenants = [];

        for (let i = 0; i < tenantWaterIds.length; i++) {
            const waterId = tenantWaterIds[i];

            const user = await User.findOne({ waterId });

            if (user) {
                tenants.push({
                    name: user.userName,
                    userId: user.userId,
                    waterId: user.waterId,
                    image: user.userProfilePhoto
                });
            }
        }

        return res.status(200).json({
            success: true,
            tenants,
            count: tenants.length
        });

    } catch (error) {
        console.error("Error in getPropertyTenants:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const addTenant = async (req, res) => {
  try {
    const { propertyid, userid } = req.params;
    const { rootId } = req.body;

    if (!rootId) {
      return res.status(400).json({ success: false, message: "Missing rootId" });
    }

    const property = await Property.findById(propertyid);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const tenantUser = await User.findOne({ userId: userid });
    if (!tenantUser) {
      return res.status(404).json({ success: false, message: "Tenant user not found" });
    }

    const existingCodes = property.families.map(id => id.split('_')[1]);
    let nextCode = 0;
    while (existingCodes.includes(nextCode.toString().padStart(3, '0'))) nextCode++;

    const tenantCode = nextCode.toString().padStart(3, '0');
    const waterId = `${rootId}_${tenantCode}`;

    tenantUser.waterId = waterId;
    tenantUser.tenantCode = tenantCode;
    await tenantUser.save();

    await Family.create({ rootId, tenantCode });

    property.families.push(waterId);
    property.numberOfTenants = (property.numberOfTenants || 0) + 1;
    await property.save();

    return res.status(200).json({ success: true, message: "Tenant added successfully", waterId });
  } catch (error) {
    console.error("Error in addTenant:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
export const deleteTenant = async (req, res) => {
  try {
    const { propertyid, userid } = req.params;

    const property = await Property.findById(propertyid);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const user = await User.findOne({ userId: userid });
    if (!user || !user.waterId) {
      return res.status(404).json({ success: false, message: "User not found or not a tenant" });
    }

    const waterId = user.waterId;
    const rootId = waterId.split('_')[0];
    const tenantCode = waterId.split('_')[1];

    property.families = property.families.filter(id => id !== waterId);
    property.numberOfTenants = Math.max(0, (property.numberOfTenants || 1) - 1);
    await property.save();

    await Family.deleteOne({ rootId, tenantCode });

    user.waterId = "";
    user.tenantCode = "";
    await user.save();

    return res.status(200).json({ success: true, message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTenant:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};