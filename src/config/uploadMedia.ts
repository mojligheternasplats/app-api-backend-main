import { Request, Response, NextFunction } from "express";
import { cloudinary } from "./cloudinary";
import streamifier from "streamifier";

// Helper to resolve folder based on entityType
function resolveFolder(entityType?: string): string {
  switch (entityType?.toUpperCase()) {
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

export const uploadMedia = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next(); // no file uploaded

  const file = req.file;
  const folder = resolveFolder(req.body.entityType);

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: "auto", // auto-detect IMAGE/VIDEO/etc.
      unique_filename: true,
      overwrite: false,
    },
    (error, result) => {
      if (error) return next(error);

      if (result) {
        req.body.url = result.secure_url;
        req.body.publicId = result.public_id;
        req.body.mediaType = result.resource_type.toUpperCase(); // IMAGE, VIDEO, etc.
      }
      next();
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
};
