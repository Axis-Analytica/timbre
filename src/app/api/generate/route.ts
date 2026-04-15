import { NextRequest } from "next/server";
import { generateDraft } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { input, mode, platform, currentDraft, revisionNotes } =
    await request.json();

  const stream = await generateDraft(
    input,
    mode,
    platform,
    currentDraft,
    revisionNotes
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
