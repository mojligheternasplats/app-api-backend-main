"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = require("../lib/prisma");
const partner_repository_1 = require("../repositories/partner.repository");
class PartnerService {
    // ---------------------------
    // GET ALL
    // ---------------------------
    static async getAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            partner_repository_1.PartnerRepository.findAll({ skip, take: limit, search }),
            partner_repository_1.PartnerRepository.count({ search }),
        ]);
        return {
            data: items,
            meta: { page, limit, total },
        };
    }
    // ---------------------------
    // GET BY ID
    // ---------------------------
    static async getById(id) {
        return partner_repository_1.PartnerRepository.findById(id);
    }
    // ---------------------------
    // GET BY SLUG
    // ---------------------------
    static async getBySlug(slug) {
        return partner_repository_1.PartnerRepository.findBySlug(slug);
    }
    // ---------------------------
    // NORMALIZE DATA
    // (Convert strings from FormData → correct types)
    // ---------------------------
    static normalize(data) {
        const normalized = { ...data };
        // Boolean fields
        if (normalized.isPublished !== undefined) {
            normalized.isPublished =
                normalized.isPublished === "true" || normalized.isPublished === true;
        }
        // Number fields
        if (normalized.order !== undefined) {
            normalized.order = Number(normalized.order);
        }
        // Enum field (PartnerType)
        if (normalized.type) {
            normalized.type = normalized.type.toUpperCase();
        }
        return normalized;
    }
    // ---------------------------
    // CREATE PARTNER
    // ---------------------------
    static async createPartner(data) {
        // Convert incoming FormData string values
        data = PartnerService.normalize(data);
        // Slug generation
        const baseSlug = data.slug?.trim() || (0, slugify_1.default)(data.name, { lower: true, strict: true });
        let slug = baseSlug;
        let i = 1;
        while (await prisma_1.prisma.partner.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${i++}`;
        }
        return partner_repository_1.PartnerRepository.create({
            ...data,
            slug,
        });
    }
    // ---------------------------
    // UPDATE PARTNER
    // ---------------------------
    static async updatePartner(id, data) {
        // Convert incoming FormData string values
        data = PartnerService.normalize(data);
        // Slug update logic
        if (data.slug) {
            const baseSlug = (0, slugify_1.default)(data.slug, { lower: true, strict: true });
            let slug = baseSlug;
            let i = 1;
            while (await prisma_1.prisma.partner.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${i++}`;
            }
            data.slug = slug;
        }
        return partner_repository_1.PartnerRepository.update(id, data);
    }
    // ---------------------------
    // DELETE PARTNER
    // ---------------------------
    static async deletePartner(id) {
        // No media associations anymore
        return partner_repository_1.PartnerRepository.delete(id);
    }
}
exports.PartnerService = PartnerService;
