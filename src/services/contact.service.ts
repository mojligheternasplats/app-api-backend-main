import { ContactRepository } from "../repositories/contact.repository";
import { ContactStatus } from "@prisma/client";

export class ContactService {
  static async getAll(page = 1, limit = 10, status?: ContactStatus) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ContactRepository.findAll({ skip, take: limit, status }),
      ContactRepository.count({ status }),
    ]);

    return {
      data: items,       // ✅ frontend expects `data`
      total,             // ✅ needed for pagination
      page,              // ✅ current page
      limit,             // ✅ page size
    };
  }

  static async getById(id: string) {
    return ContactRepository.findById(id);
  }

  static async createMessage(data: { name: string; email: string; message: string; subject?: string }) {
    return ContactRepository.create({
      name: data.name,
      email: data.email,
      message: data.message,
      subject: data.subject || "No subject",
      status: ContactStatus.UNREAD, // ✅ type-safe enum
    });
  }

  static async updateMessage(id: string, data: { status?: ContactStatus }) {
    return ContactRepository.update(id, data);
  }

  static async deleteMessage(id: string) {
    return ContactRepository.delete(id);
  }
}
