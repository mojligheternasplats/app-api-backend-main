import { prisma } from "../lib/prisma";

export class EventRegistrationRepository {
  static async exists(eventId: string, email: string) {
    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId, email },
    });
    return !!existing;
  }

  static async create(eventId: string, name: string, email: string) {
    return prisma.eventRegistration.create({
      data: { eventId, name, email },
    });
  }
  static async findAll() {
    return prisma.eventRegistration.findMany({
      include: {
        event: { select: { id: true, title: true } },
      },
    });
  }

  static async findByEvent(eventId: string) {
    return prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" }, // newest first
    });
  }
  static async update(id: string, data: any) {
    return prisma.eventRegistration.update({ where: { id }, data });
  }
  static async delete(id: string) {
    return prisma.eventRegistration.delete({
      where: { id },
    });
  }
}
