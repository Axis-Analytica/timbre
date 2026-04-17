"use client";

import { useState } from "react";
import { Article } from "@/lib/types";
import { motion } from "motion/react";

export default function ImagePromptGenerator({
  articles,
  onSlugChange,
  onImageGenerated,
}: {
  articles: Article[];
  onSlugChange?: (slug: string) => void;
  onImageGenerated?: () => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendingToApi, setSendingToApi] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedArticle = articles.find((a) => a.slug === selectedSlug);

  async function generatePrompt() {
    if (!selectedArticle) return;
    setGenerating(true);
    const res = await fetch("/api/image-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: selectedArticle.content,
        title: selectedArticle.frontmatter.title,
      }),
    });
    const { prompt: newPrompt } = await res.json();
    setPrompt(newPrompt);
    setGenerating(false);
  }

  function copyPrompt() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground mb-1">Image Studio</h2>
      <p className="text-xs text-muted mb-5">Generate editorial image prompts from your articles</p>

      <div
        className="bg-surface border border-border rounded-lg p-4 mb-3"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <label className="text-[11px] uppercase tracking-widest text-muted block mb-2">
          Source article
        </label>
        <select
          value={selectedSlug}
          onChange={(e) => {
            setSelectedSlug(e.target.value);
            setPrompt("");
            onSlugChange?.(e.target.value);
          }}
          className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-shadow duration-150"
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="">Select an article...</option>
          {articles.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.frontmatter.title} ({a.frontmatter.platform})
            </option>
          ))}
        </select>
      </div>

      {selectedSlug && !prompt && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={generatePrompt}
          disabled={generating}
          className="w-full py-2.5 bg-accent text-accent-foreground rounded-md text-sm font-medium mb-3 disabled:opacity-50"
        >
          {generating ? "Generating prompt..." : "Generate image prompt"}
        </motion.button>
      )}

      {prompt && (
        <div
          className="bg-surface border border-border rounded-lg p-4 mb-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[11px] uppercase tracking-widest text-accent">
              Generated prompt
            </span>
            <button
              onClick={generatePrompt}
              disabled={generating}
              className="px-2.5 py-1 border border-border rounded text-[10px] text-muted hover:bg-surface-hover transition-colors duration-150"
            >
              Regenerate
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-surface-hover rounded-md p-3 text-sm text-foreground leading-relaxed resize-y min-h-[80px] border-none focus:outline-none"
          />
        </div>
      )}

      {prompt && (
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={copyPrompt}
            className="flex-1 py-2 bg-accent text-accent-foreground rounded-md text-xs font-medium"
          >
            {copied ? "Copied!" : "Copy prompt"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              setSendingToApi(true);
              setPreviewUrl(null);
              const res = await fetch("/api/image-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
              });
              const data = await res.json();
              setSendingToApi(false);
              if (data.error) {
                alert(data.error);
              } else {
                setPreviewUrl(data.url);
              }
            }}
            disabled={sendingToApi}
            className="flex-1 py-2 border border-border rounded-md text-xs text-muted hover:bg-surface-hover disabled:opacity-50 transition-colors duration-150"
          >
            {sendingToApi ? "Generating image..." : "Send to API"}
          </motion.button>
        </div>
      )}
      {previewUrl && (
        <div
          className="mt-4 bg-surface border border-border rounded-lg p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="text-[11px] uppercase tracking-widest text-accent mb-2">Preview</p>
          <img
            src={previewUrl}
            alt="Generated editorial image"
            className="w-full rounded-md border border-border mb-3"
          />
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={async () => {
                setSaving(true);
                const res = await fetch("/api/image-generate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "save",
                    imageUrl: previewUrl,
                    articleSlug: selectedSlug,
                    prompt,
                  }),
                });
                const data = await res.json();
                setSaving(false);
                if (data.saved) {
                  setPreviewUrl(null);
                  onImageGenerated?.();
                }
              }}
              disabled={saving}
              className="flex-1 py-2 bg-accent text-accent-foreground rounded-md text-xs font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </motion.button>
            <button
              onClick={() => setPreviewUrl(null)}
              className="flex-1 py-2 border border-border rounded-md text-xs text-muted hover:bg-surface-hover transition-colors duration-150"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
