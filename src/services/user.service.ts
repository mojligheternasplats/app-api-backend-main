import { UserRepository } from "../repositories/user.repository";
import { UserRole } from "@prisma/client";

export class UserService {
  static async getProfile(id: string) {
    return UserRepository.findById(id);
  }

  static async updateUser(id: string, payload: any) {
    if (!id) throw new Error("User ID is required for update");

    // ✅ Only allow specific fields to be updated
    const allowedFields = ["firstName", "lastName", "email", "role"];
    const data: any = {};

    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        data[key] = payload[key];
      }
    }

    // Prevent invalid role
    if (data.role && !Object.values(UserRole).includes(data.role)) {
      throw new Error("Invalid role value");
    }

    return UserRepository.update(id, data);
  }

  static async deleteUser(id: string) {
    if (!id) throw new Error("User ID is required for delete");
    return UserRepository.delete(id);
  }

  static async getAllUsers() {
    return UserRepository.getAll();
  }
}
