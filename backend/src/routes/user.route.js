import { Router } from "express";
import { userLogin, userSignup, userLogout } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", userLogout);

export default router;