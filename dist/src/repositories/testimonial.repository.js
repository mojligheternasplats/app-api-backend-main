"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialRepository = void 0;
const prisma_1 = require("../lib/prisma");
class TestimonialRepository {
    static async findAll() {
        return prisma_1.prisma.youthTestimonial.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
        });
    }
    static async findAllAdmin() {
        return prisma_1.prisma.youthTestimonial.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    static async create(data) {
        return prisma_1.prisma.youthTestimonial.create({ data });
    }
    static async update(id, data) {
        return prisma_1.prisma.youthTestimonial.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma_1.prisma.youthTestimonial.delete({
            where: { id },
        });
    }
    static async publish(id, isPublished) {
        return prisma_1.prisma.youthTestimonial.update({
            where: { id },
            data: { isPublished },
        });
    }
}
exports.TestimonialRepository = TestimonialRepository;
