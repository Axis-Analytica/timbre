import { NextRequest, NextResponse } from "next/server";
import { listArticles, saveArticle, createSlug } from "@/lib/content";
import { ArticleFrontmatter } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  let articles = listArticles();
  if (status) articles = articles.filter((a) => a.frontmatter.status === status);
  if (platform) articles = articles.filter((a) => a.frontmatter.platform === platform || a.frontmatter.platform === "both");

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const { title, platform, content } = await request.json();
  const slug = createSlug(title);
  const now = new Date().toISOString().split("T")[0];

  const frontmatter: ArticleFrontmatter = {
    title,
    status: "idea",
    platform: platform || "linkedin",
    created: now,
    updated: now,
    version: 1,
    tags: [],
  };

  saveArticle(slug, frontmatter, content || "");
  return NextResponse.json({ slug, frontmatter });
}
