import { Request, Response, NextFunction } from "express";
import { cloudinary } from "./cloudinary";

export const uploadPartnerLogo = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  const file = req.file;

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "partners",
      overwrite: false,         // 🔥 required to match preset defaults
      use_filename: false,      // 🔥 override preset (avoid mismatch)
      unique_filename: true,    // 🔥 match preset default
      resource_type: "image",
    },
    (error, result) => {
      if (error) return next(error);

      if (result) {
        req.body.logoUrl = result.secure_url;
        req.body.logoPublicId = result.public_id;
      }
      next();
    }
  );

  uploadStream.end(file.buffer);
};
