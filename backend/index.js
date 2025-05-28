import express from "express";
import fileUpload from 'express-fileupload';
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./src/lib/db.js";

import userRoutes from "./src/routes/user.route.js";
import tenantRoutes from "./src/routes/tenant.route.js";
import propertyRoutes from "./src/routes/property.route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));

app.use(express.json());
app.use(fileUpload());  

app.use("/user", userRoutes);
app.use("/tenant", tenantRoutes);
app.use("/property", propertyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    ConnectDB();
});