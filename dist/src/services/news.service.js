"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = require("../lib/prisma");
const news_repository_1 = require("../repositories/news.repository");
class NewsService {
    static toCleanResponse(n) {
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
            media: n.media?.map((m) => ({
                id: m.id,
                url: m.url,
                altText: m.altText,
            })) ?? [],
        };
    }
    static async getAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            news_repository_1.NewsRepository.findAll({ skip, take: limit, search }),
            news_repository_1.NewsRepository.count({ search }),
        ]);
        return {
            data: items.map(NewsService.toCleanResponse),
            meta: { page, limit, total },
        };
    }
    static async getById(id) {
        const n = await news_repository_1.NewsRepository.findById(id);
        return n ? NewsService.toCleanResponse(n) : null;
    }
    static async getBySlug(slug) {
        const n = await news_repository_1.NewsRepository.findBySlug(slug);
        return n ? NewsService.toCleanResponse(n) : null;
    }
    static async createNews(data) {
        const baseSlug = data.slug?.trim() ||
            (0, slugify_1.default)(data.title, { lower: true, strict: true });
        let slug = baseSlug;
        let i = 1;
        while (await prisma_1.prisma.news.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${i++}`;
        }
        return news_repository_1.NewsRepository.create({
            title: data.title,
            description: data.description ?? null,
            content: data.content ?? null,
            language: data.language ?? "Swedish",
            isPublished: data.isPublished ?? false,
            publishedDate: data.publishedDate
                ? new Date(data.publishedDate)
                : new Date(),
            createdById: data.createdById ?? null,
            slug,
        });
    }
    static async updateNews(id, data) {
        // convert publishedDate string → Date
        if (typeof data.publishedDate === "string") {
            data.publishedDate = new Date(data.publishedDate);
        }
        // regenerate slug only if provided
        if (data.slug) {
            const baseSlug = (0, slugify_1.default)(data.slug, { lower: true, strict: true });
            let slug = baseSlug;
            let i = 1;
            while (await prisma_1.prisma.news.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${i++}`;
            }
            data.slug = slug;
        }
        return news_repository_1.NewsRepository.update(id, data);
    }
    static async deleteNews(id) {
        // Remove media associations first
        await prisma_1.prisma.mediaAssociation.deleteMany({
            where: { entityId: id, entityType: "NEWS" },
        });
        return news_repository_1.NewsRepository.delete(id);
    }
}
exports.NewsService = NewsService;
