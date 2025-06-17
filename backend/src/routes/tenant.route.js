import { Router } from "express";
import { getPropertyTenants, addTenant, deleteTenant } from "../controllers/tenant.controller.js";

const router = Router();

router.get("/:propertyid/get-property-tenants", getPropertyTenants);
router.post("/:rootId/:userid/add-tenant", addTenant);
router.delete("/:propertyid/:userid/delete-tenant", deleteTenant);

export default router;