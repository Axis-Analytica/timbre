"use client";

import { useState } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";

const statusColors: Record<string, string> = {
  idea: "text-idea",
  draft: "text-draft",
  review: "text-warning",
  published: "text-success",
};

export default function ArticleCard({
  article,
  onDelete,
}: {
  article: Article;
  onDelete?: (slug: string) => void;
}) {
  const { slug, frontmatter } = article;
  const [confirming, setConfirming] = useState(false);

  const daysSince = Math.floor(
    (Date.now() - new Date(frontmatter.updated).getTime()) / 86400000
  );
  const recency =
    daysSince === 0 ? "today" : daysSince === 1 ? "1d ago" : daysSince < 7 ? `${daysSince}d ago` : `${Math.floor(daysSince / 7)}w ago`;

  if (confirming) {
    return (
      <div className="bg-surface rounded-lg p-3 border border-draft/30">
        <p className="text-xs text-foreground mb-2">Delete &ldquo;{frontmatter.title}&rdquo;?</p>
        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(slug);
            }}
            className="flex-1 py-1 rounded text-xs text-accent-foreground bg-draft"
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(false);
            }}
            className="flex-1 py-1 rounded text-xs text-muted border border-border"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-surface rounded-lg p-3 border border-border hover:border-border-hover transition-colors">
      <Link href={`/write/${slug}`} className="block">
        <p className="text-sm text-foreground mb-1.5 pr-5">{frontmatter.title}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted">{frontmatter.platform}</span>
          <span className={`text-[10px] ${statusColors[frontmatter.status] || "text-muted"}`}>
            {recency}
          </span>
        </div>
      </Link>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setConfirming(true);
          }}
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded flex items-center justify-center text-muted hover:text-draft hover:bg-draft/10 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        >
          x
        </button>
      )}
    </div>
  );
}
