"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partner_controller_1 = require("../controllers/partner.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// 🔥 You already have this from your media system
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// 🔥 Your new logo upload middleware (from config folder)
const uploadPartnerLogo_1 = require("../config/uploadPartnerLogo");
const router = (0, express_1.Router)();
// ----------------------
// Public Routes
// ----------------------
router.get("/", partner_controller_1.getAllPartners);
router.get("/slug/:slug", partner_controller_1.getPartnerBySlug);
router.get("/:id", partner_controller_1.getPartnerById);
// ----------------------
// Admin Routes (with file upload)
// ----------------------
// CREATE partner + upload logo
router.post("/", auth_middleware_1.authMiddleware, upload.single("logo"), // <input name="logo">
uploadPartnerLogo_1.uploadPartnerLogo, // Cloudinary upload → writes logoUrl + logoPublicId
partner_controller_1.createPartner);
// UPDATE partner + optional new logo
router.put("/:id", auth_middleware_1.authMiddleware, upload.single("logo"), // optional file upload
uploadPartnerLogo_1.uploadPartnerLogo, partner_controller_1.updatePartner);
// DELETE partner
router.delete("/:id", auth_middleware_1.authMiddleware, partner_controller_1.deletePartner);
exports.default = router;
