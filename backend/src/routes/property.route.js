import { Router } from "express";
import { addProperty, viewProperties, deleteProperty } from "../controllers/property.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:userid/view-properties", middleware, viewProperties);
router.post("/:userid/add-property", middleware, addProperty);
router.delete("/:rootid/delete-property", middleware, deleteProperty);

export default router;