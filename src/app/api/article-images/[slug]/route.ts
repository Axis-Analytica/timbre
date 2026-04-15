import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "images");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const dir = path.join(IMAGES_DIR, slug);

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ images: [] });
  }

  const images = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort()
    .map((f) => `/images/${slug}/${f}`);

  return NextResponse.json({ images });
}
