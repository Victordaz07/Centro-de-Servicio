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

function revalidateMinistracion() {
  revalidatePath("/servicio/ministracion");
}

// ---------- Compañerismos ----------

const CompanerismoSchema = z.object({
  nombres: z.string().trim().min(1, "El nombre es obligatorio."),
});

export type CompanerismoFormState = { errors?: Record<string, string[]> } | undefined;

export async function createCompanerismo(
  _prevState: CompanerismoFormState,
  formData: FormData
): Promise<CompanerismoFormState> {
  await requireSession();

  const validated = CompanerismoSchema.safeParse({ nombres: formData.get("nombres") });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  await prisma.companerismo.create({ data: { nombres: validated.data.nombres } });
  revalidateMinistracion();
}

export async function deleteCompanerismo(id: string) {
  await requireSession();
  await prisma.companerismo.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidateMinistracion();
}

// ---------- Familias (alta rápida desde el autocompletado) ----------

export async function quickCreateFamilia(nombre: string) {
  await requireSession();
  const trimmed = nombre.trim();
  if (!trimmed) throw new Error("Nombre de familia vacío");

  const familia = await prisma.familia.create({
    data: { nombre: trimmed },
    select: { id: true, nombre: true },
  });

  revalidateMinistracion();
  return familia;
}

// ---------- Asignaciones ----------

const AsignacionSchema = z.object({
  companerismoId: z.string().trim().min(1, "Elige un compañerismo."),
  familiaId: z.string().trim().min(1, "Busca o crea una familia."),
});

export type AsignacionFormState = { errors?: Record<string, string[]> } | undefined;

export async function createAsignacion(
  _prevState: AsignacionFormState,
  formData: FormData
): Promise<AsignacionFormState> {
  await requireSession();

  const validated = AsignacionSchema.safeParse({
    companerismoId: formData.get("companerismoId"),
    familiaId: formData.get("familiaId"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { companerismoId, familiaId } = validated.data;

  await prisma.asignacionMinistracion.create({
    data: { companerismoId, familiaId },
  });
  revalidateMinistracion();
}

export async function registrarVisita(id: string) {
  await requireSession();
  await prisma.asignacionMinistracion.update({
    where: { id },
    data: { ultimoContacto: new Date() },
  });
  revalidateMinistracion();
}

export async function quitarAsignacion(id: string) {
  await requireSession();
  await prisma.asignacionMinistracion.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidateMinistracion();
}

export async function restoreAsignacion(id: string) {
  await requireSession();
  await prisma.asignacionMinistracion.update({
    where: { id },
    data: { deletedAt: null },
  });
  revalidateMinistracion();
}
