"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const prisma_1 = require("../lib/prisma");
const event_repository_1 = require("../repositories/event.repository");
class EventService {
    static toCleanResponse(e) {
        return {
            id: e.id,
            slug: e.slug,
            title: e.title,
            description: e.description,
            content: e.content,
            language: e.language,
            isPublished: e.isPublished,
            startDate: e.startDate,
            endDate: e.endDate,
            location: e.location,
            createdAt: e.createdAt,
            creator: e.creator
                ? {
                    id: e.creator.id,
                    name: `${e.creator.firstName ?? ""} ${e.creator.lastName ?? ""}`.trim(),
                }
                : null,
            media: e.media?.map((m) => ({
                id: m.id,
                url: m.url,
                altText: m.altText,
            })) ?? [],
        };
    }
    static async getAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            event_repository_1.EventRepository.findAll({ skip, take: limit, search }),
            event_repository_1.EventRepository.count(search),
        ]);
        return {
            data: items.map(EventService.toCleanResponse),
            meta: { page, limit, total },
        };
    }
    static async getById(id) {
        const e = await event_repository_1.EventRepository.findById(id);
        return e ? EventService.toCleanResponse(e) : null;
    }
    static async getBySlug(slug) {
        const e = await event_repository_1.EventRepository.findBySlug(slug);
        return e ? EventService.toCleanResponse(e) : null;
    }
    static async createEvent(data) {
        return event_repository_1.EventRepository.create(data);
    }
    static async updateEvent(id, data) {
        return event_repository_1.EventRepository.update(id, data);
    }
    static async deleteEvent(id) {
        // Remove media associations first
        await prisma_1.prisma.mediaAssociation.deleteMany({
            where: { entityId: id, entityType: "EVENT" },
        });
        return event_repository_1.EventRepository.delete(id);
    }
}
exports.EventService = EventService;
