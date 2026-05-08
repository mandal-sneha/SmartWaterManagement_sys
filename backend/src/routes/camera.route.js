import { Router } from "express";
import { verifyGuestArrival, markUserExit, verifyArrivalOtp } from "../controllers/camera.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:waterid/verify-arrival", middleware, verifyGuestArrival);
router.post("/:waterid/mark-exit", middleware, markUserExit);
router.post("/verify-arrival-otp", middleware, verifyArrivalOtp);

export default router;