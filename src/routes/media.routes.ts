import { Router } from "express";
import { mediaController } from "../controllers/media.controller";
import multer from "multer";

const upload = multer({ dest: "tmp/" });

const router = Router();

// Public-ish
router.get("/gallery", mediaController.getGallery);
router.get("/all", mediaController.getAll);
router.get("/", mediaController.getMedia); // ?entityType=NEWS|EVENT|...

// 🔥 IMPORTANT — GET ONE MEDIA BY ID
router.get("/:id", mediaController.getOne);

// Uploads
router.post("/file", upload.single("file"), mediaController.uploadFile);
router.post("/url", mediaController.uploadUrl);

// Associations
router.post("/attach", mediaController.attachMedia);
router.post("/detach", mediaController.detachMedia);

// Delete media
router.delete("/:id", mediaController.remove);

export default router;
