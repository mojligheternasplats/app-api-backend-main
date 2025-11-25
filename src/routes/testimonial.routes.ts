import { Router } from "express";
import multer from "multer";

import { TestimonialController } from "../controllers/testimonial.controller";
import { uploadTestimonialImage } from "../config/uploadTestimonialImage";
import { upload } from "../config/multer";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// ----------------------
// PUBLIC
// ----------------------
router.get("/", TestimonialController.getPublic);

// ----------------------
// ADMIN — PROTECTED
// ----------------------
router.get("/admin", authMiddleware, TestimonialController.getAdmin);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  uploadTestimonialImage,
  TestimonialController.create
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  uploadTestimonialImage,
  TestimonialController.update
);

router.delete("/:id", authMiddleware, TestimonialController.delete);

router.patch("/:id/publish", authMiddleware, TestimonialController.togglePublish);

export default router;
