import { Router } from "express";
import { login, register, me,updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.put("/profile", authMiddleware, updateProfile);
export default router;
