import { NextRequest, NextResponse } from "next/server";
import { getCorrections, addCorrection } from "@/lib/voice";

export async function GET() {
  return NextResponse.json(getCorrections());
}

export async function POST(request: NextRequest) {
  const correction = await request.json();
  addCorrection(correction);
  return NextResponse.json({ success: true });
}
