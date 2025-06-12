import { Router } from "express";
import { addProperty, viewProperties, deleteProperty } from "../controllers/property.controller.js";

const router = Router();

router.get("/:userid/view-properties", viewProperties);
router.post("/:userid/add-property", addProperty);
router.delete("/:rootid/delete-property", deleteProperty);

export default router;