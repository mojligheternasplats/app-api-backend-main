import { prisma } from "../lib/prisma";
import { cloudinary } from "../config/cloudinary";
import fs from "fs/promises";

type EntityType =
  | "NEWS"
  | "EVENT"
  | "PROJECT"
  | "PARTNER"
  | "HERO_SECTION"
  | "GALLERY_COMPONENT";

type MediaType = "IMAGE" | "VIDEO";

function isEntityType(v: string): v is EntityType {
  return [
    "NEWS",
    "EVENT",
    "PROJECT",
    "PARTNER",
    "HERO_SECTION",
    "GALLERY_COMPONENT",
  ].includes(v);
}

function resolveFolder(entityType?: string): string {
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

export const mediaService = {
  // ---------- Uploads ----------
  async uploadFileAndCreateRecord(opts: {
    localFilePath: string;
    title?: string;
    altText?: string;
    description?: string;
    entityType?: string; // only affects folder choice
    mediaType?: MediaType; // default IMAGE
  }) {
    const folder = resolveFolder(opts.entityType);
    const resourceType = (opts.mediaType || "IMAGE") === "VIDEO" ? "video" : "image";

    const result = await cloudinary.uploader.upload(opts.localFilePath, {
      folder,
      resource_type: resourceType,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
    });

    try {
      await fs.unlink(opts.localFilePath);
    } catch {}

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        mediaType: (opts.mediaType || "IMAGE") as any,
      
        altText: opts.altText || null,
    
      },
      include: { associations: true },
    });

    return media;
  },

  async uploadUrlAndCreateRecord(opts: {
    url: string;
    title?: string;
    altText?: string;
    description?: string;
    entityType?: string; // only affects folder
    mediaType?: MediaType; // default IMAGE
  }) {
    const folder = resolveFolder(opts.entityType);
    const resourceType = (opts.mediaType || "IMAGE") === "VIDEO" ? "video" : "image";

    const result = await cloudinary.uploader.upload(opts.url, {
      folder,
      resource_type: resourceType,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
    });

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        mediaType: (opts.mediaType || "IMAGE") as any,

        altText: opts.altText || null,
       
      },
      include: { associations: true },
    });

    return media;
  },

  // ---------- Queries ----------
  async getGallery() {
    const items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });

    // "Gallery" = no associations OR explicitly associated to GALLERY_COMPONENT
    return items.filter(
      (m) =>
        m.associations.length === 0 ||
        m.associations.some((a) => a.entityType === "GALLERY_COMPONENT")
    );
  },
// src/repositories/media.repository.ts


 async findById(id: string) {
    return prisma.media.findUnique({
      where: { id },
    });
  },

  async getByEntityType(entityType?: string) {
    const key = (entityType || "GALLERY_COMPONENT").toUpperCase();
    if (!isEntityType(key)) {
      throw new Error("Invalid entityType");
    }
    return prisma.media.findMany({
      where: {
        associations: { some: { entityType: key as any } },
      },
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });
  },

  async getAll() {
    return prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });
  },

  // ---------- Mutations ----------
  // Enforce: SINGLE-ATTACH PER ENTITY TYPE
  async attach(mediaId: string, entityType: string, entityId: string, order?: number) {
    const key = entityType.toUpperCase();
    if (!isEntityType(key)) throw new Error("Invalid entityType");

    // Remove any existing association for this (mediaId, entityType)
    await prisma.mediaAssociation.deleteMany({
      where: { mediaId, entityType: key as any },
    });

    // Create the new one
    return prisma.mediaAssociation.create({
      data: {
        mediaId,
        entityId,
        entityType: key as any,
        order: order ?? null,
      },
    });
  },

  async detach(mediaId: string, entityType: string, entityId?: string) {
    const key = entityType.toUpperCase();
    if (!isEntityType(key)) throw new Error("Invalid entityType");

    if (entityId) {
      // Remove exactly this link
      return prisma.mediaAssociation.delete({
        where: {
          mediaId_entityId_entityType: {
            mediaId,
            entityId,
            entityType: key as any,
          },
        },
      });
    }
    // Or remove any link for that type (convenience)
    return prisma.mediaAssociation.deleteMany({
      where: { mediaId, entityType: key as any },
    });
  },

  async remove(mediaId: string) {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });

    if (media?.publicId) {
      try {
        const resourceType = media.mediaType === "VIDEO" ? "video" : "image";
        await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
      } catch {
        // swallow cloudinary errors to avoid blocking DB cleanup
      }
    }

    await prisma.mediaAssociation.deleteMany({ where: { mediaId } });
    await prisma.media.delete({ where: { id: mediaId } });
  },
};
