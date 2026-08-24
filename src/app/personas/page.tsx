import { PersonaShell } from "./persona-shell";

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; trash?: string }>;
}) {
  const { q, trash } = await searchParams;
  return <PersonaShell q={q} showTrash={trash === "1"} />;
}
