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

function revalidateRecomendos() {
  revalidatePath("/servicio/recomendos");
}

const RecomendoSchema = z.object({
  personaId: z.string().trim().min(1, "Busca o crea una persona."),
  fechaVencimiento: z.string().trim().min(1, "La fecha de vencimiento es obligatoria."),
  notas: z.string().trim().optional(),
});

export type RecomendoFormState = { errors?: Record<string, string[]> } | undefined;

export async function createRecomendo(
  _prevState: RecomendoFormState,
  formData: FormData
): Promise<RecomendoFormState> {
  await requireSession();

  const validated = RecomendoSchema.safeParse({
    personaId: formData.get("personaId"),
    fechaVencimiento: formData.get("fechaVencimiento"),
    notas: formData.get("notas"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { personaId, fechaVencimiento, notas } = validated.data;

  await prisma.recomendoTemplo.create({
    data: {
      personaId,
      fechaVencimiento: new Date(fechaVencimiento),
      notas: notas || null,
    },
  });

  revalidateRecomendos();
}

export async function renovarRecomendo(id: string) {
  await requireSession();
  const actual = await prisma.recomendoTemplo.findUniqueOrThrow({ where: { id } });

  const base = actual.fechaVencimiento > new Date() ? actual.fechaVencimiento : new Date();
  const nuevaFecha = new Date(base);
  nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 2);

  await prisma.recomendoTemplo.update({
    where: { id },
    data: { fechaVencimiento: nuevaFecha },
  });
  revalidateRecomendos();
}

export async function deleteRecomendo(id: string) {
  await requireSession();
  await prisma.recomendoTemplo.delete({ where: { id } });
  revalidateRecomendos();
}
