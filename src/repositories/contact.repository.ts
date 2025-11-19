import { prisma } from "../lib/prisma";
import { ContactMessage, ContactStatus } from "@prisma/client";

export class ContactRepository {
  static async findAll(params?: { skip?: number; take?: number; status?: ContactStatus }) {
    return prisma.contactMessage.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.status ? { status: params.status } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  static async count(params?: { status?: ContactStatus }) {
    return prisma.contactMessage.count({
      where: params?.status ? { status: params.status } : undefined,
    });
  }

  static async findById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } });
  }

  static async create(data: Omit<ContactMessage, "id" | "createdAt" | "updatedAt" | "status">) {
    return prisma.contactMessage.create({ data });
  }

  static async update(id: string, data: Partial<ContactMessage>) {
    return prisma.contactMessage.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  }
}
