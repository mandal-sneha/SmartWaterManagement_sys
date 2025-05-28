import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateToken } from "../utils/generate.token.js";

const router = Router();

router.get("/refresh", protect, (req, res) => {
  const token = generateToken(req.user);
  res.json({ token });
});

export default router;