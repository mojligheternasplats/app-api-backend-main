import { Router } from "express";
import { EventRegistrationController } from "../controllers/eventRegistration.controller";

const router = Router();

// Public: user registers for an event
router.post("/:eventId/register", EventRegistrationController.registerForEvent);

// ✅ Admin: get all registrations (must be BEFORE "/:eventId")
router.get("/", EventRegistrationController.getAllRegistrations);

// Admin: get registrations for a specific event
router.get("/:eventId", EventRegistrationController.getRegistrationsForEvent);

// Admin: remove registration
router.delete("/:id", EventRegistrationController.removeRegistration);

export default router;
