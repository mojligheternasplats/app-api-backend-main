import { prisma } from "../lib/prisma";
import { cloudinary } from "../config/cloudinary";
import { EntityType } from "@prisma/client";
import fs from "fs/promises";


// Resolve folder based on entity type (affects Cloudinary storage path only)
function resolveFolder(rawEntityType?: string): string {
  const key = rawEntityType?.toUpperCase() as EntityType | undefined;

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

export const mediaService = {
  // Upload from local temp file (multer)
  async uploadFileAndCreateRecord(opts: {
    localFilePath: string;
    entityType?: string;
    mediaType: string; // "IMAGE" or "VIDEO"
  }) {
    const folder = resolveFolder(opts.entityType);

    const result = await cloudinary.uploader.upload(opts.localFilePath, {
      folder,
      resource_type: "image",
      unique_filename: true,
      overwrite: false,
    });

    try {
      await fs.unlink(opts.localFilePath);
    } catch {}

    return prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        mediaType: "IMAGE",
      },
    });
  },

  // Upload from remote URL
  async uploadUrlAndCreateRecord(opts: {
    url: string;
    entityType?: string;
    mediaType: string;
  }) {
    const folder = resolveFolder(opts.entityType);

    const result = await cloudinary.uploader.upload(opts.url, {
      folder,
      resource_type: "image",
      unique_filename: true,
      overwrite: false,
    });

    return prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        mediaType: "IMAGE",
      },
    });
  },

  // Gallery = all media not linked OR linked to GALLERY_COMPONENT
  async getGallery() {
    const items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });

    return items.filter(
      (m) =>
        m.associations.length === 0 ||
        m.associations.some((a) => a.entityType === "GALLERY_COMPONENT")
    );
  },

  // Fetch only linked media for entity
  async getByEntityType(entityType: string) {
    const key = entityType.toUpperCase() as EntityType;

    return prisma.media.findMany({
      where: {
        associations: { some: { entityType: key } },
      },
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });
  },

  // Attach
  async attach(mediaId: string, entityType: string, entityId: string, order?: number) {
    return prisma.mediaAssociation.create({
      data: {
        mediaId,
        entityId,
        entityType: entityType.toUpperCase() as EntityType,
        order: order ?? null,
      },
    });
  },

  // Get one
  async getOne(id: string) {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      const error: any = new Error("Media not found");
      error.statusCode = 404;
      throw error;
    }

    return media;
  },

  // Get all
  async getAll() {
    return prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });
  },

  // Detach
  async detach(mediaId: string, entityType: string, entityId: string) {
    return prisma.mediaAssociation.delete({
      where: {
        mediaId_entityId_entityType: {
          mediaId,
          entityId,
          entityType: entityType.toUpperCase() as EntityType,
        },
      },
    });
  },

  // Remove media + Cloudinary + associations
  async remove(mediaId: string) {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });

    if (media?.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId, {
          resource_type: "image",
        });
      } catch {}
    }

    await prisma.mediaAssociation.deleteMany({ where: { mediaId } });
    await prisma.media.delete({ where: { id: mediaId } });
  },
};
