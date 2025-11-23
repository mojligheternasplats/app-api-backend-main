"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationService = void 0;
const prisma_1 = require("../lib/prisma");
const eventRegistration_repository_1 = require("../repositories/eventRegistration.repository");
class EventRegistrationService {
    static async registerForEvent(eventId, data) {
        const alreadyExists = await eventRegistration_repository_1.EventRegistrationRepository.exists(eventId, data.email);
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
        return eventRegistration_repository_1.EventRegistrationRepository.create(eventId, data.name, data.email);
    }
    static async getRegistrationsForEvent(eventId) {
        const event = await prisma_1.prisma.event.findUnique({
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
        const registrations = await eventRegistration_repository_1.EventRegistrationRepository.findByEvent(eventId);
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
        const registrations = await eventRegistration_repository_1.EventRegistrationRepository.findAll();
        return {
            success: true,
            registrations,
            meta: {
                total: registrations.length,
            },
        };
    }
    static async removeRegistration(id) {
        return eventRegistration_repository_1.EventRegistrationRepository.delete(id);
    }
}
exports.EventRegistrationService = EventRegistrationService;
