"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class ProjectRepository {
    /** -------------------------------------------
     *  FIND ALL PROJECTS
     * ------------------------------------------*/
    static async findAll(params) {
        const projects = await prisma_1.prisma.project.findMany({
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
        return Promise.all(projects.map(async (p) => {
            const media = await prisma_1.prisma.mediaAssociation.findMany({
                where: {
                    entityId: p.id,
                    entityType: client_1.EntityType.PROJECT,
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
        }));
    }
    /** -------------------------------------------
     *  COUNT PROJECTS
     * ------------------------------------------*/
    static async count(params) {
        return prisma_1.prisma.project.count({
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
    static async findById(id) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
            include: { creator: true },
        });
        if (!project)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: {
                entityId: project.id,
                entityType: client_1.EntityType.PROJECT,
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
    static async findBySlug(slug) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { slug },
            include: { creator: true },
        });
        if (!project)
            return null;
        const media = await prisma_1.prisma.mediaAssociation.findMany({
            where: {
                entityId: project.id,
                entityType: client_1.EntityType.PROJECT,
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
     * ------------------------------------------*/ static async create(data) {
        const { title, description, content, language, category, isPublished, order, createdById, } = data;
        // Generate base slug
        const baseSlug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        let slug = baseSlug;
        let i = 1;
        // Ensure slug is unique
        while (await prisma_1.prisma.project.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${i++}`;
        }
        return prisma_1.prisma.project.create({
            data: {
                title,
                slug,
                description: description ?? null,
                content: content ?? null,
                language: language ?? "Swedish",
                category: category ?? client_1.ProjectCategory.LOCAL,
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
    static async update(id, data) {
        const updateData = { ...data };
        // Convert createdById → creator.connect
        if (data.createdById) {
            updateData.creator = { connect: { id: data.createdById } };
            delete updateData.createdById;
        }
        return prisma_1.prisma.project.update({
            where: { id },
            data: updateData,
        });
    }
    /** -------------------------------------------
     *  DELETE PROJECT
     * ------------------------------------------*/
    static async delete(id) {
        return prisma_1.prisma.project.delete({
            where: { id },
        });
    }
}
exports.ProjectRepository = ProjectRepository;
