import { Router } from "express";
import { addTenant } from "../controllers/tenant.controller.js";

const router = Router();

router.post("/add-tenant", addTenant);

export default router;