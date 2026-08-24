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

function revalidateMinutas() {
  revalidatePath("/organizacion/minutas");
}

type HistoryEntry = { texto: string; editedAt: string };

const MinutaSchema = z.object({
  fecha: z.string().trim().min(1, "La fecha es obligatoria."),
  texto: z.string().trim().min(1, "El texto no puede estar vacío."),
});

export type MinutaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createMinuta(
  _prevState: MinutaFormState,
  formData: FormData
): Promise<MinutaFormState> {
  await requireSession();

  const validated = MinutaSchema.safeParse({
    fecha: formData.get("fecha"),
    texto: formData.get("texto"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  await prisma.minuta.create({
    data: { fecha: new Date(validated.data.fecha), texto: validated.data.texto, history: [] },
  });
  revalidateMinutas();
}

const UpdateTextoSchema = z.object({ texto: z.string().trim().min(1, "El texto no puede estar vacío.") });

export async function updateMinuta(
  id: string,
  _prevState: MinutaFormState,
  formData: FormData
): Promise<MinutaFormState> {
  await requireSession();

  const validated = UpdateTextoSchema.safeParse({ texto: formData.get("texto") });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const minuta = await prisma.minuta.findUniqueOrThrow({ where: { id } });
  const historyActual = (minuta.history as HistoryEntry[]) ?? [];
  const nuevaEntrada: HistoryEntry = {
    texto: minuta.texto,
    editedAt: (minuta.editedAt ?? minuta.fecha).toISOString(),
  };

  await prisma.minuta.update({
    where: { id },
    data: {
      texto: validated.data.texto,
      editedAt: new Date(),
      history: [...historyActual, nuevaEntrada],
    },
  });
  revalidateMinutas();
}

export async function deleteMinuta(id: string) {
  await requireSession();
  await prisma.minuta.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateMinutas();
}

export async function restoreMinuta(id: string) {
  await requireSession();
  await prisma.minuta.update({ where: { id }, data: { deletedAt: null } });
  revalidateMinutas();
}
