"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventRegistration_controller_1 = require("../controllers/eventRegistration.controller");
const router = (0, express_1.Router)();
// Public: user registers for an event
router.post("/:eventId/register", eventRegistration_controller_1.EventRegistrationController.registerForEvent);
// ✅ Admin: get all registrations (must be BEFORE "/:eventId")
router.get("/", eventRegistration_controller_1.EventRegistrationController.getAllRegistrations);
// Admin: get registrations for a specific event
router.get("/:eventId", eventRegistration_controller_1.EventRegistrationController.getRegistrationsForEvent);
// Admin: remove registration
router.delete("/:id", eventRegistration_controller_1.EventRegistrationController.removeRegistration);
exports.default = router;
