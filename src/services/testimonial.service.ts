import { TestimonialRepository } from "../repositories/testimonial.repository";

export class TestimonialService {
  static async getPublicTestimonials() {
    return TestimonialRepository.findAll();
  }

  static async getAdminTestimonials() {
    return TestimonialRepository.findAllAdmin();
  }

  static async createTestimonial(data: any) {
    return TestimonialRepository.create(data);
  }

  static async updateTestimonial(id: string, data: any) {
    return TestimonialRepository.update(id, data);
  }

  static async deleteTestimonial(id: string) {
    return TestimonialRepository.delete(id);
  }

  static async togglePublish(id: string, publish: boolean) {
    return TestimonialRepository.publish(id, publish);
  }
}
