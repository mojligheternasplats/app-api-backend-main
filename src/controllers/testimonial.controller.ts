import { Request, Response } from "express";
import { TestimonialService } from "../services/testimonial.service";

export class TestimonialController {
  
  // PUBLIC (website)
  static async getPublic(req: Request, res: Response) {
    const data = await TestimonialService.getPublicTestimonials();
    res.json(data);
  }

  // ADMIN (full list)
  static async getAdmin(req: Request, res: Response) {
    const data = await TestimonialService.getAdminTestimonials();
    res.json(data);
  }

  // CREATE testimonial + image
  static async create(req: Request, res: Response) {
    const payload = {
      name: req.body.name,
      age: Number(req.body.age),
      message: req.body.message,
      program: req.body.program,
      imageUrl: req.body.imageUrl ?? null,
      imagePublicId: req.body.imagePublicId ?? null,
      isPublished: req.body.isPublished ?? true,
    };

    const newItem = await TestimonialService.createTestimonial(payload);
    res.status(201).json(newItem);
  }

  // UPDATE testimonial + image (optional)
  static async update(req: Request, res: Response) {
    const payload = {
      name: req.body.name,
      age: Number(req.body.age),
      message: req.body.message,
      program: req.body.program,
      imageUrl: req.body.imageUrl ?? undefined,
      imagePublicId: req.body.imagePublicId ?? undefined,
      isPublished: req.body.isPublished,
    };

    const updated = await TestimonialService.updateTestimonial(req.params.id, payload);
    res.json(updated);
  }

  // DELETE testimonial + Cloudinary image
  static async delete(req: Request, res: Response) {
    await TestimonialService.deleteTestimonial(req.params.id);
    res.json({ message: "Deleted successfully" });
  }

  // Toggle publish/unpublish
  static async togglePublish(req: Request, res: Response) {
    const updated = await TestimonialService.togglePublish(
      req.params.id,
      req.body.isPublished
    );
    res.json(updated);
  }
}
