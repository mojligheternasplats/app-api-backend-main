import { prisma } from "../lib/prisma";
import { cloudinary } from "../config/cloudinary";

export class TestimonialRepository {
  static async findAll() {
    return prisma.youthTestimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findAllAdmin() {
    return prisma.youthTestimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(data: any) {
    return prisma.youthTestimonial.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.youthTestimonial.update({
      where: { id },
      data,
    });
  }

  /** ---------------------------------
   *  DELETE testimonial + Cloudinary image
   * ---------------------------------- */
  static async delete(id: string) {
    // 1. Get testimonial
    const testimonial = await prisma.youthTestimonial.findUnique({
      where: { id },
    });

    if (!testimonial) return null;

    // 2. Remove Cloudinary image (if exists)
    if (testimonial.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(testimonial.imagePublicId, {
          resource_type: "image",
        });
      } catch (error) {
        console.error("Cloudinary delete failed:", error);
      }
    }

    // 3. Delete DB record
    return prisma.youthTestimonial.delete({
      where: { id },
    });
  }

  static async publish(id: string, isPublished: boolean) {
    return prisma.youthTestimonial.update({
      where: { id },
      data: { isPublished },
    });
  }
}
