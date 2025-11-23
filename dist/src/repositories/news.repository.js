"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRepository = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class NewsRepository {
    static async findAll(params) {
        const news = await prisma_1.prisma.news.findMany({
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
        return Promise.all(news.map(async (n) => {
            const media = await prisma_1.prisma.mediaAssociation.findMany({
                where: { entityId: n.id, entityType: client_1.EntityType.NEWS },
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
        }));
    }
    static async count(params) {
        return prisma_1.prisma.news.count({
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
    static async findById(id) {
        const n = await prisma_1.prisma.news.findUnique({
            where: { id },
            include: { creator: true }, // 👈 associations removed
        });
        if (!n)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: n.id, entityType: client_1.EntityType.NEWS },
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
    static async findBySlug(slug) {
        const n = await prisma_1.prisma.news.findUnique({
            where: { slug },
            include: { creator: true }, // 👈 associations removed
        });
        if (!n)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: { entityId: n.id, entityType: client_1.EntityType.NEWS },
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
    static async create(data) {
        const { title, description, content, language, isPublished, publishedDate, createdById, slug, } = data;
        return prisma_1.prisma.news.create({
            data: {
                title,
                description: description ?? null,
                content: content ?? null,
                language,
                isPublished,
                publishedDate: publishedDate ?? new Date(),
                slug,
                ...(createdById
                    ? { creator: { connect: { id: createdById } } }
                    : {}),
            },
        });
    }
    static async update(id, data) {
        const updateData = { ...data };
        if (data.createdById) {
            updateData.creator = { connect: { id: data.createdById } };
            delete updateData.createdById;
        }
        return prisma_1.prisma.news.update({
            where: { id },
            data: updateData,
        });
    }
    static async delete(id) {
        return prisma_1.prisma.news.delete({ where: { id } });
    }
}
exports.NewsRepository = NewsRepository;
