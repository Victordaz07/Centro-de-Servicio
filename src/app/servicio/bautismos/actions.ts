"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HITOS_SEED } from "./hitos-seed";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

function revalidateBautismos(personaId?: string) {
  revalidatePath("/servicio/bautismos");
  if (personaId) revalidatePath(`/personas/${personaId}`);
}

const BautismoSchema = z.object({
  personaId: z.string().trim().min(1, "Busca o crea una persona."),
  fecha: z.string().trim().min(1, "La fecha es obligatoria."),
});

export type BautismoFormState = { errors?: Record<string, string[]> } | undefined;

export async function createBautismo(
  _prevState: BautismoFormState,
  formData: FormData
): Promise<BautismoFormState> {
  await requireSession();

  const validated = BautismoSchema.safeParse({
    personaId: formData.get("personaId"),
    fecha: formData.get("fecha"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { personaId, fecha } = validated.data;
  const fechaBautismo = new Date(fecha);

  const yaExiste = await prisma.bautismo.findUnique({ where: { personaId } });
  if (yaExiste) {
    return { errors: { personaId: ["Esta persona ya tiene un bautismo registrado."] } };
  }

  await prisma.$transaction(async (tx) => {
    const bautismo = await tx.bautismo.create({
      data: { personaId, fecha: fechaBautismo, idioma: "es", himnos: [], programa: {} },
    });

    const plan = await tx.planIntegracion.create({
      data: { personaId, bautismoId: bautismo.id, fechaBautismo },
    });

    await tx.hitoIntegracion.createMany({
      data: HITOS_SEED.map((h) => ({ ...h, planId: plan.id })),
    });
  });

  revalidateBautismos(personaId);
}

export async function toggleHito(hitoId: string, completado: boolean) {
  const session = await requireSession();

  const hito = await prisma.hitoIntegracion.update({
    where: { id: hitoId },
    data: {
      completado,
      completadoFecha: completado ? new Date() : null,
      completadoPor: completado ? (session.user?.email ?? null) : null,
    },
    include: { plan: { select: { personaId: true } } },
  });

  revalidateBautismos(hito.plan.personaId);
}

export async function deleteBautismo(id: string, personaId: string) {
  await requireSession();

  await prisma.$transaction(async (tx) => {
    const plan = await tx.planIntegracion.findUnique({ where: { bautismoId: id } });
    if (plan) {
      await tx.hitoIntegracion.deleteMany({ where: { planId: plan.id } });
      await tx.planIntegracion.delete({ where: { id: plan.id } });
    }
    await tx.bautismo.delete({ where: { id } });
  });

  revalidateBautismos(personaId);
}
