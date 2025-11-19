import slugify from "slugify";
import { prisma } from "../lib/prisma";
import { NewsRepository } from "../repositories/news.repository";

export class NewsService {
  static toCleanResponse(n: any) {
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
      media: n.media?.map((m: any) => ({
        id: m.id,
        url: m.url,
        altText: m.altText,
      })) ?? [],
    };
  }

  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      NewsRepository.findAll({ skip, take: limit, search }),
      NewsRepository.count({ search }),
    ]);

    return {
      data: items.map(NewsService.toCleanResponse),
      meta: { page, limit, total },
    };
  }

  static async getById(id: string) {
    const n = await NewsRepository.findById(id);
    return n ? NewsService.toCleanResponse(n) : null;
  }

  static async getBySlug(slug: string) {
    const n = await NewsRepository.findBySlug(slug);
    return n ? NewsService.toCleanResponse(n) : null;
  }

  static async createNews(data: {
    title: string;
    description?: string;
    content?: string;
    language?: string;
    isPublished?: boolean;
    publishedDate?: string | Date;
    createdById?: string | null;
    slug?: string;
  }) {
    const baseSlug = data.slug?.trim() || slugify(data.title, { lower: true, strict: true });
    let slug = baseSlug;
    let i = 1;

    while (await prisma.news.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    return NewsRepository.create({
      title: data.title,
      description: data.description ?? null,
      content: data.content ?? null,
      language: data.language ?? "Swedish",
      isPublished: data.isPublished ?? false,
      publishedDate: data.publishedDate ? new Date(data.publishedDate) : new Date(),
      createdById: data.createdById ?? null,
      slug,
    });
  }

  static async updateNews(
    id: string,
    data: Partial<{
      title: string;
      description?: string | null;
      content?: string | null;
      language?: string;
      isPublished?: boolean;
      publishedDate?: string | Date;
      slug?: string;
      createdById?: string | null;
    }>
  ) {
    if (data.slug) {
      const baseSlug = slugify(data.slug, { lower: true, strict: true });
      let slug = baseSlug;
      let i = 1;
      while (await prisma.news.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${i++}`;
      }
      data.slug = slug;
    }

    if (data.publishedDate) {
      data.publishedDate = new Date(data.publishedDate);
    }

    return NewsRepository.update(id, data);
  }

  static async deleteNews(id: string) {
    // Remove media associations first
    await prisma.mediaAssociation.deleteMany({
      where: { entityId: id, entityType: "NEWS" },
    });

    return NewsRepository.delete(id);
  }
}
