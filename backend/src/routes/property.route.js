import { Router } from "express";
import { addProperty, viewProperties } from "../controllers/property.controller.js";

const router = Router();

router.get("/:userid/view-properties", viewProperties);
router.post("/:userid/add-property", addProperty);

export default router;