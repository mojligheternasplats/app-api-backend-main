"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_repository_1 = require("../repositories/contact.repository");
const client_1 = require("@prisma/client");
class ContactService {
    static async getAll(page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            contact_repository_1.ContactRepository.findAll({ skip, take: limit, status }),
            contact_repository_1.ContactRepository.count({ status }),
        ]);
        return {
            data: items, // ✅ frontend expects `data`
            total, // ✅ needed for pagination
            page, // ✅ current page
            limit, // ✅ page size
        };
    }
    static async getById(id) {
        return contact_repository_1.ContactRepository.findById(id);
    }
    static async createMessage(data) {
        return contact_repository_1.ContactRepository.create({
            name: data.name,
            email: data.email,
            message: data.message,
            subject: data.subject || "No subject",
            status: client_1.ContactStatus.UNREAD, // ✅ type-safe enum
        });
    }
    static async updateMessage(id, data) {
        return contact_repository_1.ContactRepository.update(id, data);
    }
    static async deleteMessage(id) {
        return contact_repository_1.ContactRepository.delete(id);
    }
}
exports.ContactService = ContactService;
