"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("../controllers/media.controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "tmp/" });
const router = (0, express_1.Router)();
// Public-ish
router.get("/gallery", media_controller_1.mediaController.getGallery);
router.get("/all", media_controller_1.mediaController.getAll);
router.get("/", media_controller_1.mediaController.getMedia); // ?entityType=NEWS|EVENT|...
// 🔥 IMPORTANT — GET ONE MEDIA BY ID
router.get("/:id", media_controller_1.mediaController.getOne);
// Uploads
router.post("/file", upload.single("file"), media_controller_1.mediaController.uploadFile);
router.post("/url", media_controller_1.mediaController.uploadUrl);
// Associations
router.post("/attach", media_controller_1.mediaController.attachMedia);
router.post("/detach", media_controller_1.mediaController.detachMedia);
// Delete media
router.delete("/:id", media_controller_1.mediaController.remove);
exports.default = router;
