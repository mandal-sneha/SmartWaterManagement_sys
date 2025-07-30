import { Router } from "express";
import { viewInvitations, registerinvitation, invitationStateUpdate } from "../controllers/invitation.controller.js";

const router = Router();

router.get("/:userid/view-invitations", viewInvitations);
router.post("/:hostid/:guestid/:rootid/register-invitation", registerinvitation);
router.patch("/:invitationid/:userid/update-state", invitationStateUpdate);

export default router;