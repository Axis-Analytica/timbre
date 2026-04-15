import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, ArticleFrontmatter, ArticleStatus } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function ensureDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

export function listArticles(): Article[] {
  ensureDir();
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        frontmatter: data as ArticleFrontmatter,
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.updated).getTime() -
        new Date(a.frontmatter.updated).getTime()
    );
}

export function getArticle(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as ArticleFrontmatter, content };
}

export function saveArticle(slug: string, frontmatter: ArticleFrontmatter, content: string): void {
  ensureDir();
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, raw, "utf-8");
}

export function createSlug(title: string): string {
  const date = new Date().toISOString().split("T")[0];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${date}-${slug}`;
}

export function deleteArticle(slug: string): boolean {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function listArticlesByStatus(status: ArticleStatus): Article[] {
  return listArticles().filter((a) => a.frontmatter.status === status);
}
