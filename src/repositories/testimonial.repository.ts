import { prisma } from "../lib/prisma";

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

  static async delete(id: string) {
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
