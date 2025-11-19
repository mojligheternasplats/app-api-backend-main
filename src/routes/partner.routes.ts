import { Router } from "express";
import {
  getAllPartners,
  getPartnerById,
  getPartnerBySlug,
  createPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partner.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

// 🔥 You already have this from your media system
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

// 🔥 Your new logo upload middleware (from config folder)
import { uploadPartnerLogo } from "../config/uploadPartnerLogo";

const router = Router();

// ----------------------
// Public Routes
// ----------------------
router.get("/", getAllPartners);
router.get("/slug/:slug", getPartnerBySlug);
router.get("/:id", getPartnerById);

// ----------------------
// Admin Routes (with file upload)
// ----------------------

// CREATE partner + upload logo
router.post(
  "/",
  authMiddleware,
  upload.single("logo"),      // <input name="logo">
  uploadPartnerLogo,          // Cloudinary upload → writes logoUrl + logoPublicId
  createPartner
);

// UPDATE partner + optional new logo
router.put(
  "/:id",
  authMiddleware,
  upload.single("logo"),      // optional file upload
  uploadPartnerLogo,
  updatePartner
);

// DELETE partner
router.delete("/:id", authMiddleware, deletePartner);

export default router;
