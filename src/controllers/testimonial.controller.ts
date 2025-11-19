import { Request, Response } from "express";
import { TestimonialService } from "../services/testimonial.service";

export class TestimonialController {
  static async getPublic(req: Request, res: Response) {
    const data = await TestimonialService.getPublicTestimonials();
    res.json(data);
  }

  static async getAdmin(req: Request, res: Response) {
    const data = await TestimonialService.getAdminTestimonials();
    res.json(data);
  }

  static async create(req: Request, res: Response) {
    const newItem = await TestimonialService.createTestimonial(req.body);
    res.status(201).json(newItem);
  }

  static async update(req: Request, res: Response) {
    const updated = await TestimonialService.updateTestimonial(req.params.id, req.body);
    res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    await TestimonialService.deleteTestimonial(req.params.id);
    res.json({ message: "Deleted" });
  }

  static async togglePublish(req: Request, res: Response) {
    const updated = await TestimonialService.togglePublish(req.params.id, req.body.isPublished);
    res.json(updated);
  }
}
