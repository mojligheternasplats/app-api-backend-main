"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repositories/user.repository");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async register(email, password, firstName, lastName) {
        const existing = await user_repository_1.UserRepository.findByEmail(email);
        if (existing)
            throw new Error("User already exists");
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await user_repository_1.UserRepository.create({ email, password: hashed, firstName, lastName, role: "ADMIN" });
        return { user, token: (0, jwt_1.signToken)({ id: user.id, role: user.role }) };
    }
    static async login(email, password) {
        console.log("login");
        const user = await user_repository_1.UserRepository.findByEmail(email);
        if (!user) {
            // Email not registered
            const error = new Error("EMAIL_NOT_FOUND");
            error.code = "EMAIL_NOT_FOUND";
            throw error;
        }
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            // Password is wrong
            const error = new Error("WRONG_PASSWORD");
            error.code = "WRONG_PASSWORD";
            throw error;
        }
        const token = (0, jwt_1.signToken)({ id: user.id, role: user.role });
        return { user, token };
    }
}
exports.AuthService = AuthService;
