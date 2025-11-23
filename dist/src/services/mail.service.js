"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const mailService_1 = require("../utils/mailService"); // uses your One.com SMTP config
class AuthService {
    // -------------------------
    // 1️⃣ FORGOT PASSWORD
    // -------------------------
    static async forgotPassword(email) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        // ❗Do NOT reveal if user exists - security best practice
        if (!user)
            return { success: true, message: "If that email exists, a reset link has been sent." };
        // Generate token
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        // Hash token before storing in DB
        const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await prisma_1.prisma.user.update({
            where: { email },
            data: {
                resetToken: hashedToken,
                resetTokenExpires: expires,
            },
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // Send Email
        await (0, mailService_1.sendMail)(email, "Password Reset Request", `Reset your password using this link: ${resetUrl}`, `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color: blue; font-weight: bold;" target="_blank">
          Reset my password
        </a>
        <p>This link is valid for 1 hour.</p>
      `);
        return { success: true, message: "If that email exists, a reset link has been sent." };
    }
    // -------------------------
    // 2️⃣ RESET PASSWORD
    // -------------------------
    static async resetPassword(token, newPassword) {
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpires: { gt: new Date() }, // must not be expired
            },
        });
        if (!user) {
            throw { status: 400, message: "Invalid or expired reset token." };
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });
        return { success: true, message: "Password has been reset successfully." };
    }
}
exports.AuthService = AuthService;
