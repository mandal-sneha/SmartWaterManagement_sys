import { Router } from "express";
import { userLogin, userSignup, getUser, getFamilyMembers, addFamilyMember, fetchDashboardDetails } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/:userid/get-user", getUser);
router.get("/:userid/get-family-members", getFamilyMembers);
router.get("/:userid/add-family-members", addFamilyMember);
router.get("/:userid/dashboard", fetchDashboardDetails);

export default router;