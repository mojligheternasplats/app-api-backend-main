import { Router } from "express";
import multer from "multer";

import { TestimonialController } from "../controllers/testimonial.controller";
import { uploadTestimonialImage } from "../config/uploadTestimonialImage";
import { upload } from "../config/multer";

const router = Router();


// ------------------
// PUBLIC ROUTE
// ------------------
router.get("/", TestimonialController.getPublic);

// ------------------
// ADMIN ROUTES
// ------------------
router.get("/admin", TestimonialController.getAdmin);

// CREATE testimonial (with image)
router.post(
  "/",
  upload.single("image"),       // ← file from admin panel
  uploadTestimonialImage,       // ← uploads to Cloudinary
  TestimonialController.create
);

// UPDATE testimonial (with optional image)
router.put(
  "/:id",
  upload.single("image"),
  uploadTestimonialImage,
  TestimonialController.update
);

// DELETE testimonial
router.delete("/:id", TestimonialController.delete);

// TOGGLE publish/unpublish
router.patch("/:id/publish", TestimonialController.togglePublish);

export default router;
