"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const heroSection_controller_1 = require("../controllers/heroSection.controller");
const router = (0, express_1.Router)();
/**
 * BASE PATH for this router should be /api/hero-sections
 *
 * Example usage in main server:
 * app.use("/api/hero-sections", heroSectionRoutes);
 */
// Get all hero sections (admin)
router.get("/", heroSection_controller_1.HeroSectionController.getAll);
// Get hero section by ID (admin)
router.get("/:id", heroSection_controller_1.HeroSectionController.getById);
// Get published hero for a specific page (frontend)
router.get("/page/:page", heroSection_controller_1.HeroSectionController.getByPage);
// Create hero section
router.post("/", heroSection_controller_1.HeroSectionController.createHeroSection);
// Update hero section
router.put("/:id", heroSection_controller_1.HeroSectionController.updateHeroSection);
// Delete hero section
router.delete("/:id", heroSection_controller_1.HeroSectionController.deleteHeroSection);
exports.default = router;
