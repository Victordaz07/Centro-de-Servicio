import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchFamilias } from "@/lib/familias";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const familias = await searchFamilias(q);
  return NextResponse.json({ familias });
}
