import { Request, Response, NextFunction } from "express";
import { cloudinary } from "./cloudinary";
import streamifier from "streamifier";

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
  if (!req.file) return next();

  const file = req.file;
  const folder = resolveFolder(req.body.entityType);

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: "auto",
      overwrite: false,        // 🔥 match preset
      use_filename: false,     // 🔥 avoid conflicts
      unique_filename: true,   // 🔥 match preset
    },
    (error, result) => {
      if (error) return next(error);

      if (result) {
        req.body.url = result.secure_url;
        req.body.publicId = result.public_id;
        req.body.mediaType = result.resource_type.toUpperCase();
      }

      next();
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
};
