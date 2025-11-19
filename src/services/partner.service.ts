import slugify from "slugify";
import { prisma } from "../lib/prisma";
import { PartnerRepository } from "../repositories/partner.repository";

export class PartnerService {
  // ---------------------------
  // GET ALL
  // ---------------------------
  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      PartnerRepository.findAll({ skip, take: limit, search }),
      PartnerRepository.count({ search }),
    ]);

    return {
      data: items,
      meta: { page, limit, total },
    };
  }

  // ---------------------------
  // GET BY ID
  // ---------------------------
  static async getById(id: string) {
    return PartnerRepository.findById(id);
  }

  // ---------------------------
  // GET BY SLUG
  // ---------------------------
  static async getBySlug(slug: string) {
    return PartnerRepository.findBySlug(slug);
  }

  // ---------------------------
  // NORMALIZE DATA
  // (Convert strings from FormData → correct types)
  // ---------------------------
  private static normalize(data: any) {
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
  static async createPartner(data: any) {
    // Convert incoming FormData string values
    data = PartnerService.normalize(data);

    // Slug generation
    const baseSlug =
      data.slug?.trim() || slugify(data.name, { lower: true, strict: true });

    let slug = baseSlug;
    let i = 1;
    while (await prisma.partner.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    return PartnerRepository.create({
      ...data,
      slug,
    });
  }

  // ---------------------------
  // UPDATE PARTNER
  // ---------------------------
  static async updatePartner(id: string, data: any) {
    // Convert incoming FormData string values
    data = PartnerService.normalize(data);

    // Slug update logic
    if (data.slug) {
      const baseSlug = slugify(data.slug, { lower: true, strict: true });
      let slug = baseSlug;
      let i = 1;
      while (await prisma.partner.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${i++}`;
      }
      data.slug = slug;
    }

    return PartnerRepository.update(id, data);
  }

  // ---------------------------
  // DELETE PARTNER
  // ---------------------------
  static async deletePartner(id: string) {
    // No media associations anymore
    return PartnerRepository.delete(id);
  }
}
