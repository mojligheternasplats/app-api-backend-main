"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class EventRepository {
    static async findAll({ skip, take, search }) {
        const events = await prisma_1.prisma.event.findMany({
            skip,
            take,
            where: search
                ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                        { location: { contains: search, mode: "insensitive" } },
                    ],
                }
                : undefined,
            orderBy: { startDate: "asc" },
            include: {
                creator: true, // ❗ associations removed
            },
        });
        // ✅ Attach media for each event
        return Promise.all(events.map(async (e) => {
            const media = await prisma_1.prisma.mediaAssociation.findMany({
                where: {
                    entityId: e.id,
                    entityType: client_1.EntityType.EVENT,
                },
                include: { media: true },
                orderBy: { order: "asc" },
            });
            return {
                ...e,
                media: media.map((m) => ({
                    id: m.media.id,
                    url: m.media.url,
                    altText: m.media.altText,
                })),
            };
        }));
    }
    static async count(search) {
        return prisma_1.prisma.event.count({
            where: search
                ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                        { location: { contains: search, mode: "insensitive" } },
                    ],
                }
                : undefined,
        });
    }
    static async findById(id) {
        const e = await prisma_1.prisma.event.findUnique({
            where: { id },
            include: { creator: true }, // ❗ associations removed
        });
        if (!e)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: e.id, entityType: client_1.EntityType.EVENT },
            include: { media: true },
            orderBy: { order: "asc" },
        });
        return {
            ...e,
            media: media.map((m) => ({
                id: m.media.id,
                url: m.media.url,
                altText: m.media.altText,
            })),
        };
    }
    static async findBySlug(slug) {
        const e = await prisma_1.prisma.event.findUnique({
            where: { slug },
            include: { creator: true }, // ❗ associations removed
        });
        if (!e)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: e.id, entityType: client_1.EntityType.EVENT },
            include: { media: true },
            orderBy: { order: "asc" },
        });
        return {
            ...e,
            media: media.map((m) => ({
                id: m.media.id,
                url: m.media.url,
                altText: m.media.altText,
            })),
        };
    }
    static async create(data) {
        return prisma_1.prisma.event.create({ data });
    }
    static async update(id, data) {
        return prisma_1.prisma.event.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma_1.prisma.event.delete({ where: { id } });
    }
}
exports.EventRepository = EventRepository;
