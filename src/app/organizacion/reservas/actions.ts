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

const ReservaSchema = z.object({
  fecha: z.string().trim().min(1, "La fecha es obligatoria."),
  horaInicio: z.string().trim().min(1, "La hora de inicio es obligatoria."),
  horaFin: z.string().trim().min(1, "La hora de fin es obligatoria."),
  area: z.string().trim().min(1, "El área es obligatoria."),
  solicitante: z.string().trim().min(1, "El solicitante es obligatorio."),
  proposito: z.string().trim().optional(),
});

export type ReservaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createReserva(
  _prevState: ReservaFormState,
  formData: FormData
): Promise<ReservaFormState> {
  await requireSession();

  const validated = ReservaSchema.safeParse({
    fecha: formData.get("fecha"),
    horaInicio: formData.get("horaInicio"),
    horaFin: formData.get("horaFin"),
    area: formData.get("area"),
    solicitante: formData.get("solicitante"),
    proposito: formData.get("proposito"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  if (validated.data.horaFin <= validated.data.horaInicio) {
    return { errors: { horaFin: ["La hora de fin debe ser después de la hora de inicio."] } };
  }

  const { fecha, horaInicio, horaFin, area, solicitante, proposito } = validated.data;

  await prisma.reservaEdificio.create({
    data: {
      fecha: new Date(fecha),
      horaInicio,
      horaFin,
      area,
      solicitante,
      proposito: proposito || null,
    },
  });

  revalidatePath("/organizacion/reservas");
}

export async function deleteReserva(id: string) {
  await requireSession();
  await prisma.reservaEdificio.delete({ where: { id } });
  revalidatePath("/organizacion/reservas");
}
