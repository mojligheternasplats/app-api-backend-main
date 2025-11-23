"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroSectionService = void 0;
const prisma_1 = require("../lib/prisma");
const heroSection_repository_1 = require("../repositories/heroSection.repository");
const client_1 = require("@prisma/client");
class HeroSectionService {
    static toCleanResponse(h) {
        // Convert page to Title Case (e.g., "home" -> "Home")
        const formatPage = (page) => page.charAt(0).toUpperCase() + page.slice(1).toLowerCase();
        return {
            id: h.id,
            page: formatPage(h.page),
            title: h.title,
            subtitle: h.subtitle,
            buttonText: h.buttonText,
            buttonLink: h.buttonLink,
            language: h.language,
            status: h.status,
            createdAt: h.createdAt,
            updatedAt: h.updatedAt,
            media: h.media?.map((m) => ({
                id: m.id,
                url: m.url,
                altText: m.altText,
            })) ?? [],
        };
    }
    static async getAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            heroSection_repository_1.HeroSectionRepository.findAll({ skip, take: limit, search }),
            heroSection_repository_1.HeroSectionRepository.count({ search }),
        ]);
        return {
            data: items.map(HeroSectionService.toCleanResponse),
            meta: { page, limit, total },
        };
    }
    static async getById(id) {
        const hero = await heroSection_repository_1.HeroSectionRepository.findById(id);
        return hero ? HeroSectionService.toCleanResponse(hero) : null;
    }
    /**
     * Returns only the PUBLISHED hero for a page (used by frontend)
     */
    static async getByPage(page) {
        const hero = await heroSection_repository_1.HeroSectionRepository.findByPage(page);
        return hero ? HeroSectionService.toCleanResponse(hero) : null;
    }
    static async createHeroSection(data) {
        return heroSection_repository_1.HeroSectionRepository.create({
            page: data.page.toLowerCase(), // normalize for DB consistency
            title: data.title,
            subtitle: data.subtitle ?? null,
            buttonText: data.buttonText ?? null,
            buttonLink: data.buttonLink ?? null,
            language: data.language ?? "Swedish",
            status: data.status ?? client_1.HeroStatus.DRAFT,
        });
    }
    static async updateHeroSection(id, data) {
        if (data.page) {
            data.page = data.page.toLowerCase(); // keep page lowercase for DB
        }
        return heroSection_repository_1.HeroSectionRepository.update(id, data);
    }
    static async deleteHeroSection(id) {
        // 1️⃣ Remove media associations first
        await prisma_1.prisma.mediaAssociation.deleteMany({
            where: { entityId: id, entityType: "HERO_SECTION" },
        });
        // 2️⃣ Delete hero section
        return heroSection_repository_1.HeroSectionRepository.delete(id);
    }
}
exports.HeroSectionService = HeroSectionService;
