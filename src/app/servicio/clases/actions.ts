"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

function revalidateClases() {
  revalidatePath("/servicio/clases");
}

const ClaseSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  maestroPersonaId: z.string().trim().optional(),
});

export type ClaseFormState = { errors?: Record<string, string[]> } | undefined;

export async function createClase(
  _prevState: ClaseFormState,
  formData: FormData
): Promise<ClaseFormState> {
  await requireSession();

  const validated = ClaseSchema.safeParse({
    nombre: formData.get("nombre"),
    maestroPersonaId: formData.get("maestroPersonaId"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { nombre, maestroPersonaId } = validated.data;

  await prisma.claseEscDominical.create({
    data: { nombre, maestroPersonaId: maestroPersonaId || null, suplentes: [], turnoActualSuplente: 0 },
  });
  revalidateClases();
}

export async function deleteClase(id: string) {
  await requireSession();
  await prisma.claseEscDominical.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateClases();
}

export async function restoreClase(id: string) {
  await requireSession();
  await prisma.claseEscDominical.update({ where: { id }, data: { deletedAt: null } });
  revalidateClases();
}

export async function addSuplente(claseId: string, personaId: string) {
  await requireSession();
  if (!personaId.trim()) return;

  const clase = await prisma.claseEscDominical.findUniqueOrThrow({
    where: { id: claseId },
    select: { suplentes: true },
  });
  const actuales = (clase.suplentes as string[]) ?? [];
  if (actuales.includes(personaId)) return;

  await prisma.claseEscDominical.update({
    where: { id: claseId },
    data: { suplentes: [...actuales, personaId] },
  });
  revalidateClases();
}

export async function removeSuplente(claseId: string, personaId: string) {
  await requireSession();
  const clase = await prisma.claseEscDominical.findUniqueOrThrow({
    where: { id: claseId },
    select: { suplentes: true, turnoActualSuplente: true },
  });
  const actuales = (clase.suplentes as string[]) ?? [];
  const index = actuales.indexOf(personaId);
  if (index === -1) return;

  const activoId = actuales[clase.turnoActualSuplente];
  const nuevos = actuales.filter((id) => id !== personaId);

  let nuevoTurno = 0;
  if (nuevos.length > 0) {
    const nuevoIndex = activoId ? nuevos.indexOf(activoId) : -1;
    nuevoTurno =
      nuevoIndex !== -1 ? nuevoIndex : Math.min(clase.turnoActualSuplente, nuevos.length - 1);
  }

  await prisma.claseEscDominical.update({
    where: { id: claseId },
    data: { suplentes: nuevos, turnoActualSuplente: nuevoTurno },
  });
  revalidateClases();
}

export async function rotarSuplente(claseId: string) {
  await requireSession();
  const clase = await prisma.claseEscDominical.findUniqueOrThrow({
    where: { id: claseId },
    select: { suplentes: true, turnoActualSuplente: true },
  });
  const total = (clase.suplentes as string[])?.length ?? 0;
  if (total === 0) return;

  await prisma.claseEscDominical.update({
    where: { id: claseId },
    data: { turnoActualSuplente: (clase.turnoActualSuplente + 1) % total },
  });
  revalidateClases();
}
