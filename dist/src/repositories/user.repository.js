"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
class UserRepository {
    static async findByEmail(email) {
        if (!email) {
            throw new Error("Email is required to find user");
        }
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    static async findById(id) {
        if (!id) {
            throw new Error("User ID is required to find user");
        }
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    static async create(data) {
        console.log("Creating user with data:", data);
        return prisma_1.prisma.user.create({ data });
    }
    static async update(id, data) {
        if (!id)
            throw new Error("User ID is required for update");
        return prisma_1.prisma.user.update({
            where: { id },
            data,
        });
    }
    static async getAll() {
        return prisma_1.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    static async delete(id) {
        if (!id)
            throw new Error("User ID is required for delete");
        return prisma_1.prisma.user.delete({
            where: { id },
        });
    }
}
exports.UserRepository = UserRepository;
