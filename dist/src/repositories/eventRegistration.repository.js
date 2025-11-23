"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationRepository = void 0;
const prisma_1 = require("../lib/prisma");
class EventRegistrationRepository {
    static async exists(eventId, email) {
        const existing = await prisma_1.prisma.eventRegistration.findFirst({
            where: { eventId, email },
        });
        return !!existing;
    }
    static async create(eventId, name, email) {
        return prisma_1.prisma.eventRegistration.create({
            data: { eventId, name, email },
        });
    }
    static async findAll() {
        return prisma_1.prisma.eventRegistration.findMany({
            include: {
                event: { select: { id: true, title: true } },
            },
        });
    }
    static async findByEvent(eventId) {
        return prisma_1.prisma.eventRegistration.findMany({
            where: { eventId },
            orderBy: { createdAt: "desc" }, // newest first
        });
    }
    static async update(id, data) {
        return prisma_1.prisma.eventRegistration.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma_1.prisma.eventRegistration.delete({
            where: { id },
        });
    }
}
exports.EventRegistrationRepository = EventRegistrationRepository;
