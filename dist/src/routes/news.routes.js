"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const news_controller_1 = require("../controllers/news.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/", news_controller_1.getAllNews);
router.get("/slug/:slug", news_controller_1.getNewsBySlug);
router.get("/:id", news_controller_1.getNewsById);
// Admin (protected)
router.post("/", auth_middleware_1.authMiddleware, news_controller_1.createNews);
router.put("/:id", auth_middleware_1.authMiddleware, news_controller_1.updateNews);
router.delete("/:id", auth_middleware_1.authMiddleware, news_controller_1.deleteNews);
exports.default = router;
