"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const client_1 = require("@prisma/client");
class UserService {
    static async updateUser(id, payload) {
        if (!id)
            throw new Error("User ID is required for update");
        // ✅ Only allow specific fields to be updated
        const allowedFields = ["firstName", "lastName", "email", "role"];
        const data = {};
        for (const key of allowedFields) {
            if (payload[key] !== undefined) {
                data[key] = payload[key];
            }
        }
        // Prevent invalid role
        if (data.role && !Object.values(client_1.UserRole).includes(data.role)) {
            throw new Error("Invalid role value");
        }
        return user_repository_1.UserRepository.update(id, data);
    }
    static async deleteUser(id) {
        if (!id)
            throw new Error("User ID is required for delete");
        return user_repository_1.UserRepository.delete(id);
    }
    static async getAllUsers() {
        return user_repository_1.UserRepository.getAll();
    }
}
exports.UserService = UserService;
