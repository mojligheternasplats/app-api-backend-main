import { Request, Response, NextFunction } from "express";

export function normalizeTestimonial(req: Request, res: Response, next: NextFunction) {
  // Convert age → number
  if (typeof req.body.age === "string") {
    req.body.age = parseInt(req.body.age, 10);
  }

  // Convert isPublished → boolean
  if (req.body.isPublished === "true") req.body.isPublished = true;
  if (req.body.isPublished === "false") req.body.isPublished = false;

  next();
}
