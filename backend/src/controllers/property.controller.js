import { Property } from "../models/property.model.js";
import { User } from "../models/user.model.js";

const generateRootId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

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

export const addProperty = async (req, res) => {
  
};