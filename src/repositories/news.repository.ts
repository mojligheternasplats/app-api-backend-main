import { prisma } from "../lib/prisma";
import { EntityType } from "@prisma/client";

export class NewsRepository {
  static async findAll(params?: { skip?: number; take?: number; search?: string }) {
    const news = await prisma.news.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.search
        ? {
            OR: [
              { title: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { publishedDate: "desc" },
      include: {
        creator: true, // 👈 associations removed
      },
    });

    // Fetch media via MediaAssociation (generic model)
    return Promise.all(
      news.map(async (n) => {
        const media = await prisma.mediaAssociation.findMany({
          where: { entityId: n.id, entityType: EntityType.NEWS },
          include: { media: true },
          orderBy: { order: "asc" },
        });

        return {
          id: n.id,
          slug: n.slug,
          title: n.title,
          description: n.description,
          content: n.content,
          language: n.language,
          isPublished: n.isPublished,
          publishedDate: n.publishedDate,
          createdAt: n.createdAt,
          creator: n.creator
            ? {
                id: n.creator.id,
                name: `${n.creator.firstName ?? ""} ${n.creator.lastName ?? ""}`.trim(),
                email: n.creator.email,
              }
            : null,
          media: media.map((m) => ({
            id: m.media.id,
            url: m.media.url,
            altText: m.media.altText,
          })),
        };
      })
    );
  }

  static async count(params?: { search?: string }) {
    return prisma.news.count({
      where: params?.search
        ? {
            OR: [
              { title: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : undefined,
    });
  }

  static async findById(id: string) {
    const n = await prisma.news.findUnique({
      where: { id },
      include: { creator: true }, // 👈 associations removed
    });
    if (!n) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: { entityId: n.id, entityType: EntityType.NEWS },
      include: { media: true },
      orderBy: { order: "asc" },
    });

    return {
      id: n.id,
      slug: n.slug,
      title: n.title,
      description: n.description,
      content: n.content,
      language: n.language,
      isPublished: n.isPublished,
      publishedDate: n.publishedDate,
      createdAt: n.createdAt,
      creator: n.creator
        ? {
            id: n.creator.id,
            name: `${n.creator.firstName ?? ""} ${n.creator.lastName ?? ""}`.trim(),
            email: n.creator.email,
          }
        : null,
      media: media.map((m) => ({
        id: m.media.id,
        url: m.media.url,
        altText: m.media.altText,
      })),
    };
  }

  static async findBySlug(slug: string) {
    const n = await prisma.news.findUnique({
      where: { slug },
      include: { creator: true }, // 👈 associations removed
    });
    if (!n) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: { entityId: n.id, entityType: EntityType.NEWS },
      include: { media: true },
      orderBy: { order: "asc" },
    });

    return {
      id: n.id,
      slug: n.slug,
      title: n.title,
      description: n.description,
      content: n.content,
      language: n.language,
      isPublished: n.isPublished,
      publishedDate: n.publishedDate,
      createdAt: n.createdAt,
      creator: n.creator
        ? {
            id: n.creator.id,
            name: `${n.creator.firstName ?? ""} ${n.creator.lastName ?? ""}`.trim(),
            email: n.creator.email,
          }
        : null,
      media: media.map((m) => ({
        id: m.media.id,
        url: m.media.url,
        altText: m.media.altText,
      })),
    };
  }

  static async create(data: {
    title: string;
    description?: string;
    content?: string;
    language?: string;
    isPublished?: boolean;
    publishedDate: Date;
    createdById?: string | null;
    slug: string;
  }) {
    return prisma.news.create({ data });
  }

  static async update(
    id: string,
    data: Partial<{
      title: string;
      description?: string | null;
      content?: string | null;
      language?: string;
      isPublished?: boolean;
      publishedDate?: Date;
      slug?: string | null;
      createdById?: string | null;
    }>
  ) {
    return prisma.news.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.news.delete({ where: { id } });
  }
}
