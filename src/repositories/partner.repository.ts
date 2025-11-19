import { prisma } from "../lib/prisma";
import { PartnerType } from "@prisma/client";

export class PartnerRepository {
  // ---------------------------
  // FIND ALL
  // ---------------------------
  static async findAll(params?: { skip?: number; take?: number; search?: string }) {
    return prisma.partner.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { order: "asc" },
    });
  }

  // ---------------------------
  // COUNT
  // ---------------------------
  static async count(params?: { search?: string }) {
    return prisma.partner.count({
      where: params?.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : undefined,
    });
  }

  // ---------------------------
  // FIND BY ID
  // ---------------------------
  static async findById(id: string) {
    return prisma.partner.findUnique({
      where: { id },
    });
  }

  // ---------------------------
  // FIND BY SLUG
  // ---------------------------
  static async findBySlug(slug: string) {
    return prisma.partner.findUnique({
      where: { slug },
    });
  }

  // ---------------------------
  // CREATE
  // ---------------------------
 static async create(data: {
  name: string;
  slug?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  logoPublicId?: string;
  language?: string;
  type: PartnerType;     // ❗ FIXED
  isPublished?: boolean;
  order?: number;
  createdById?: string;
}) {
  return prisma.partner.create({ data });
}


  // ---------------------------
  // UPDATE
  // ---------------------------
 static async update(id: string, data: Partial<{
  name: string;
  slug?: string | null;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  language?: string;
  type?: PartnerType;     // ❗ FIXED
  isPublished?: boolean;
  order?: number;
  createdById?: string | null;
}>) {
  return prisma.partner.update({
    where: { id },
    data,
  });
}

  // ---------------------------
  // DELETE
  // ---------------------------
  static async delete(id: string) {
    return prisma.partner.delete({
      where: { id },
    });
  }
}
