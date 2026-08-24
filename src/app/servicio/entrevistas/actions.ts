"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoEntrevista } from "@/generated/prisma/enums";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

function revalidateEntrevistas() {
  revalidatePath("/servicio/entrevistas");
}

const EntrevistaSchema = z.object({
  personaId: z.string().trim().min(1, "Busca o crea una persona."),
  motivo: z.string().trim().min(1, "El motivo es obligatorio."),
  fecha: z.string().trim().optional(),
});

export type EntrevistaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createEntrevista(
  _prevState: EntrevistaFormState,
  formData: FormData
): Promise<EntrevistaFormState> {
  await requireSession();

  const validated = EntrevistaSchema.safeParse({
    personaId: formData.get("personaId"),
    motivo: formData.get("motivo"),
    fecha: formData.get("fecha"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { personaId, motivo, fecha } = validated.data;

  await prisma.entrevista.create({
    data: {
      personaId,
      motivo,
      fecha: fecha ? new Date(fecha) : null,
      estado: fecha ? EstadoEntrevista.AGENDADA : EstadoEntrevista.PENDIENTE,
    },
  });

  revalidateEntrevistas();
}

export async function updateEstadoEntrevista(id: string, estado: EstadoEntrevista) {
  await requireSession();
  await prisma.entrevista.update({ where: { id }, data: { estado } });
  revalidateEntrevistas();
}

export async function deleteEntrevista(id: string) {
  await requireSession();
  await prisma.entrevista.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateEntrevistas();
}

export async function restoreEntrevista(id: string) {
  await requireSession();
  await prisma.entrevista.update({ where: { id }, data: { deletedAt: null } });
  revalidateEntrevistas();
}
