import { Router } from "express";
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/contact.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public: contact form submissions
router.post("/", createMessage);

// Admin: manage messages
router.get("/",  getAllMessages);
router.get("/:id", authMiddleware, getMessageById);
router.put("/:id", authMiddleware, updateMessage);
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
