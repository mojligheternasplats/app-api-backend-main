import { prisma } from "../lib/prisma";
import { EntityType, ProjectCategory } from "@prisma/client";

interface FindAllParams {
  skip?: number;
  take?: number;
  search?: string;
  category?: ProjectCategory;
}

export class ProjectRepository {
  /** -------------------------------------------
   *  FIND ALL PROJECTS
   * ------------------------------------------*/
  static async findAll(params?: FindAllParams) {
    const projects = await prisma.project.findMany({
      skip: params?.skip,
      take: params?.take,
      where: {
        ...(params?.search && {
          OR: [
            {
              title: { contains: params.search, mode: "insensitive" },
            },
            {
              description: { contains: params.search, mode: "insensitive" },
            },
          ],
        }),
        ...(params?.category && { category: params.category }),
      },
      orderBy: { order: "asc" },
      include: {
        creator: true,
      },
    });

    // Load media for each project
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
          })),
        };
      })
    );
  }

  /** -------------------------------------------
   *  COUNT PROJECTS
   * ------------------------------------------*/
  static async count(params?: {
    search?: string;
    category?: ProjectCategory;
  }) {
    return prisma.project.count({
      where: {
        ...(params?.search && {
          OR: [
            {
              title: { contains: params.search, mode: "insensitive" },
            },
            {
              description: { contains: params.search, mode: "insensitive" },
            },
          ],
        }),
        ...(params?.category && { category: params.category }),
      },
    });
  }

  /** -------------------------------------------
   *  FIND BY ID
   * ------------------------------------------*/
  static async findById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!project) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: {
        entityId: project.id,
        entityType: EntityType.PROJECT,
      },
      include: { media: true },
      orderBy: { order: "asc" },
    });

    return {
      ...project,
      media: media.map((m) => ({
        id: m.media.id,
        url: m.media.url,
        altText: m.media.altText,
      })),
    };
  }

  /** -------------------------------------------
   *  FIND BY SLUG
   * ------------------------------------------*/
  static async findBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { creator: true },
    });

    if (!project) return null;

    const media = await prisma.mediaAssociation.findMany({
      where: {
        entityId: project.id,
        entityType: EntityType.PROJECT,
      },
      include: { media: true },
      orderBy: { order: "asc" },
    });

    return {
      ...project,
      media: media.map((m) => ({
        id: m.media.id,
        url: m.media.url,
        altText: m.media.altText,
      })),
    };
  }

  /** -------------------------------------------
   *  CREATE PROJECT (fully fixed)
   * ------------------------------------------*/
static async create(data: {
  title: string;
  slug?: string; // <-- add this
  description?: string | null;
  content?: string | null;
  language?: string;
  category?: ProjectCategory;
  isPublished?: boolean;
  order?: number;
  createdById?: string | null;
}) {
  const {
    title,
    slug: incomingSlug,
    description,
    content,
    language,
    category,
    isPublished,
    order,
    createdById,
  } = data;

  let slug = incomingSlug?.trim().toLowerCase() || null;

  // If frontend did not provide slug → generate one
  if (!slug || slug === "") {
    const baseSlug = title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    slug = baseSlug;
  }

  // Ensure slug is unique
  let uniqueSlug = slug;
  let i = 1;

  while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${i++}`;
  }

  return prisma.project.create({
    data: {
      title,
      slug: uniqueSlug,  // <-- use final slug
      description: description ?? null,
      content: content ?? null,
      language: language ?? "Swedish",
      category: category ?? ProjectCategory.LOCAL,
      isPublished: isPublished ?? false,
      order: order ?? 0,

      ...(createdById
        ? { creator: { connect: { id: createdById } } }
        : {}),
    },
  });
}

  /** -------------------------------------------
   *  UPDATE PROJECT (fully fixed)
   * ------------------------------------------*/
 static async update(
  id: string,
  data: Partial<{
    title: string;
    slug: string; // <-- add this line
    description: string | null;
    content: string | null;
    language: string;
    category: ProjectCategory;
    isPublished: boolean;
    order: number;
    createdById: string | null;
  }>
) {
  const updateData: any = { ...data };

  // Handle creator field
  if (data.createdById) {
    updateData.creator = { connect: { id: data.createdById } };
    delete updateData.createdById;
  }

  // ---------- SLUG LOGIC (IMPORTANT) ----------
  if (typeof data.slug !== "undefined") {
    let incomingSlug = data.slug?.trim().toLowerCase() || "";

    if (incomingSlug !== "") {
      // Ensure slug is unique
      let finalSlug = incomingSlug;
      let i = 1;

      while (
        await prisma.project.findFirst({
          where: {
            slug: finalSlug,
            id: { not: id },      // <-- don't count this project itself
          },
        })
      ) {
        finalSlug = `${incomingSlug}-${i++}`;
      }

      updateData.slug = finalSlug;
    } else {
      // If empty, do NOT overwrite slug
      delete updateData.slug;
    }
  }

  // ---------- END OF SLUG LOGIC ----------

  return prisma.project.update({
    where: { id },
    data: updateData,
  });
}


  /** -------------------------------------------
   *  DELETE PROJECT
   * ------------------------------------------*/
  static async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}
