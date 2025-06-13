import { Router } from "express";
import { userLogin, userSignup, getUser, fetchDashboardDetails } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/:userid/get-user", getUser);
router.get("/:userid/dashboard", fetchDashboardDetails);

export default router;