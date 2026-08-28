import { prisma } from "@/lib/prisma";

export async function searchFamilias(query: string, limit = 8) {
  const q = query.trim();
  if (!q) return [];

  return prisma.familia.findMany({
    where: { nombre: { contains: q, mode: "insensitive" } },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
    take: limit,
  });
}
