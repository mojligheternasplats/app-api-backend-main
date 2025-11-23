"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", event_controller_1.getAllEvents);
router.get("/slug/:slug", event_controller_1.getEventBySlug);
router.get("/:id", event_controller_1.getEventById);
// Admin routes
router.post("/", auth_middleware_1.authMiddleware, event_controller_1.createEvent);
router.put("/:id", auth_middleware_1.authMiddleware, event_controller_1.updateEvent);
router.delete("/:id", auth_middleware_1.authMiddleware, event_controller_1.deleteEvent);
exports.default = router;
