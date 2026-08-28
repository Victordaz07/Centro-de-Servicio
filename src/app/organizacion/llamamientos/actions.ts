"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoLlamamiento } from "@/generated/prisma/enums";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

function revalidateLlamamientos() {
  revalidatePath("/organizacion/llamamientos");
}

type HistoryEntry = { estado: EstadoLlamamiento; fecha: string };

const LlamamientoSchema = z.object({
  personaId: z.string().trim().min(1, "Busca o crea una persona."),
  llamamientoPropuesto: z.string().trim().min(1, "Indica el llamamiento propuesto."),
});

export type LlamamientoFormState = { errors?: Record<string, string[]> } | undefined;

export async function createLlamamiento(
  _prevState: LlamamientoFormState,
  formData: FormData
): Promise<LlamamientoFormState> {
  await requireSession();

  const validated = LlamamientoSchema.safeParse({
    personaId: formData.get("personaId"),
    llamamientoPropuesto: formData.get("llamamientoPropuesto"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const historyInicial: HistoryEntry[] = [
    { estado: EstadoLlamamiento.ORANDO, fecha: new Date().toISOString() },
  ];

  await prisma.llamamientoConsideracion.create({
    data: { ...validated.data, estado: EstadoLlamamiento.ORANDO, history: historyInicial },
  });
  revalidateLlamamientos();
}

export async function updateEstadoLlamamiento(id: string, estado: EstadoLlamamiento) {
  await requireSession();

  const llamamiento = await prisma.llamamientoConsideracion.findUniqueOrThrow({ where: { id } });
  const historyActual = (llamamiento.history as HistoryEntry[]) ?? [];

  await prisma.llamamientoConsideracion.update({
    where: { id },
    data: {
      estado,
      history: [...historyActual, { estado, fecha: new Date().toISOString() }],
    },
  });
  revalidateLlamamientos();
}

export async function deleteLlamamiento(id: string) {
  await requireSession();
  await prisma.llamamientoConsideracion.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateLlamamientos();
}

export async function restoreLlamamiento(id: string) {
  await requireSession();
  await prisma.llamamientoConsideracion.update({ where: { id }, data: { deletedAt: null } });
  revalidateLlamamientos();
}
