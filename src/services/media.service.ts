import { prisma } from "../lib/prisma";
import { cloudinary } from "../config/cloudinary";
import { EntityType, MediaType } from "@prisma/client";

/* ------------------------------
   RESOLVE CLOUDINARY FOLDER
-------------------------------- */
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
  /* ------------------------------
      CREATE RECORD AFTER UPLOAD
      (uploadMedia middleware already did Cloudinary upload)
  -------------------------------- */
  async createRecord(opts: {
    url: string;
    publicId: string;
    entityType?: string;
    altText?: string;
    mediaType: MediaType;
  }) {
    return prisma.media.create({
      data: {
        url: opts.url,
        publicId: opts.publicId,
        altText: opts.altText ?? null,
        mediaType: opts.mediaType,
      },
    });
  },

  /* ------------------------------
      UPLOAD FROM URL
  -------------------------------- */
  async uploadUrlAndCreateRecord(opts: {
    url: string;
    entityType?: string;
    altText?: string;
    mediaType: MediaType;
  }) {
    const folder = resolveFolder(opts.entityType);

    const resourceType =
      opts.mediaType === MediaType.VIDEO ? "video" : "image";

    const result = await cloudinary.uploader.upload(opts.url, {
      folder,
      resource_type: resourceType,
      unique_filename: true,
      overwrite: false,
    });

    return prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        altText: opts.altText ?? null,
        mediaType: opts.mediaType,
      },
    });
  },

  /* ------------------------------
      GALLERY
  -------------------------------- */
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

  /* ------------------------------
      GET MEDIA BY ENTITY TYPE
  -------------------------------- */
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

  /* ------------------------------
      ATTACH MEDIA
  -------------------------------- */
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

  /* ------------------------------
      GET ONE MEDIA
  -------------------------------- */
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

  /* ------------------------------
      GET ALL MEDIA
  -------------------------------- */
  async getAll() {
    return prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: { associations: true },
    });
  },

  /* ------------------------------
      DETACH MEDIA
  -------------------------------- */
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

  /* ------------------------------
      REMOVE MEDIA
  -------------------------------- */
  async remove(mediaId: string) {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });

    if (media?.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId, {
          resource_type: "image",
        });
      } catch { }
    }

    await prisma.mediaAssociation.deleteMany({ where: { mediaId } });
    await prisma.media.delete({ where: { id: mediaId } });
  },
};
