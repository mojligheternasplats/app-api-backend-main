"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public: contact form submissions
router.post("/", contact_controller_1.createMessage);
// Admin: manage messages
router.get("/", contact_controller_1.getAllMessages);
router.get("/:id", auth_middleware_1.authMiddleware, contact_controller_1.getMessageById);
router.put("/:id", auth_middleware_1.authMiddleware, contact_controller_1.updateMessage);
router.delete("/:id", auth_middleware_1.authMiddleware, contact_controller_1.deleteMessage);
exports.default = router;
