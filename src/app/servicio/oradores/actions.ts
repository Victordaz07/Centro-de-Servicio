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

function revalidateOradores() {
  revalidatePath("/servicio/oradores");
}

// ---------- Programa sacramental ----------

const ProgramaSchema = z.object({
  fecha: z.string().trim().min(1, "La fecha es obligatoria."),
  conductor: z.string().trim().optional(),
});

export type ProgramaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createPrograma(
  _prevState: ProgramaFormState,
  formData: FormData
): Promise<ProgramaFormState> {
  await requireSession();

  const validated = ProgramaSchema.safeParse({
    fecha: formData.get("fecha"),
    conductor: formData.get("conductor"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { fecha, conductor } = validated.data;

  await prisma.programaSacramental.create({
    data: { fecha: new Date(fecha), conductor: conductor || null, numerosMusicales: [] },
  });

  revalidateOradores();
}

export async function deletePrograma(id: string) {
  await requireSession();
  await prisma.$transaction([
    prisma.oradorAsignado.deleteMany({ where: { programaId: id } }),
    prisma.programaSacramental.delete({ where: { id } }),
  ]);
  revalidateOradores();
}

// ---------- Oradores ----------

const OradorSchema = z.object({
  personaId: z.string().trim().min(1, "Busca o crea una persona."),
  tema: z.string().trim().optional(),
});

export type OradorFormState = { errors?: Record<string, string[]> } | undefined;

export async function addOrador(
  programaId: string,
  _prevState: OradorFormState,
  formData: FormData
): Promise<OradorFormState> {
  await requireSession();

  const validated = OradorSchema.safeParse({
    personaId: formData.get("personaId"),
    tema: formData.get("tema"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { personaId, tema } = validated.data;

  await prisma.oradorAsignado.create({
    data: { programaId, personaId, tema: tema || null },
  });
  revalidateOradores();
}

export async function removeOrador(id: string) {
  await requireSession();
  await prisma.oradorAsignado.delete({ where: { id } });
  revalidateOradores();
}

// ---------- Números musicales (Json en el programa) ----------

type NumeroMusical = { texto: string };

export async function addNumeroMusical(programaId: string, texto: string) {
  await requireSession();
  const trimmed = texto.trim();
  if (!trimmed) return;

  const programa = await prisma.programaSacramental.findUniqueOrThrow({
    where: { id: programaId },
    select: { numerosMusicales: true },
  });
  const actuales = (programa.numerosMusicales as NumeroMusical[]) ?? [];

  await prisma.programaSacramental.update({
    where: { id: programaId },
    data: { numerosMusicales: [...actuales, { texto: trimmed }] },
  });
  revalidateOradores();
}

export async function removeNumeroMusical(programaId: string, index: number) {
  await requireSession();
  const programa = await prisma.programaSacramental.findUniqueOrThrow({
    where: { id: programaId },
    select: { numerosMusicales: true },
  });
  const actuales = (programa.numerosMusicales as NumeroMusical[]) ?? [];

  await prisma.programaSacramental.update({
    where: { id: programaId },
    data: { numerosMusicales: actuales.filter((_, i) => i !== index) },
  });
  revalidateOradores();
}
