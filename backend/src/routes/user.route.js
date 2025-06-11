import { Router } from "express";
import { userLogin, userSignup, fetchDashboardDetails } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/:userid/dashboard", fetchDashboardDetails);

export default router;