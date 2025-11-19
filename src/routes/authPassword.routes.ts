import { Router } from "express";
import { AuthService } from "../services/mail.service";

const router = Router();

/**
 * @route POST /api/auth/forgot-password
 * Public - User requests password reset
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });

    const result = await AuthService.forgotPassword(email);

    return res.json(result);
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while requesting reset password",
    });
  }
});

/**
 * @route POST /api/auth/reset-password
 * Public - User submits new password with token
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });

    const result = await AuthService.resetPassword(token, password);

    return res.json(result);
  } catch (error: any) {
    console.error("Reset password error:", error);

    const status = error?.status ?? 500;
    return res.status(status).json({
      success: false,
      message: error?.message || "Failed to reset password",
    });
  }
});

export default router;
