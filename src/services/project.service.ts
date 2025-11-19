import { ProjectRepository } from "../repositories/project.repository";
import { ProjectCategory } from "@prisma/client";

export class ProjectService {
  static async getAll(
    page = 1,
    limit = 10,
    search?: string,
    category?: ProjectCategory
  ) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ProjectRepository.findAll({ skip, take: limit, search, category }),
      ProjectRepository.count({ search, category }),
    ]);

    return {
      data: items,
      meta: { page, limit, total },
    };
  }

  static async getById(id: string) {
    return ProjectRepository.findById(id);
  }

  static async getBySlug(slug: string) {
    return ProjectRepository.findBySlug(slug);
  }

  static async createProject(data: any) {
    // Default category if none provided
    if (!data.category) data.category = "LOCAL";

    return ProjectRepository.create(data);
  }
static async getLatestEUProjects(limit = 4) {
  return ProjectRepository.findAll({
    skip: 0,
    take: limit,
    category: ProjectCategory.EU,
  });
}
  static async updateProject(id: string, data: any) {
    return ProjectRepository.update(id, data);
  }

  static async deleteProject(id: string) {
    return ProjectRepository.delete(id);
  }
}

