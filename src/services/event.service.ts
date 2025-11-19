import { prisma } from "../lib/prisma";
import { EventRepository } from "../repositories/event.repository";

export class EventService {
  static toCleanResponse(e: any) {
    return {
      id: e.id,
      slug: e.slug,
      title: e.title,
      description: e.description,
      content: e.content,
      language: e.language,
      isPublished: e.isPublished,
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      createdAt: e.createdAt,
      creator: e.creator
        ? {
            id: e.creator.id,
            name: `${e.creator.firstName ?? ""} ${e.creator.lastName ?? ""}`.trim(),
          }
        : null,
   media: e.media?.map((m: any) => ({
      id: m.id,
      url: m.url,
      altText: m.altText,
    })) ?? [],
    };
  }

  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      EventRepository.findAll({ skip, take: limit, search }),
      EventRepository.count(search),
    ]);

    return {
      data: items.map(EventService.toCleanResponse),
      meta: { page, limit, total },
    };
  }

  static async getById(id: string) {
    const e = await EventRepository.findById(id);
    return e ? EventService.toCleanResponse(e) : null;
  }

  static async getBySlug(slug: string) {
    const e = await EventRepository.findBySlug(slug);
    return e ? EventService.toCleanResponse(e) : null;
  }

  static async createEvent(data: any) {
    return EventRepository.create(data);
  }

  static async updateEvent(id: string, data: any) {
    return EventRepository.update(id, data);
  }

  static async deleteEvent(id: string) {
    // Remove media associations first
    await prisma.mediaAssociation.deleteMany({
      where: { entityId: id, entityType: "EVENT" },
    });

    return EventRepository.delete(id);
  }
}
