import { Router } from "express";
import { HeroSectionController } from "../controllers/heroSection.controller";

const router = Router();

/**
 * BASE PATH for this router should be /api/hero-sections
 *
 * Example usage in main server:
 * app.use("/api/hero-sections", heroSectionRoutes);
 */

// Get all hero sections (admin)
router.get("/", HeroSectionController.getAll);

// Get hero section by ID (admin)
router.get("/:id", HeroSectionController.getById);

// Get published hero for a specific page (frontend)
router.get("/page/:page", HeroSectionController.getByPage);

// Create hero section
router.post("/", HeroSectionController.createHeroSection);

// Update hero section
router.put("/:id", HeroSectionController.updateHeroSection);

// Delete hero section
router.delete("/:id", HeroSectionController.deleteHeroSection);

export default router;
