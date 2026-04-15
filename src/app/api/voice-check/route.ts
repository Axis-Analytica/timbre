import { NextRequest, NextResponse } from "next/server";
import { voiceCheck } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { draft } = await request.json();
  const result = await voiceCheck(draft);
  return NextResponse.json({ result });
}
