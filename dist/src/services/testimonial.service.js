"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialService = void 0;
const testimonial_repository_1 = require("../repositories/testimonial.repository");
class TestimonialService {
    static async getPublicTestimonials() {
        return testimonial_repository_1.TestimonialRepository.findAll();
    }
    static async getAdminTestimonials() {
        return testimonial_repository_1.TestimonialRepository.findAllAdmin();
    }
    static async createTestimonial(data) {
        return testimonial_repository_1.TestimonialRepository.create(data);
    }
    static async updateTestimonial(id, data) {
        return testimonial_repository_1.TestimonialRepository.update(id, data);
    }
    static async deleteTestimonial(id) {
        return testimonial_repository_1.TestimonialRepository.delete(id);
    }
    static async togglePublish(id, publish) {
        return testimonial_repository_1.TestimonialRepository.publish(id, publish);
    }
}
exports.TestimonialService = TestimonialService;
