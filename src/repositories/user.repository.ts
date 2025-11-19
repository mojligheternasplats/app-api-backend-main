import { prisma } from "../lib/prisma";
import { User, UserRole, Prisma } from "@prisma/client";

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new Error("Email is required to find user");
    }
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string): Promise<User | null> {
    if (!id) {
      throw new Error("User ID is required to find user");
    }
    return prisma.user.findUnique({ where: { id } });
  }

  static async create(data: { email: string; password: string; role?: UserRole; firstName?: string; lastName?: string }) {
    console.log("Creating user with data:", data);
    return prisma.user.create({ data });
  }

  static async update(id: string, data: Prisma.UserUpdateInput) {
    if (!id) throw new Error("User ID is required for update");

    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async getAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async delete(id: string) {
    if (!id) throw new Error("User ID is required for delete");

    return prisma.user.delete({
      where: { id },
    });
  }
}
