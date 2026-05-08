import { Router } from "express";
import { 
  userSignup, userLogin, generateEmailVerificationOtp, addFamilyMember, 
  verifySignupOtp, getPaymentSummary, getCurrentDayGuests, viewInvitedGuests, 
  getUser, getProfileDetails, getFamilyMembers, getDashboardDetails, 
  updateUserProfile, getInsightsPageGraphData, getMonthlyUsageDetails 
} from "../controllers/user.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/:useremail/generate-email-verification-otp", generateEmailVerificationOtp);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/:userid/:memberid/add-family-member", middleware, addFamilyMember);
router.put("/:userid/update-profile", middleware, updateUserProfile);
router.get("/:userid/payment-summary", middleware, getPaymentSummary);
router.get("/:waterid/get-currentday-guests", middleware, getCurrentDayGuests);
router.get("/:waterid/view-guests", middleware, viewInvitedGuests);
router.get("/:userid/get-user", middleware, getUser);
router.get("/:userid/get-profile-details", middleware, getProfileDetails);
router.get("/:userid/get-family-members", middleware, getFamilyMembers);
router.get("/:userid/dashboard", middleware, getDashboardDetails);
router.get("/:waterid/get-insights-page-graph-data", middleware, getInsightsPageGraphData);
router.get("/:waterid/get-monthly-usage-details", middleware, getMonthlyUsageDetails);

export default router;