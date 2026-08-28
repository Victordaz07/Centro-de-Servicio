"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AgendaItemSchema = z.object({
  texto: z.string().trim().min(1, "El punto no puede estar vacío."),
  responsablePersonaId: z.string().trim().optional(),
});

export type AgendaItemFormState = { errors?: Record<string, string[]> } | undefined;

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

export async function createAgendaItem(
  _prevState: AgendaItemFormState,
  formData: FormData
): Promise<AgendaItemFormState> {
  await requireSession();

  const validated = AgendaItemSchema.safeParse({
    texto: formData.get("texto"),
    responsablePersonaId: formData.get("responsablePersonaId"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { texto, responsablePersonaId } = validated.data;

  await prisma.agendaItem.create({
    data: { texto, responsablePersonaId: responsablePersonaId || null },
  });

  revalidatePath("/organizacion/agenda");
}

export async function toggleAgendaItem(id: string, completado: boolean) {
  await requireSession();
  await prisma.agendaItem.update({ where: { id }, data: { completado } });
  revalidatePath("/organizacion/agenda");
}

export async function deleteAgendaItem(id: string) {
  await requireSession();
  await prisma.agendaItem.delete({ where: { id } });
  revalidatePath("/organizacion/agenda");
}
