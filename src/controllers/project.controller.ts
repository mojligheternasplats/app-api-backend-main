import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { ProjectCategory } from "@prisma/client";

class ProjectController {
  async getAll(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search ? String(req.query.search) : undefined;
    const category = req.query.category
      ? (String(req.query.category).toUpperCase() as ProjectCategory)
      : undefined;

    try {
      const result = await ProjectService.getAll(page, limit, search, category);
      res.json(result);
    } catch (error: any) {
      console.error("❌ Error fetching projects:", error.message);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const project = await ProjectService.getById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ data: project });
  }

  async getBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const project = await ProjectService.getBySlug(slug);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ data: project });
  }

  async create(req: Request, res: Response) {
    try {
      const project = await ProjectService.createProject(req.body);
      res.status(201).json({ data: project });
    } catch (error: any) {
      console.error("❌ Error creating project:", error.message);
      res.status(500).json({ error: "Failed to create project" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectService.updateProject(id, req.body);
      res.json({ data: project });
    } catch (error: any) {
      console.error("❌ Error updating project:", error.message);
      res.status(500).json({ error: "Failed to update project" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProjectService.deleteProject(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("❌ Error deleting project:", error.message);
      res.status(500).json({ error: "Failed to delete project" });
    }
  }
}

export const projectController = new ProjectController();
