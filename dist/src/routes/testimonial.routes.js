"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const router = (0, express_1.Router)();
// Public
router.get("/", testimonial_controller_1.TestimonialController.getPublic);
// Admin
router.get("/admin", testimonial_controller_1.TestimonialController.getAdmin);
router.post("/", testimonial_controller_1.TestimonialController.create);
router.put("/:id", testimonial_controller_1.TestimonialController.update);
router.delete("/:id", testimonial_controller_1.TestimonialController.delete);
router.patch("/:id/publish", testimonial_controller_1.TestimonialController.togglePublish);
exports.default = router;
