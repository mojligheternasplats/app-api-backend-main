import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { signToken } from "../utils/jwt";

export class AuthService {
  static async register(email: string, password: string, firstName?: string, lastName?: string) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserRepository.create({ email, password: hashed, firstName, lastName, role: "ADMIN" });

    return { user, token: signToken({ id: user.id, role: user.role }) };
  }

  static async login(email: string, password: string) {
    console.log("login")
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  }
}
