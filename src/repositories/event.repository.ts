import { prisma } from "../lib/prisma";
import { EntityType } from "@prisma/client";

interface FindAllParams {
  skip: number;
  take: number;
  search?: string;
}

export class EventRepository {
  static async findAll({ skip, take, search }: FindAllParams) {
    const events = await prisma.event.findMany({
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
    return Promise.all(
      events.map(async (e) => {
        const media = await prisma.mediaAssociation.findMany({
          where: {
            entityId: e.id,
            entityType: EntityType.EVENT,
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
      })
    );
  }

  static async count(search?: string) {
    return prisma.event.count({
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

  static async findById(id: string) {
    const e = await prisma.event.findUnique({
      where: { id },
      include: { creator: true }, // ❗ associations removed
    });
    if (!e) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: { entityId: e.id, entityType: EntityType.EVENT },
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

  static async findBySlug(slug: string) {
    const e = await prisma.event.findUnique({
      where: { slug },
      include: { creator: true }, // ❗ associations removed
    });
    if (!e) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: { entityId: e.id, entityType: EntityType.EVENT },
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

  static async create(data: any) {
    return prisma.event.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}
