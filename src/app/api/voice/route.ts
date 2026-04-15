import { NextRequest, NextResponse } from "next/server";
import { getStyleGuide, saveStyleGuide, getExamples } from "@/lib/voice";

export async function GET() {
  return NextResponse.json({
    styleGuide: getStyleGuide(),
    examples: getExamples(),
  });
}

export async function PUT(request: NextRequest) {
  const { styleGuide } = await request.json();
  saveStyleGuide(styleGuide);
  return NextResponse.json({ success: true });
}
