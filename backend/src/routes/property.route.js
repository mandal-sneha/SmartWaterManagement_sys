import { Router } from "express";
import { addProperty } from "../controllers/property.controller.js";

const router = Router();

router.post("/add-property", addProperty);

export default router;