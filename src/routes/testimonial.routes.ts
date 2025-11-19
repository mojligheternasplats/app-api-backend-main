import { Router } from "express";
import { TestimonialController } from "../controllers/testimonial.controller";

const router = Router();

// Public
router.get("/", TestimonialController.getPublic);

// Admin
router.get("/admin", TestimonialController.getAdmin);
router.post("/", TestimonialController.create);
router.put("/:id", TestimonialController.update);
router.delete("/:id", TestimonialController.delete);
router.patch("/:id/publish", TestimonialController.togglePublish);

export default router;
