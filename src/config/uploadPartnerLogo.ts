import { Request, Response, NextFunction } from "express";
import { cloudinary } from "./cloudinary";

export const uploadPartnerLogo = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next(); // no logo uploaded

  const file = req.file;

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "partners/logos", // folder is optional but recommended
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
