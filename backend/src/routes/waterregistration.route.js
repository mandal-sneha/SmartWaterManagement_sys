import { Router } from "express";
import { registerForWater, getRegistrationDetails, getRequestStatus } from "../controllers/waterregistration.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:waterid/get-registration-details", middleware, getRegistrationDetails);
router.post("/:waterid/register-for-water", middleware, registerForWater);
router.get("/:waterid/request-status", middleware, getRequestStatus);

export default router;