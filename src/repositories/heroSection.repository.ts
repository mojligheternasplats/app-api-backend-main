import { prisma } from "../lib/prisma";
import { HeroStatus } from "@prisma/client";

interface FindAllParams {
  skip?: number;
  take?: number;
  search?: string;
}

export class HeroSectionRepository {
  static async findAll(params?: FindAllParams) {
    const items = await prisma.heroSection.findMany({
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
    const media = await prisma.mediaAssociation.findMany({
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

  static async count(params?: { search?: string }) {
    return prisma.heroSection.count({
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

  static async findById(id: string) {
    const hero = await prisma.heroSection.findUnique({
      where: { id },
    });
    if (!hero) return null;

    const media = await prisma.mediaAssociation.findMany({
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

  static async findByPage(page: string) {
    const hero = await prisma.heroSection.findFirst({
      where: { page: page.toLowerCase(), status: HeroStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
    });

    if (!hero) return null;

    const media = await prisma.mediaAssociation.findMany({
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

  static async create(data: any) {
    return prisma.heroSection.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.heroSection.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.heroSection.delete({ where: { id } });
  }
}
