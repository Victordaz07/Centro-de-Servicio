import { prisma } from "@/lib/prisma";

export async function searchPersonas(query: string, limit = 8) {
  const q = query.trim();
  if (!q) return [];

  return prisma.persona.findMany({
    where: {
      deletedAt: null,
      OR: [
        { nombres: { contains: q, mode: "insensitive" } },
        { apellidos: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, nombres: true, apellidos: true, telefono: true },
    orderBy: [{ apellidos: "asc" }, { nombres: "asc" }],
    take: limit,
  });
}
