import { Request, Response } from "express";
import { z } from "zod";
import { EventRegistrationService } from "../services/eventRegistration.service";

// ---------- Zod Schemas ----------
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

// Convert ZodError into [{ field, issue }]
function zodToDetails(err: z.ZodError) {
  return err.issues.map((i) => ({
    field: i.path.join(".") || "(root)",
    issue: i.message,
  }));
}

export class EventRegistrationController {
  // POST /api/events/:eventId/register  (Public)
  static async registerForEvent(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: { message: "Validation failed", details: zodToDetails(parsed.error) },
        });
      }

      const created = await EventRegistrationService.registerForEvent(eventId, parsed.data);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: created,
      });

    } catch (error: any) {
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
  static async getRegistrationsForEvent(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const response = await EventRegistrationService.getRegistrationsForEvent(eventId);
      return res.json(response);

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch registrations" },
      });
    }
  }

  // ✅ GET /api/events/registrations (Admin) - all events
  static async getAllRegistrations(req: Request, res: Response) {
    try {
      const response = await EventRegistrationService.getAllRegistrations();
      return res.json(response);

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch all registrations" },
      });
    }
  }

  // DELETE /api/events/registrations/:id  (Admin)
  static async removeRegistration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await EventRegistrationService.removeRegistration(id);

      return res.json({ success: true, data: deleted });

    } catch (error: any) {
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
