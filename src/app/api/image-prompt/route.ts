import { NextRequest, NextResponse } from "next/server";
import { generateImagePrompt } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { content, title } = await request.json();
  const prompt = await generateImagePrompt(content, title);
  return NextResponse.json({ prompt });
}
