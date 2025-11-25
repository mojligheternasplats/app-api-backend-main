import { Router } from "express";
import multer from "multer";

import { TestimonialController } from "../controllers/testimonial.controller";
import { uploadTestimonialImage } from "../config/uploadTestimonialImage";
import { upload } from "../config/multer";
import { normalizeTestimonial } from "../middlewares/normalizeTestimonial";

const router = Router();

// Public
router.get("/", TestimonialController.getPublic);

// Admin
router.get("/admin", TestimonialController.getAdmin);

router.post(
  "/",
  upload.single("image"),
  normalizeTestimonial,
  uploadTestimonialImage,
  TestimonialController.create
);

router.put(
  "/:id",
  upload.single("image"),
  normalizeTestimonial,
  uploadTestimonialImage,
  TestimonialController.update
);

router.delete("/:id", TestimonialController.delete);

router.patch("/:id/publish", TestimonialController.togglePublish);

export default router;
