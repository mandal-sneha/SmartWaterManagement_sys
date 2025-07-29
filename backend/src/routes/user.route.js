import { Router } from "express";
import { userSignup, userLogin, verifyEmail, viewInvitedGuests, viewMonthwiseDetails, getUser, getProfileDetails, getFamilyMembers, addFamilyMember, fetchDashboardDetails, updateUserProfile } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/:useremail/verify-email", verifyEmail);
router.get("/:waterid/view-guests", viewInvitedGuests);
router.get("/:waterid/view-monthwise-details", viewMonthwiseDetails)
router.get("/:userid/get-user", getUser);
router.get("/:userid/get-profile-details", getProfileDetails);
router.get("/:userid/get-family-members", getFamilyMembers);
router.post("/:userid/:memberid/add-family-member", addFamilyMember);
router.get("/:userid/dashboard", fetchDashboardDetails);
router.put("/:userid/update-profile", updateUserProfile);

export default router;