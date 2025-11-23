"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroSectionRepository = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class HeroSectionRepository {
    static async findAll(params) {
        const items = await prisma_1.prisma.heroSection.findMany({
            skip: params?.skip,
            take: params?.take,
            where: params?.search
                ? {
                    OR: [
                        { title: { contains: params.search, mode: "insensitive" } },
                        { subtitle: { contains: params.search, mode: "insensitive" } },
                        { page: { contains: params.search, mode: "insensitive" } },
                    ],
                }
                : undefined,
            orderBy: { createdAt: "desc" },
        });
        // Attach media (same pattern as Event/News)
        const heroIds = items.map((i) => i.id);
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: { in: heroIds }, entityType: "HERO_SECTION" },
            include: { media: true },
        });
        return items.map((h) => ({
            ...h,
            media: media
                .filter((m) => m.entityId === h.id)
                .map((m) => ({
                id: m.media.id,
                url: m.media.url,
                altText: m.media.altText,
            })),
        }));
    }
    static async count(params) {
        return prisma_1.prisma.heroSection.count({
            where: params?.search
                ? {
                    OR: [
                        { title: { contains: params.search, mode: "insensitive" } },
                        { subtitle: { contains: params.search, mode: "insensitive" } },
                        { page: { contains: params.search, mode: "insensitive" } },
                    ],
                }
                : undefined,
        });
    }
    static async findById(id) {
        const hero = await prisma_1.prisma.heroSection.findUnique({
            where: { id },
        });
        if (!hero)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: id, entityType: "HERO_SECTION" },
            include: { media: true },
        });
        return {
            ...hero,
            media: media.map((m) => ({
                id: m.media.id,
                url: m.media.url,
                altText: m.media.altText,
            })),
        };
    }
    static async findByPage(page) {
        const hero = await prisma_1.prisma.heroSection.findFirst({
            where: { page: page.toLowerCase(), status: client_1.HeroStatus.PUBLISHED },
            orderBy: { createdAt: "desc" },
        });
        if (!hero)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: hero.id, entityType: "HERO_SECTION" },
            include: { media: true },
        });
        return {
            ...hero,
            media: media.map((m) => ({
                id: m.media.id,
                url: m.media.url,
                altText: m.media.altText,
            })),
        };
    }
    static async create(data) {
        return prisma_1.prisma.heroSection.create({ data });
    }
    static async update(id, data) {
        return prisma_1.prisma.heroSection.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma_1.prisma.heroSection.delete({ where: { id } });
    }
}
exports.HeroSectionRepository = HeroSectionRepository;
