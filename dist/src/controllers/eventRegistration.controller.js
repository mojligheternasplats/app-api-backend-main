"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationController = void 0;
const zod_1 = require("zod");
const eventRegistration_service_1 = require("../services/eventRegistration.service");
// ---------- Zod Schemas ----------
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
});
// Convert ZodError into [{ field, issue }]
function zodToDetails(err) {
    return err.issues.map((i) => ({
        field: i.path.join(".") || "(root)",
        issue: i.message,
    }));
}
class EventRegistrationController {
    // POST /api/events/:eventId/register  (Public)
    static async registerForEvent(req, res) {
        try {
            const { eventId } = req.params;
            const parsed = registerSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: { message: "Validation failed", details: zodToDetails(parsed.error) },
                });
            }
            const created = await eventRegistration_service_1.EventRegistrationService.registerForEvent(eventId, parsed.data);
            return res.status(201).json({
                success: true,
                message: "Registration successful",
                data: created,
            });
        }
        catch (error) {
            if (error?.status === 400) {
                return res.status(400).json({
                    success: false,
                    error: { message: error.message, details: error.details ?? [] },
                });
            }
            return res.status(500).json({
                success: false,
                error: {
                    message: "Failed to register for event",
                    details: [{ field: "(server)", issue: error?.message || "Unknown error" }],
                },
            });
        }
    }
    // GET /api/events/:eventId/registrations (Admin)
    static async getRegistrationsForEvent(req, res) {
        try {
            const { eventId } = req.params;
            const response = await eventRegistration_service_1.EventRegistrationService.getRegistrationsForEvent(eventId);
            return res.json(response);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch registrations" },
            });
        }
    }
    // ✅ GET /api/events/registrations (Admin) - all events
    static async getAllRegistrations(req, res) {
        try {
            const response = await eventRegistration_service_1.EventRegistrationService.getAllRegistrations();
            return res.json(response);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch all registrations" },
            });
        }
    }
    // DELETE /api/events/registrations/:id  (Admin)
    static async removeRegistration(req, res) {
        try {
            const { id } = req.params;
            const deleted = await eventRegistration_service_1.EventRegistrationService.removeRegistration(id);
            return res.json({ success: true, data: deleted });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: "Failed to delete registration",
                    details: [{ field: "(server)", issue: error?.message || "Unknown error" }],
                },
            });
        }
    }
}
exports.EventRegistrationController = EventRegistrationController;
