"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const prisma_1 = require("../lib/prisma");
const cloudinary_1 = require("../config/cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
// Resolve folder based on entity type (affects Cloudinary storage path only)
function resolveFolder(rawEntityType) {
    const key = rawEntityType?.toUpperCase();
    switch (key) {
        case "NEWS":
            return "mplats/news";
        case "EVENT":
            return "mplats/events";
        case "PROJECT":
            return "mplats/projects";
        case "PARTNER":
            return "mplats/partners";
        case "GALLERY_COMPONENT":
        default:
            return "mplats/gallery";
    }
}
exports.mediaService = {
    // Upload from local temp file (multer)
    async uploadFileAndCreateRecord(opts) {
        const folder = resolveFolder(opts.entityType);
        const result = await cloudinary_1.cloudinary.uploader.upload(opts.localFilePath, {
            folder,
            resource_type: "image",
            unique_filename: true,
            overwrite: false,
        });
        try {
            await promises_1.default.unlink(opts.localFilePath);
        }
        catch { }
        return prisma_1.prisma.media.create({
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                altText: result.altText,
                mediaType: "IMAGE",
            },
        });
    },
    // Upload from remote URL
    async uploadUrlAndCreateRecord(opts) {
        const folder = resolveFolder(opts.entityType);
        const result = await cloudinary_1.cloudinary.uploader.upload(opts.url, {
            folder,
            resource_type: "image",
            unique_filename: true,
            overwrite: false,
        });
        return prisma_1.prisma.media.create({
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                altText: result.altText,
                mediaType: "IMAGE",
            },
        });
    },
    // Gallery = all media not linked OR linked to GALLERY_COMPONENT
    async getGallery() {
        const items = await prisma_1.prisma.media.findMany({
            orderBy: { createdAt: "desc" },
            include: { associations: true },
        });
        return items.filter((m) => m.associations.length === 0 ||
            m.associations.some((a) => a.entityType === "GALLERY_COMPONENT"));
    },
    // Fetch only linked media for entity
    async getByEntityType(entityType) {
        const key = entityType.toUpperCase();
        return prisma_1.prisma.media.findMany({
            where: {
                associations: { some: { entityType: key } },
            },
            orderBy: { createdAt: "desc" },
            include: { associations: true },
        });
    },
    // Attach
    async attach(mediaId, entityType, entityId, order) {
        return prisma_1.prisma.mediaAssociation.create({
            data: {
                mediaId,
                entityId,
                entityType: entityType.toUpperCase(),
                order: order ?? null,
            },
        });
    },
    // Get one
    async getOne(id) {
        const media = await prisma_1.prisma.media.findUnique({
            where: { id },
        });
        if (!media) {
            const error = new Error("Media not found");
            error.statusCode = 404;
            throw error;
        }
        return media;
    },
    // Get all
    async getAll() {
        return prisma_1.prisma.media.findMany({
            orderBy: { createdAt: "desc" },
            include: { associations: true },
        });
    },
    // Detach
    async detach(mediaId, entityType, entityId) {
        return prisma_1.prisma.mediaAssociation.delete({
            where: {
                mediaId_entityId_entityType: {
                    mediaId,
                    entityId,
                    entityType: entityType.toUpperCase(),
                },
            },
        });
    },
    // Remove media + Cloudinary + associations
    async remove(mediaId) {
        const media = await prisma_1.prisma.media.findUnique({ where: { id: mediaId } });
        if (media?.publicId) {
            try {
                await cloudinary_1.cloudinary.uploader.destroy(media.publicId, {
                    resource_type: "image",
                });
            }
            catch { }
        }
        await prisma_1.prisma.mediaAssociation.deleteMany({ where: { mediaId } });
        await prisma_1.prisma.media.delete({ where: { id: mediaId } });
    },
};
