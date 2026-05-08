import { Router } from "express";
import { getPropertyTenants, addTenant, deleteTenant } from "../controllers/tenant.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:propertyid/get-property-tenants", middleware, getPropertyTenants);
router.post("/:rootId/:userid/add-tenant", middleware, addTenant);
router.delete("/:propertyid/:userid/delete-tenant", middleware, deleteTenant);

export default router;