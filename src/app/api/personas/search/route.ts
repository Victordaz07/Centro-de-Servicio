import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchPersonas } from "@/lib/personas";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const personas = await searchPersonas(q);

  return NextResponse.json({ personas });
}
