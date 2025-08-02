import { Router } from "express";
import { registerForWater, getRegistrationDetails } from "../controllers/waterregistration.controller.js"

const router = Router();

router.get("/:waterid/get-registration-details", getRegistrationDetails);
router.post("/:waterid/register-for-water", registerForWater);

export default router;