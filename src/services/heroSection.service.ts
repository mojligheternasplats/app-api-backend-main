import { prisma } from "../lib/prisma";
import { HeroSectionRepository } from "../repositories/heroSection.repository";
import { HeroStatus } from "@prisma/client";

export class HeroSectionService {
  static toCleanResponse(h: any) {
    // Convert page to Title Case (e.g., "home" -> "Home")
    const formatPage = (page: string) =>
      page.charAt(0).toUpperCase() + page.slice(1).toLowerCase();

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
      media:
        h.media?.map((m: any) => ({
          id: m.id,
          url: m.url,
          altText: m.altText,
        })) ?? [],
    };
  }

  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      HeroSectionRepository.findAll({ skip, take: limit, search }),
      HeroSectionRepository.count({ search }),
    ]);

    return {
      data: items.map(HeroSectionService.toCleanResponse),
      meta: { page, limit, total },
    };
  }

  static async getById(id: string) {
    const hero = await HeroSectionRepository.findById(id);
    return hero ? HeroSectionService.toCleanResponse(hero) : null;
  }

  /**
   * Returns only the PUBLISHED hero for a page (used by frontend)
   */
  static async getByPage(page: string) {
    const hero = await HeroSectionRepository.findByPage(page);
    return hero ? HeroSectionService.toCleanResponse(hero) : null;
  }

  static async createHeroSection(data: {
    page: string;
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    language?: string;
    status?: HeroStatus; // default will be DRAFT
  }) {
    return HeroSectionRepository.create({
      page: data.page.toLowerCase(), // normalize for DB consistency
      title: data.title,
      subtitle: data.subtitle ?? null,
      buttonText: data.buttonText ?? null,
      buttonLink: data.buttonLink ?? null,
      language: data.language ?? "Swedish",
      status: data.status ?? HeroStatus.DRAFT,
    });
  }

  static async updateHeroSection(
    id: string,
    data: Partial<{
      page: string;
      title: string;
      subtitle?: string | null;
      buttonText?: string | null;
      buttonLink?: string | null;
      language?: string;
      status?: HeroStatus;
    }>
  ) {
    if (data.page) {
      data.page = data.page.toLowerCase(); // keep page lowercase for DB
    }

    return HeroSectionRepository.update(id, data);
  }

  static async deleteHeroSection(id: string) {
    // 1️⃣ Remove media associations first
    await prisma.mediaAssociation.deleteMany({
      where: { entityId: id, entityType: "HERO_SECTION" },
    });

    // 2️⃣ Delete hero section
    return HeroSectionRepository.delete(id);
  }
}

