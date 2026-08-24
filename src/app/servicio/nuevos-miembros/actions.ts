"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoEnsenanza } from "@/generated/prisma/enums";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

function revalidateNuevosMiembros() {
  revalidatePath("/servicio/nuevos-miembros");
}

// ---------- Enseñanza ----------

const EnsenanzaSchema = z.object({
  personaId: z.string().trim().min(1, "Busca o crea una persona."),
});

export type EnsenanzaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createEnsenanza(
  _prevState: EnsenanzaFormState,
  formData: FormData
): Promise<EnsenanzaFormState> {
  await requireSession();

  const validated = EnsenanzaSchema.safeParse({ personaId: formData.get("personaId") });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  await prisma.ensenanzaProgreso.create({
    data: {
      personaId: validated.data.personaId,
      estado: EstadoEnsenanza.CONTACTADO,
      lecciones: [],
      compromisos: [],
    },
  });
  revalidateNuevosMiembros();
}

export async function updateEstadoEnsenanza(id: string, estado: EstadoEnsenanza) {
  await requireSession();
  await prisma.ensenanzaProgreso.update({ where: { id }, data: { estado } });
  revalidateNuevosMiembros();
}

export async function deleteEnsenanza(id: string) {
  await requireSession();
  await prisma.ensenanzaProgreso.delete({ where: { id } });
  revalidateNuevosMiembros();
}

type Leccion = { tema: string; fecha: string };
type Compromiso = { descripcion: string; cumplido: boolean };

export async function addLeccion(ensenanzaId: string, tema: string) {
  await requireSession();
  const trimmed = tema.trim();
  if (!trimmed) return;

  const ensenanza = await prisma.ensenanzaProgreso.findUniqueOrThrow({
    where: { id: ensenanzaId },
    select: { lecciones: true },
  });
  const actuales = (ensenanza.lecciones as Leccion[]) ?? [];

  await prisma.ensenanzaProgreso.update({
    where: { id: ensenanzaId },
    data: { lecciones: [...actuales, { tema: trimmed, fecha: new Date().toISOString() }] },
  });
  revalidateNuevosMiembros();
}

export async function addCompromiso(ensenanzaId: string, descripcion: string) {
  await requireSession();
  const trimmed = descripcion.trim();
  if (!trimmed) return;

  const ensenanza = await prisma.ensenanzaProgreso.findUniqueOrThrow({
    where: { id: ensenanzaId },
    select: { compromisos: true },
  });
  const actuales = (ensenanza.compromisos as Compromiso[]) ?? [];

  await prisma.ensenanzaProgreso.update({
    where: { id: ensenanzaId },
    data: { compromisos: [...actuales, { descripcion: trimmed, cumplido: false }] },
  });
  revalidateNuevosMiembros();
}

export async function toggleCompromiso(ensenanzaId: string, index: number) {
  await requireSession();
  const ensenanza = await prisma.ensenanzaProgreso.findUniqueOrThrow({
    where: { id: ensenanzaId },
    select: { compromisos: true },
  });
  const actuales = (ensenanza.compromisos as Compromiso[]) ?? [];
  const nuevos = actuales.map((c, i) => (i === index ? { ...c, cumplido: !c.cumplido } : c));

  await prisma.ensenanzaProgreso.update({
    where: { id: ensenanzaId },
    data: { compromisos: nuevos },
  });
  revalidateNuevosMiembros();
}

// ---------- Referencias ----------

const ReferenciaSchema = z.object({
  personaQueRefiereId: z.string().trim().min(1, "Busca o crea quién refiere."),
  personaReferidaId: z.string().trim().optional(),
  notas: z.string().trim().optional(),
});

export type ReferenciaFormState = { errors?: Record<string, string[]> } | undefined;

export async function createReferencia(
  _prevState: ReferenciaFormState,
  formData: FormData
): Promise<ReferenciaFormState> {
  await requireSession();

  const validated = ReferenciaSchema.safeParse({
    personaQueRefiereId: formData.get("personaQueRefiereId"),
    personaReferidaId: formData.get("personaReferidaId"),
    notas: formData.get("notas"),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const { personaQueRefiereId, personaReferidaId, notas } = validated.data;

  if (personaReferidaId) {
    const existente = await prisma.referencia.findUnique({ where: { personaReferidaId } });
    if (existente) {
      return { errors: { personaReferidaId: ["Esta persona ya tiene una referencia registrada."] } };
    }
  }

  await prisma.referencia.create({
    data: {
      personaQueRefiereId,
      personaReferidaId: personaReferidaId || null,
      notas: notas || null,
    },
  });
  revalidateNuevosMiembros();
}

export async function toggleContactada(id: string, contactada: boolean) {
  await requireSession();
  await prisma.referencia.update({ where: { id }, data: { contactada } });
  revalidateNuevosMiembros();
}

export async function deleteReferencia(id: string) {
  await requireSession();
  await prisma.referencia.delete({ where: { id } });
  revalidateNuevosMiembros();
}
