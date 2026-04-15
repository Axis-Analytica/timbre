import { NextRequest, NextResponse } from "next/server";
import { getArticle, saveArticle, deleteArticle } from "@/lib/content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { frontmatter, content } = await request.json();
  const now = new Date().toISOString().split("T")[0];
  frontmatter.updated = now;
  saveArticle(slug, frontmatter, content);
  return NextResponse.json({ slug, frontmatter });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = deleteArticle(slug);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
