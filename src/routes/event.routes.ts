import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllEvents);
router.get("/slug/:slug", getEventBySlug);
router.get("/:id", getEventById);

// Admin routes
router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
