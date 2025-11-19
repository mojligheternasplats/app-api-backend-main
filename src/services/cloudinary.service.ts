import {cloudinary} from "../config/cloudinary";

export class CloudinaryService {
  static async uploadMedia(
    fileBuffer: Buffer,
    fileName: string,
    entityType: string
  ) {
    const folder = CloudinaryService.getFolder(entityType);

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: fileName.split(".")[0],
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", error);
            return reject(error);
          }

          resolve({
            url: result?.secure_url,
            publicId: result?.public_id,
          });
        }
      );

      stream.end(fileBuffer);
    });
  }

  private static getFolder(entityType: string) {
    switch (entityType.toLowerCase()) {
      case "news":
        return "mplats/news";
      case "event":
        return "mplats/events";
      case "project":
        return "mplats/projects";
      case "partner":
        return "mplats/partners";
      case "hero":
      case "hero_section":
        return "mplats/hero";
      case "gallery":
      case "gallery_component":
        return "mplats/gallery";
      default:
        return "mplats/others";
    }
  }
}

export const cloudinaryService = CloudinaryService;
