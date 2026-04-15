import { NextRequest, NextResponse } from "next/server";
import { getImageProvider } from "@/lib/image-providers";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const { prompt, articleSlug, action, imageUrl } = await request.json();

  // Save action — download a previewed image to disk
  if (action === "save" && imageUrl && articleSlug) {
    const imagesDir = path.join(process.cwd(), "images", articleSlug);
    fs.mkdirSync(imagesDir, { recursive: true });

    const existing = fs.readdirSync(imagesDir).filter((f) => /^v\d+\.png$/.test(f));
    const nextVersion = existing.length + 1;
    const filename = `v${nextVersion}.png`;

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    fs.writeFileSync(path.join(imagesDir, filename), buffer);

    if (prompt) {
      fs.writeFileSync(path.join(imagesDir, "prompt.md"), prompt, "utf-8");
    }

    return NextResponse.json({ saved: `/images/${articleSlug}/${filename}` });
  }

  // Generate action
  try {
    const provider = getImageProvider();
    const result = await provider.generate(prompt);
    return NextResponse.json({ url: result.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
