import { prisma } from "../lib/prisma";
import { EventRegistrationRepository } from "../repositories/eventRegistration.repository";

export class EventRegistrationService {

  static async registerForEvent(eventId: string, data: { name: string; email: string }) {
    const alreadyExists = await EventRegistrationRepository.exists(eventId, data.email);
    if (alreadyExists) {
      throw {
        status: 400,
        message: "Duplicate registration",
        details: [
          {
            field: "email",
            issue: "This email is already registered for this event",
          },
        ],
      };
    }

    return EventRegistrationRepository.create(eventId, data.name, data.email);
  }

  static async getRegistrationsForEvent(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true }
    });

    if (!event) {
      throw {
        status: 404,
        message: "Event not found",
        details: [{ field: "eventId", issue: "No event exists with this ID" }],
      };
    }

    const registrations = await EventRegistrationRepository.findByEvent(eventId);

    return {
      success: true,
      event,
      registrations,
      meta: {
        total: registrations.length,
      },
    };
  }

  // ✅ Missing earlier — now added
  static async getAllRegistrations() {
    const registrations = await EventRegistrationRepository.findAll();

    return {
      success: true,
      registrations,
      meta: {
        total: registrations.length,
      },
    };
  }

  static async removeRegistration(id: string) {
    return EventRegistrationRepository.delete(id);
  }
}
