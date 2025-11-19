import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { sendMail } from "../utils/mailService"; // uses your One.com SMTP config

export class AuthService {
  // -------------------------
  // 1️⃣ FORGOT PASSWORD
  // -------------------------
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    // ❗Do NOT reveal if user exists - security best practice
    if (!user) return { success: true, message: "If that email exists, a reset link has been sent." };

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpires: expires,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send Email
    await sendMail(
      email,
      "Password Reset Request",
      `Reset your password using this link: ${resetUrl}`,
      `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color: blue; font-weight: bold;" target="_blank">
          Reset my password
        </a>
        <p>This link is valid for 1 hour.</p>
      `
    );

    return { success: true, message: "If that email exists, a reset link has been sent." };
  }

  // -------------------------
  // 2️⃣ RESET PASSWORD
  // -------------------------
  static async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpires: { gt: new Date() }, // must not be expired
      },
    });

    if (!user) {
      throw { status: 400, message: "Invalid or expired reset token." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
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
