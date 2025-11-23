"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialController = void 0;
const testimonial_service_1 = require("../services/testimonial.service");
class TestimonialController {
    static async getPublic(req, res) {
        const data = await testimonial_service_1.TestimonialService.getPublicTestimonials();
        res.json(data);
    }
    static async getAdmin(req, res) {
        const data = await testimonial_service_1.TestimonialService.getAdminTestimonials();
        res.json(data);
    }
    static async create(req, res) {
        const newItem = await testimonial_service_1.TestimonialService.createTestimonial(req.body);
        res.status(201).json(newItem);
    }
    static async update(req, res) {
        const updated = await testimonial_service_1.TestimonialService.updateTestimonial(req.params.id, req.body);
        res.json(updated);
    }
    static async delete(req, res) {
        await testimonial_service_1.TestimonialService.deleteTestimonial(req.params.id);
        res.json({ message: "Deleted" });
    }
    static async togglePublish(req, res) {
        const updated = await testimonial_service_1.TestimonialService.togglePublish(req.params.id, req.body.isPublished);
        res.json(updated);
    }
}
exports.TestimonialController = TestimonialController;
