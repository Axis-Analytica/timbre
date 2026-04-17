"use client";

import { useState, useCallback } from "react";
import { Article } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

type InputMode = "brief" | "transcription" | "edit";

export default function Editor({
  article,
  onSave,
  onDraftChange,
  onDelete,
}: {
  article: Article;
  onSave: (content: string, frontmatter: Article["frontmatter"]) => Promise<void>;
  onDraftChange?: (draft: string) => void;
  onDelete?: () => void;
}) {
  const [inputMode, setInputMode] = useState<InputMode>("brief");
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState(article.content);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [voiceCheckResult, setVoiceCheckResult] = useState<string | null>(null);
  const [checkingVoice, setCheckingVoice] = useState(false);

  function updateDraft(value: string) {
    setDraft(value);
    onDraftChange?.(value);
  }

  const generate = useCallback(async () => {
    setGenerating(true);
    updateDraft("");

    const body: Record<string, string> = {
      input: inputMode === "edit" ? draft : input,
      mode: inputMode === "edit" ? "brief" : inputMode,
      platform: article.frontmatter.platform,
    };

    if (revisionNotes && draft) {
      body.currentDraft = draft;
      body.revisionNotes = revisionNotes;
    }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.body) {
      setGenerating(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      updateDraft(accumulated);
    }

    setGenerating(false);
    setRevisionNotes("");
  }, [input, inputMode, draft, revisionNotes, article.frontmatter.platform]);

  const runVoiceCheck = useCallback(async () => {
    setCheckingVoice(true);
    const res = await fetch("/api/voice-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft }),
    });
    const { result } = await res.json();
    setVoiceCheckResult(result);
    setCheckingVoice(false);
  }, [draft]);

  const handleSave = () => {
    onSave(draft, article.frontmatter);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="px-5 py-3 bg-surface flex justify-between items-center relative">
        <div>
          <h2 className="font-serif text-lg text-foreground">
            {article.frontmatter.title}
          </h2>
          <p className="text-xs text-muted mt-0.5" style={{ letterSpacing: "0.02em" }}>
            {article.frontmatter.platform} · {article.frontmatter.status} · v{article.frontmatter.version}
          </p>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`Delete "${article.frontmatter.title}"?`)) onDelete();
              }}
              className="px-3 py-1.5 border border-border rounded-md text-xs text-muted hover:text-draft hover:border-draft/30 transition-colors duration-150"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-1.5 border border-border rounded-md text-xs text-muted hover:bg-surface-hover transition-colors duration-150"
          >
            Save
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onSave(draft, { ...article.frontmatter, status: "review" });
            }}
            className="px-3 py-1.5 bg-accent rounded-md text-xs text-accent-foreground font-medium transition-all duration-150 hover:-translate-y-px"
            style={{ boxShadow: "var(--shadow-card)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-card)";
            }}
          >
            Publish-ready
          </motion.button>
        </div>
        {/* Gradient bottom border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Mode toggle */}
      <div className="px-5 py-2.5 bg-surface-hover border-b border-border flex gap-1 items-center">
        <div className="relative flex gap-1">
          {(["brief", "transcription", "edit"] as InputMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`relative px-3 py-1 rounded text-xs capitalize transition-colors duration-150 ${
                inputMode === mode ? "text-foreground font-medium" : "text-muted hover:text-foreground"
              }`}
            >
              {mode}
              {inputMode === mode && (
                <motion.div
                  layoutId="editor-mode-indicator"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          onClick={runVoiceCheck}
          disabled={!draft || checkingVoice}
          className="px-3 py-1 rounded text-xs text-muted border border-border hover:border-accent/30 hover:text-accent disabled:opacity-50 transition-colors duration-150"
        >
          {checkingVoice ? "Checking..." : "Voice check"}
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl">
          {inputMode !== "edit" && (
            <>
              <p className="text-sm text-muted mb-3">
                {inputMode === "brief"
                  ? "What's the idea? Describe it naturally, like you'd explain it to a mate."
                  : "Paste your raw transcription or brain-dump below."}
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  inputMode === "brief"
                    ? "I keep seeing this pattern where..."
                    : "So the thing I've been thinking about is..."
                }
                className="w-full bg-surface border border-border rounded-lg p-4 text-sm text-foreground min-h-[120px] resize-y focus:outline-none focus:border-accent transition-shadow duration-150"
                style={{ boxShadow: "var(--shadow-card)" }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={generate}
                disabled={!input || generating}
                className="mt-3 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate draft"}
              </motion.button>
            </>
          )}

          {/* Draft display / editor */}
          {(draft || inputMode === "edit") && (
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-widest text-accent mb-2">
                {inputMode === "edit" ? "Editing" : "Generated draft"}
              </p>
              {inputMode === "edit" ? (
                <textarea
                  value={draft}
                  onChange={(e) => updateDraft(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg p-4 text-sm text-foreground min-h-[300px] resize-y focus:outline-none focus:border-accent leading-7 transition-shadow duration-150"
                  style={{ boxShadow: "var(--shadow-card)" }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }}
                />
              ) : (
                <div
                  className="bg-surface border border-border rounded-lg p-4 text-sm text-foreground leading-7 whitespace-pre-wrap"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  {draft}
                  {generating && (
                    <span
                      className="inline-block w-1.5 h-4 bg-accent ml-0.5"
                      style={{ animation: "cursor-pulse 1.2s ease-in-out infinite" }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Revision input */}
          <AnimatePresence>
            {draft && inputMode !== "edit" && !generating && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" as const }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="text"
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Revision notes (e.g., make the opening less declarative)"
                  className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-shadow duration-150"
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && revisionNotes) generate();
                  }}
                />
                <button
                  onClick={generate}
                  disabled={!revisionNotes}
                  className="px-3 py-2 border border-border rounded-md text-sm text-muted hover:bg-surface-hover disabled:opacity-50 transition-colors duration-150"
                >
                  Revise
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice check results */}
          <AnimatePresence>
            {voiceCheckResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 bg-surface border border-border rounded-lg p-4"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <p className="text-[11px] uppercase tracking-widest text-warning mb-2">
                    Voice check
                  </p>
                  <div className="text-sm text-foreground leading-6 whitespace-pre-wrap">
                    {voiceCheckResult}
                  </div>
                  <button
                    onClick={() => setVoiceCheckResult(null)}
                    className="mt-2 text-xs text-muted relative group"
                  >
                    <span>Dismiss</span>
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-muted group-hover:w-full transition-all duration-200" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
