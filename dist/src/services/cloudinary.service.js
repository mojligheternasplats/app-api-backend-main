"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = exports.CloudinaryService = void 0;
const cloudinary_1 = require("../config/cloudinary");
class CloudinaryService {
    static async uploadMedia(fileBuffer, fileName, entityType) {
        const folder = CloudinaryService.getFolder(entityType);
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                folder,
                resource_type: "auto",
                public_id: fileName.split(".")[0],
            }, (error, result) => {
                if (error) {
                    console.error("❌ Cloudinary Upload Error:", error);
                    return reject(error);
                }
                resolve({
                    url: result?.secure_url,
                    publicId: result?.public_id,
                });
            });
            stream.end(fileBuffer);
        });
    }
    static getFolder(entityType) {
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
exports.CloudinaryService = CloudinaryService;
exports.cloudinaryService = CloudinaryService;
