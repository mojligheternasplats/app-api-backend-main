"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerRepository = void 0;
const prisma_1 = require("../lib/prisma");
class PartnerRepository {
    // ---------------------------
    // FIND ALL
    // ---------------------------
    static async findAll(params) {
        return prisma_1.prisma.partner.findMany({
            skip: params?.skip,
            take: params?.take,
            where: params?.search
                ? {
                    OR: [
                        { name: { contains: params.search, mode: "insensitive" } },
                        { description: { contains: params.search, mode: "insensitive" } },
                    ],
                }
                : undefined,
            orderBy: { order: "asc" },
        });
    }
    // ---------------------------
    // COUNT
    // ---------------------------
    static async count(params) {
        return prisma_1.prisma.partner.count({
            where: params?.search
                ? {
                    OR: [
                        { name: { contains: params.search, mode: "insensitive" } },
                        { description: { contains: params.search, mode: "insensitive" } },
                    ],
                }
                : undefined,
        });
    }
    // ---------------------------
    // FIND BY ID
    // ---------------------------
    static async findById(id) {
        return prisma_1.prisma.partner.findUnique({
            where: { id },
        });
    }
    // ---------------------------
    // FIND BY SLUG
    // ---------------------------
    static async findBySlug(slug) {
        return prisma_1.prisma.partner.findUnique({
            where: { slug },
        });
    }
    // ---------------------------
    // CREATE
    // ---------------------------
    static async create(data) {
        return prisma_1.prisma.partner.create({ data });
    }
    // ---------------------------
    // UPDATE
    // ---------------------------
    static async update(id, data) {
        return prisma_1.prisma.partner.update({
            where: { id },
            data,
        });
    }
    // ---------------------------
    // DELETE
    // ---------------------------
    static async delete(id) {
        return prisma_1.prisma.partner.delete({
            where: { id },
        });
    }
}
exports.PartnerRepository = PartnerRepository;
