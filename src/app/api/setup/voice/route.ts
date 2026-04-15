import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const { voiceDescription, name } = await request.json();

  const voiceDir = path.join(process.cwd(), "voice");
  const contentDir = path.join(process.cwd(), "content");
  const imagesDir = path.join(process.cwd(), "images");

  // Create directories
  fs.mkdirSync(voiceDir, { recursive: true });
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  // Write style guide
  const styleGuide = `# ${name}'s Voice Framework\n\n${voiceDescription}\n`;
  fs.writeFileSync(path.join(voiceDir, "style-guide.md"), styleGuide, "utf-8");

  // Write empty examples if it doesn't exist
  if (!fs.existsSync(path.join(voiceDir, "examples.md"))) {
    fs.writeFileSync(
      path.join(voiceDir, "examples.md"),
      `# Voice Examples\n\nAdd approved writing samples here to help calibrate the voice.\n`,
      "utf-8"
    );
  }

  // Write empty corrections if it doesn't exist
  if (!fs.existsSync(path.join(voiceDir, "corrections.json"))) {
    fs.writeFileSync(path.join(voiceDir, "corrections.json"), "[]", "utf-8");
  }

  return NextResponse.json({ success: true });
}
