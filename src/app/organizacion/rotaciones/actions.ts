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

function revalidateRotaciones() {
  revalidatePath("/organizacion/rotaciones");
}

type TurnHistoryEntry = { personaId: string; fecha: string };

const RotacionSchema = z.object({ tarea: z.string().trim().min(1, "La tarea es obligatoria.") });

export type RotacionFormState = { errors?: Record<string, string[]> } | undefined;

export async function createRotacion(
  _prevState: RotacionFormState,
  formData: FormData
): Promise<RotacionFormState> {
  await requireSession();

  const validated = RotacionSchema.safeParse({ tarea: formData.get("tarea") });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  await prisma.rotacion.create({
    data: { tarea: validated.data.tarea, personas: [], turnoActual: 0, turnHistory: [] },
  });
  revalidateRotaciones();
}

export async function deleteRotacion(id: string) {
  await requireSession();
  await prisma.rotacion.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateRotaciones();
}

export async function restoreRotacion(id: string) {
  await requireSession();
  await prisma.rotacion.update({ where: { id }, data: { deletedAt: null } });
  revalidateRotaciones();
}

export async function addPersonaRotacion(rotacionId: string, personaId: string) {
  await requireSession();
  if (!personaId.trim()) return;

  const rotacion = await prisma.rotacion.findUniqueOrThrow({
    where: { id: rotacionId },
    select: { personas: true },
  });
  const actuales = (rotacion.personas as string[]) ?? [];
  if (actuales.includes(personaId)) return;

  await prisma.rotacion.update({
    where: { id: rotacionId },
    data: { personas: [...actuales, personaId] },
  });
  revalidateRotaciones();
}

export async function removePersonaRotacion(rotacionId: string, personaId: string) {
  await requireSession();
  const rotacion = await prisma.rotacion.findUniqueOrThrow({
    where: { id: rotacionId },
    select: { personas: true, turnoActual: true },
  });
  const actuales = (rotacion.personas as string[]) ?? [];
  const nuevos = actuales.filter((id) => id !== personaId);
  const nuevoTurno = nuevos.length === 0 ? 0 : Math.min(rotacion.turnoActual, nuevos.length - 1);

  await prisma.rotacion.update({
    where: { id: rotacionId },
    data: { personas: nuevos, turnoActual: nuevoTurno },
  });
  revalidateRotaciones();
}

export async function rotarTurno(rotacionId: string) {
  await requireSession();
  const rotacion = await prisma.rotacion.findUniqueOrThrow({ where: { id: rotacionId } });
  const personas = (rotacion.personas as string[]) ?? [];
  if (personas.length === 0) return;

  const nuevoTurno = (rotacion.turnoActual + 1) % personas.length;
  const historyActual = (rotacion.turnHistory as TurnHistoryEntry[]) ?? [];

  await prisma.rotacion.update({
    where: { id: rotacionId },
    data: {
      turnoActual: nuevoTurno,
      turnHistory: [...historyActual, { personaId: personas[nuevoTurno], fecha: new Date().toISOString() }],
    },
  });
  revalidateRotaciones();
}
