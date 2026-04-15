"use client";

import { useState } from "react";
import { Article, ArticleStatus } from "@/lib/types";
import ArticleCard from "./ArticleCard";

const columns: { status: ArticleStatus; label: string; color: string; dotColor: string }[] = [
  { status: "idea", label: "Idea", color: "text-idea", dotColor: "bg-idea" },
  { status: "draft", label: "Draft", color: "text-draft", dotColor: "bg-draft" },
  { status: "review", label: "Review", color: "text-warning", dotColor: "bg-warning" },
  { status: "published", label: "Published", color: "text-success", dotColor: "bg-success" },
];

export default function PipelineBoard({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);

  async function deleteArticle(slug: string) {
    await fetch(`/api/content/${slug}`, { method: "DELETE" });
    setArticles((prev) => prev.filter((a) => a.slug !== slug));
  }

  async function moveArticle(slug: string, newStatus: ArticleStatus) {
    const article = articles.find((a) => a.slug === slug);
    if (!article) return;

    const updated = { ...article.frontmatter, status: newStatus };
    await fetch(`/api/content/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frontmatter: updated, content: article.content }),
    });

    setArticles((prev) =>
      prev.map((a) =>
        a.slug === slug ? { ...a, frontmatter: { ...a.frontmatter, status: newStatus } } : a
      )
    );
  }

  return (
    <div className="flex gap-4">
      {columns.map((col) => {
        const colArticles = articles.filter((a) => a.frontmatter.status === col.status);
        return (
          <div key={col.status} className="flex-1 min-w-[185px]">
            <div className={`text-[11px] uppercase tracking-widest mb-3 flex items-center gap-1.5 ${col.color}`}>
              <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              {col.label}
              <span className="text-border-hover text-[11px]">({colArticles.length})</span>
            </div>
            <div
              className="space-y-2 min-h-[100px] rounded-lg p-1"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const slug = e.dataTransfer.getData("text/plain");
                if (slug) moveArticle(slug, col.status);
              }}
            >
              {colArticles.map((article) => (
                <div
                  key={article.slug}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", article.slug)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <ArticleCard article={article} onDelete={deleteArticle} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
