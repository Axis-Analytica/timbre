"use client";

import { useState } from "react";
import { Article } from "@/lib/types";
import { useConfig } from "@/components/ConfigProvider";

type PreviewMode = "linkedin" | "substack" | "markdown";

export default function PlatformPreview({
  content,
  article,
}: {
  content: string;
  article: Article;
}) {
  const config = useConfig();
  const [mode, setMode] = useState<PreviewMode>(
    article.frontmatter.platform === "substack" ? "substack" : "linkedin"
  );
  const [copied, setCopied] = useState(false);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getLinkedInText(): string {
    return content.replace(/[#*_`~]/g, "").trim();
  }

  function getSubstackText(): string {
    return content.trim();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <p className="text-[11px] uppercase tracking-widest text-muted mb-2">Preview</p>
        <div className="flex gap-1">
          {(["linkedin", "substack", "markdown"] as PreviewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-1.5 text-center rounded text-xs capitalize ${
                mode === m
                  ? "bg-surface-hover border border-border text-foreground font-medium"
                  : "text-muted"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {mode === "linkedin" && (
          <div className="border border-border rounded-lg p-3 bg-surface-hover">
            <div className="flex gap-2 mb-2.5 items-center">
              <div className="w-9 h-9 bg-border rounded-full" />
              <div>
                <p className="text-xs font-semibold text-foreground">{config.name}</p>
                <p className="text-[10px] text-muted">{config.bio}</p>
              </div>
            </div>
            <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {getLinkedInText().slice(0, 300)}
              {getLinkedInText().length > 300 && (
                <span className="text-muted">...see more</span>
              )}
            </div>
          </div>
        )}

        {mode === "substack" && (
          <div className="border border-border rounded-lg p-4 bg-surface">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {article.frontmatter.title}
            </h3>
            <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {content.slice(0, 500)}
              {content.length > 500 && <span className="text-muted">...</span>}
            </div>
          </div>
        )}

        {mode === "markdown" && (
          <pre className="text-xs text-foreground bg-surface-hover rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-border">
            {content}
          </pre>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <button
          onClick={() =>
            copyToClipboard(mode === "linkedin" ? getLinkedInText() : mode === "substack" ? getSubstackText() : content)
          }
          className="w-full py-2 bg-accent rounded-md text-xs text-accent-foreground font-medium"
        >
          {copied ? "Copied!" : `Copy for ${mode}`}
        </button>
        <button
          onClick={() => copyToClipboard(content)}
          className="w-full py-2 border border-border rounded-md text-xs text-muted"
        >
          Copy raw markdown
        </button>
      </div>
    </div>
  );
}
