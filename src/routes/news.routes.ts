

import { Router } from "express";
import {
  getAllNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/", getAllNews);
router.get("/slug/:slug", getNewsBySlug);
router.get("/:id", getNewsById);

// Admin (protected)
router.post("/", authMiddleware, createNews);
router.put("/:id", authMiddleware, updateNews);
router.delete("/:id", authMiddleware, deleteNews);

export default router;
