"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const prisma_1 = require("../lib/prisma");
const cloudinary_1 = require("../config/cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
function isEntityType(v) {
    return [
        "NEWS",
        "EVENT",
        "PROJECT",
        "PARTNER",
        "HERO_SECTION",
        "GALLERY_COMPONENT",
    ].includes(v);
}
function resolveFolder(entityType) {
    const key = (entityType || "").toUpperCase();
    switch (key) {
        case "NEWS":
            return "mplats/news";
        case "EVENT":
            return "mplats/events";
        case "PROJECT":
            return "mplats/projects";
        case "PARTNER":
            return "mplats/partners";
        case "HERO_SECTION":
            return "mplats/hero";
        case "GALLERY_COMPONENT":
        default:
            return "mplats/gallery";
    }
}
exports.mediaService = {
    // ---------- Uploads ----------
    async uploadFileAndCreateRecord(opts) {
        const folder = resolveFolder(opts.entityType);
        const resourceType = (opts.mediaType || "IMAGE") === "VIDEO" ? "video" : "image";
        const result = await cloudinary_1.cloudinary.uploader.upload(opts.localFilePath, {
            folder,
            resource_type: resourceType,
            use_filename: false,
            unique_filename: true,
            overwrite: false,
        });
        try {
            await promises_1.default.unlink(opts.localFilePath);
        }
        catch { }
        const media = await prisma_1.prisma.media.create({
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                mediaType: (opts.mediaType || "IMAGE"),
                altText: opts.altText || null,
            },
            include: { associations: true },
        });
        return media;
    },
    async uploadUrlAndCreateRecord(opts) {
        const folder = resolveFolder(opts.entityType);
        const resourceType = (opts.mediaType || "IMAGE") === "VIDEO" ? "video" : "image";
        const result = await cloudinary_1.cloudinary.uploader.upload(opts.url, {
            folder,
            resource_type: resourceType,
            use_filename: false,
            unique_filename: true,
            overwrite: false,
        });
        const media = await prisma_1.prisma.media.create({
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                mediaType: (opts.mediaType || "IMAGE"),
                altText: opts.altText || null,
            },
            include: { associations: true },
        });
        return media;
    },
    // ---------- Queries ----------
    async getGallery() {
        const items = await prisma_1.prisma.media.findMany({
            orderBy: { createdAt: "desc" },
            include: { associations: true },
        });
        // "Gallery" = no associations OR explicitly associated to GALLERY_COMPONENT
        return items.filter((m) => m.associations.length === 0 ||
            m.associations.some((a) => a.entityType === "GALLERY_COMPONENT"));
    },
    // src/repositories/media.repository.ts
    async findById(id) {
        return prisma_1.prisma.media.findUnique({
            where: { id },
        });
    },
    async getByEntityType(entityType) {
        const key = (entityType || "GALLERY_COMPONENT").toUpperCase();
        if (!isEntityType(key)) {
            throw new Error("Invalid entityType");
        }
        return prisma_1.prisma.media.findMany({
            where: {
                associations: { some: { entityType: key } },
            },
            orderBy: { createdAt: "desc" },
            include: { associations: true },
        });
    },
    async getAll() {
        return prisma_1.prisma.media.findMany({
            orderBy: { createdAt: "desc" },
            include: { associations: true },
        });
    },
    // ---------- Mutations ----------
    // Enforce: SINGLE-ATTACH PER ENTITY TYPE
    async attach(mediaId, entityType, entityId, order) {
        const key = entityType.toUpperCase();
        if (!isEntityType(key))
            throw new Error("Invalid entityType");
        // Remove any existing association for this (mediaId, entityType)
        await prisma_1.prisma.mediaAssociation.deleteMany({
            where: { mediaId, entityType: key },
        });
        // Create the new one
        return prisma_1.prisma.mediaAssociation.create({
            data: {
                mediaId,
                entityId,
                entityType: key,
                order: order ?? null,
            },
        });
    },
    async detach(mediaId, entityType, entityId) {
        const key = entityType.toUpperCase();
        if (!isEntityType(key))
            throw new Error("Invalid entityType");
        if (entityId) {
            // Remove exactly this link
            return prisma_1.prisma.mediaAssociation.delete({
                where: {
                    mediaId_entityId_entityType: {
                        mediaId,
                        entityId,
                        entityType: key,
                    },
                },
            });
        }
        // Or remove any link for that type (convenience)
        return prisma_1.prisma.mediaAssociation.deleteMany({
            where: { mediaId, entityType: key },
        });
    },
    async remove(mediaId) {
        const media = await prisma_1.prisma.media.findUnique({ where: { id: mediaId } });
        if (media?.publicId) {
            try {
                const resourceType = media.mediaType === "VIDEO" ? "video" : "image";
                await cloudinary_1.cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
            }
            catch {
                // swallow cloudinary errors to avoid blocking DB cleanup
            }
        }
        await prisma_1.prisma.mediaAssociation.deleteMany({ where: { mediaId } });
        await prisma_1.prisma.media.delete({ where: { id: mediaId } });
    },
};
