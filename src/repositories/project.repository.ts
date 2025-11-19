import { prisma } from "../lib/prisma";
import { EntityType, ProjectCategory } from "@prisma/client";

interface FindAllParams {
  skip?: number;
  take?: number;
  search?: string;
  category?: ProjectCategory;
}

export class ProjectRepository {
  static async findAll(params?: FindAllParams) {
    const projects = await prisma.project.findMany({
      skip: params?.skip,
      take: params?.take,
      where: {
        ...(params?.search && {
          OR: [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ],
        }),
        ...(params?.category && { category: params.category }),
      },
      orderBy: { order: "asc" },
      include: {
        creator: true, // ❗ associations removed
      },
    });

    // ✅ Attach media for each project
    return Promise.all(
      projects.map(async (p) => {
        const media = await prisma.mediaAssociation.findMany({
          where: {
            entityId: p.id,
            entityType: EntityType.PROJECT,
          },
          include: { media: true },
          orderBy: { order: "asc" },
        });

        return {
          ...p,
          media: media.map((m) => ({
            id: m.media.id,
            url: m.media.url,
            altText: m.media.altText,
            title: m.media.title,
          })),
        };
      })
    );
  }

  static async count(params?: { search?: string; category?: ProjectCategory }) {
    return prisma.project.count({
      where: {
        ...(params?.search && {
          OR: [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ],
        }),
        ...(params?.category && { category: params.category }),
      },
    });
  }

  static async findById(id: string) {
    const p = await prisma.project.findUnique({
      where: { id },
      include: { creator: true }, // ❗ associations removed
    });

    if (!p) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: { entityId: p.id, entityType: EntityType.PROJECT },
      include: { media: true },
      orderBy: { order: "asc" },
    });

    return {
      ...p,
      media: media.map((m) => ({
        id: m.media.id,
        url: m.media.url,
        altText: m.media.altText,
        title: m.media.title,
      })),
    };
  }

  static async findBySlug(slug: string) {
    const p = await prisma.project.findUnique({
      where: { slug },
      include: { creator: true }, // ❗ associations removed
    });

    if (!p) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: { entityId: p.id, entityType: EntityType.PROJECT },
      include: { media: true },
      orderBy: { order: "asc" },
    });

    return {
      ...p,
      media: media.map((m) => ({
        id: m.media.id,
        url: m.media.url,
        altText: m.media.altText,
        title: m.media.title,
      })),
    };
  }

  static async create(data: {
    title: string;
    description?: string;
    content?: string;
    language?: string;
    category?: ProjectCategory;
    isPublished?: boolean;
    order?: number;
    createdById?: string;
  }) {
    return prisma.project.create({ data });
  }

  static async update(id: string, data: Partial<{
      title: string;
      description?: string | null;
      content?: string | null;
      language?: string;
      category?: ProjectCategory;
      isPublished?: boolean;
      order?: number;
      createdById?: string | null;
    }>
  ) {
    return prisma.project.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
