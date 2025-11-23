"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const project_repository_1 = require("../repositories/project.repository");
const client_1 = require("@prisma/client");
class ProjectService {
    static async getAll(page = 1, limit = 10, search, category) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            project_repository_1.ProjectRepository.findAll({ skip, take: limit, search, category }),
            project_repository_1.ProjectRepository.count({ search, category }),
        ]);
        return {
            data: items,
            meta: { page, limit, total },
        };
    }
    static async getById(id) {
        return project_repository_1.ProjectRepository.findById(id);
    }
    static async getBySlug(slug) {
        return project_repository_1.ProjectRepository.findBySlug(slug);
    }
    static async createProject(data) {
        // Default category if none provided
        if (!data.category)
            data.category = "LOCAL";
        return project_repository_1.ProjectRepository.create(data);
    }
    static async getLatestEUProjects(limit = 4) {
        return project_repository_1.ProjectRepository.findAll({
            skip: 0,
            take: limit,
            category: client_1.ProjectCategory.EU,
        });
    }
    static async updateProject(id, data) {
        return project_repository_1.ProjectRepository.update(id, data);
    }
    static async deleteProject(id) {
        return project_repository_1.ProjectRepository.delete(id);
    }
}
exports.ProjectService = ProjectService;
