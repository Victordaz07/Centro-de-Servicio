import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PersonaShell } from "../persona-shell";
import { PersonaDetail } from "./persona-detail";

export default async function PersonaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; trash?: string }>;
}) {
  const { id } = await params;
  const { q, trash } = await searchParams;

  const persona = await prisma.persona.findUnique({ where: { id } });
  if (!persona) notFound();

  const bautismo = await prisma.bautismo.findUnique({
    where: { personaId: id },
    include: { planIntegracion: { include: { hitos: true } } },
  });

  const backParams = new URLSearchParams();
  if (q?.trim()) backParams.set("q", q.trim());
  if (trash === "1") backParams.set("trash", "1");
  const backHref = backParams.size > 0 ? `/personas?${backParams.toString()}` : "/personas";

  return (
    <PersonaShell
      q={q}
      showTrash={trash === "1"}
      activeId={id}
      detail={<PersonaDetail persona={persona} bautismo={bautismo} backHref={backHref} />}
    />
  );
}
