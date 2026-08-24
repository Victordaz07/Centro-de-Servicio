"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PersonaSchema = z.object({
  nombres: z.string().trim().min(1, "El nombre es obligatorio."),
  apellidos: z.string().trim().min(1, "El apellido es obligatorio."),
  telefono: z.string().trim().optional(),
  notas: z.string().trim().optional(),
});

export type PersonaFormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

export async function createPersona(
  _prevState: PersonaFormState,
  formData: FormData
): Promise<PersonaFormState> {
  await requireSession();

  const validated = PersonaSchema.safeParse({
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    telefono: formData.get("telefono"),
    notas: formData.get("notas"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { nombres, apellidos, telefono, notas } = validated.data;

  await prisma.persona.create({
    data: {
      nombres,
      apellidos,
      telefono: telefono || null,
      notas: notas || null,
    },
  });

  revalidatePath("/personas");
  return { message: "Persona creada." };
}

export async function updatePersona(
  id: string,
  _prevState: PersonaFormState,
  formData: FormData
): Promise<PersonaFormState> {
  await requireSession();

  const validated = PersonaSchema.safeParse({
    nombres: formData.get("nombres"),
    apellidos: formData.get("apellidos"),
    telefono: formData.get("telefono"),
    notas: formData.get("notas"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { nombres, apellidos, telefono, notas } = validated.data;

  await prisma.persona.update({
    where: { id },
    data: {
      nombres,
      apellidos,
      telefono: telefono || null,
      notas: notas || null,
    },
  });

  revalidatePath("/personas");
  revalidatePath(`/personas/${id}`);
  return { message: "Persona actualizada." };
}

export async function softDeletePersona(id: string) {
  await requireSession();
  await prisma.persona.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath("/personas");
  revalidatePath(`/personas/${id}`);
}

export async function restorePersona(id: string) {
  await requireSession();
  await prisma.persona.update({
    where: { id },
    data: { deletedAt: null },
  });
  revalidatePath("/personas");
  revalidatePath(`/personas/${id}`);
}

// Alta rápida desde un autocompletado (Agenda, Ministración, etc.) cuando la
// persona buscada no existe todavía.
export async function quickCreatePersona(nombreCompleto: string) {
  await requireSession();

  const partes = nombreCompleto.trim().split(/\s+/);
  const nombres = partes[0] ?? "";
  const apellidos = partes.slice(1).join(" ") || "-";

  if (!nombres) throw new Error("Nombre vacío");

  const persona = await prisma.persona.create({
    data: { nombres, apellidos },
    select: { id: true, nombres: true, apellidos: true },
  });

  revalidatePath("/personas");
  return persona;
}
