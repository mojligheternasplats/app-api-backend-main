import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { sendMail } from "../utils/mailService";

export class AuthService {
  // -------------------------
  // 1️⃣ FORGOT PASSWORD
  // -------------------------
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    // ❗ Security Best Practice: Do NOT reveal if user exists
    if (!user) {
      return { success: true, message: "If that email exists, a reset link has been sent." };
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("🔑 Your Plain Reset Token:", resetToken);
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

    // Fix: Safely handle trailing slashes in process.env.FRONTEND_URL
    const baseUrl = (process.env.FRONTEND_URL || "https://admin.mplats.se").replace(/\/$/, "");
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Fix: Catch email sending errors so SMTP issues don't crash the request silently
    try {
      await sendMail(
        email,
        "Password Reset Request",
        `Reset your password using this link: ${resetUrl}`,
        `
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <p>
            <a href="${resetUrl}" style="color: #2563eb; font-weight: bold;" target="_blank">
              Reset my password
            </a>
          </p>
          <p>This link is valid for 1 hour.</p>
        `
      );
    } catch (mailError) {
      console.error("Failed to send password reset email:", mailError);
      // Still return success to prevent user enumeration
    }

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
        resetTokenExpires: { gt: new Date() }, // Must not be expired
      },
    });

    if (!user) {
      // Fix: Use standard Error object for better Express middleware support
      const error = new Error("Invalid or expired reset token.") as any;
      error.status = 400;
      throw error;
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