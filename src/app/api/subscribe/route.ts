import { NextRequest, NextResponse } from "next/server";
import { postSuscriptor } from "@/lib/api";
import type { SuscriptorInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const data = (await request.json()) as SuscriptorInput;

  if (!data.email) {
    return NextResponse.json({ mensaje: "El email es obligatorio." }, { status: 400 });
  }

  try {
    const result = await postSuscriptor(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error al suscribir.";
    return NextResponse.json({ mensaje }, { status: 500 });
  }
}
