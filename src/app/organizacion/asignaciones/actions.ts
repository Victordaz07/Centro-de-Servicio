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

function revalidateAsignaciones() {
  revalidatePath("/organizacion/asignaciones");
}

type HistoryEntry = { completado: boolean; fecha: string };

const TareaSchema = z.object({
  quien: z.string().trim().min(1, "Indica quién la hará."),
  que: z.string().trim().min(1, "Indica qué hay que hacer."),
});

export type TareaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createTarea(
  _prevState: TareaFormState,
  formData: FormData
): Promise<TareaFormState> {
  await requireSession();

  const validated = TareaSchema.safeParse({
    quien: formData.get("quien"),
    que: formData.get("que"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  await prisma.tarea.create({ data: { ...validated.data, history: [] } });
  revalidateAsignaciones();
}

export async function toggleTarea(id: string, completado: boolean) {
  await requireSession();

  const tarea = await prisma.tarea.findUniqueOrThrow({ where: { id } });
  const historyActual = (tarea.history as HistoryEntry[]) ?? [];

  await prisma.tarea.update({
    where: { id },
    data: {
      completado,
      history: [...historyActual, { completado, fecha: new Date().toISOString() }],
    },
  });
  revalidateAsignaciones();
}

export async function deleteTarea(id: string) {
  await requireSession();
  await prisma.tarea.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateAsignaciones();
}

export async function restoreTarea(id: string) {
  await requireSession();
  await prisma.tarea.update({ where: { id }, data: { deletedAt: null } });
  revalidateAsignaciones();
}
