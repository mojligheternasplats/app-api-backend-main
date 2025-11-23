"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRepository = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class ContactRepository {
    static async findAll(params) {
        return prisma_1.prisma.contactMessage.findMany({
            skip: params?.skip,
            take: params?.take,
            where: params?.status ? { status: params.status } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }
    static async count(params) {
        return prisma_1.prisma.contactMessage.count({
            where: params?.status ? { status: params.status } : undefined,
        });
    }
    static async findById(id) {
        return prisma_1.prisma.contactMessage.findUnique({ where: { id } });
    }
    static async create(data) {
        return prisma_1.prisma.contactMessage.create({
            data: {
                name: data.name,
                email: data.email,
                message: data.message,
                subject: data.subject,
                status: data.status ?? client_1.ContactStatus.UNREAD,
            },
        });
    }
    static async update(id, data) {
        return prisma_1.prisma.contactMessage.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma_1.prisma.contactMessage.delete({ where: { id } });
    }
}
exports.ContactRepository = ContactRepository;
