import { Router } from "express";
import { viewInvitations, registerinvitation } from "../controllers/invitation.controller.js";

const router = Router();

router.get("/:userid/view-invitations", viewInvitations);
router.post("/:rootid/register-invitation", registerinvitation);

export default router;