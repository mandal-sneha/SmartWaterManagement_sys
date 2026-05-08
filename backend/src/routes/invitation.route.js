import { Router } from "express";
import { viewInvitations, registerInvitation, invitationStateUpdate } from "../controllers/invitation.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:userid/view-invitations", middleware, viewInvitations);
router.post("/:hostid/:hostwaterid/register-invitation", middleware, registerInvitation);
router.patch("/:invitationid/:userid/update-state", middleware, invitationStateUpdate);

export default router;