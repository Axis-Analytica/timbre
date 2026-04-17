"use client";

import { useState } from "react";
import { Article, ArticleStatus } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import { motion, AnimatePresence } from "motion/react";

const columns: { status: ArticleStatus; label: string; color: string; dotColor: string }[] = [
  { status: "idea", label: "Idea", color: "text-idea", dotColor: "bg-idea" },
  { status: "draft", label: "Draft", color: "text-draft", dotColor: "bg-draft" },
  { status: "review", label: "Review", color: "text-warning", dotColor: "bg-warning" },
  { status: "published", label: "Published", color: "text-success", dotColor: "bg-success" },
];

export default function PipelineBoard({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ArticleStatus | null>(null);

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
    <div className="flex gap-6">
      {columns.map((col) => {
        const colArticles = articles.filter((a) => a.frontmatter.status === col.status);
        const isDragOver = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            className={`flex-1 min-w-[185px] bg-surface rounded-xl p-4 transition-colors duration-150 ${
              isDragOver ? "bg-surface-warm" : ""
            }`}
            style={{
              boxShadow: "var(--shadow-card)",
              border: isDragOver
                ? "2px dashed rgba(249, 115, 22, 0.2)"
                : "2px solid transparent",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumn(col.status);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => {
              const slug = e.dataTransfer.getData("text/plain");
              if (slug) moveArticle(slug, col.status);
              setDragOverColumn(null);
              setDraggingSlug(null);
            }}
          >
            {/* Column header */}
            <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-border">
              <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              <span
                className={`text-[10px] uppercase tracking-widest font-medium ${col.color}`}
              >
                {col.label}
              </span>
              <span className="text-[10px] text-muted ml-auto">{colArticles.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[60px]">
              <AnimatePresence mode="popLayout">
                {colArticles.map((article) => (
                  <motion.div
                    key={article.slug}
                    layout
                    layoutId={article.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    draggable
                    onDragStart={(e) => {
                      (e as unknown as DragEvent).dataTransfer?.setData(
                        "text/plain",
                        article.slug
                      );
                      setDraggingSlug(article.slug);
                    }}
                    onDragEnd={() => setDraggingSlug(null)}
                    className={`cursor-grab active:cursor-grabbing transition-transform ${
                      draggingSlug === article.slug ? "opacity-60 rotate-2" : ""
                    }`}
                  >
                    <ArticleCard article={article} onDelete={deleteArticle} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {colArticles.length === 0 && !isDragOver && (
                <p className="text-xs text-muted text-center py-6 italic font-light">
                  Drop a piece here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
