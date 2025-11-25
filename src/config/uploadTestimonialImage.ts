import { Request, Response, NextFunction } from "express";
import { cloudinary } from "./cloudinary";

export const uploadTestimonialImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next(); // no file uploaded

  const file = req.file;

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "mplats/testimonials", // 🔥 correct folder
      overwrite: false,              // 🔥 matches preset
      use_filename: false,           // 🔥 avoid Cloudinary signature problems
      unique_filename: true,         // 🔥 required
      resource_type: "image",
    },
    (error, result) => {
      if (error) return next(error);

      if (result) {
        req.body.imageUrl = result.secure_url;
        req.body.imagePublicId = result.public_id;
      }

      next();
    }
  );

  uploadStream.end(file.buffer);
};
