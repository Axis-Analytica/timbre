"use client";

import { useState } from "react";
import { Article } from "@/lib/types";

export default function VoiceFeedback({ article }: { article: Article }) {
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit(sentiment: "positive" | "negative") {
    await fetch("/api/voice/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        sentiment,
        note: note || (sentiment === "positive" ? "Sounds right" : "Not quite right"),
        article: article.slug,
        platform: article.frontmatter.platform,
      }),
    });
    setNote("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="p-3 border-t border-border">
      <p className="text-[11px] uppercase tracking-widest text-muted mb-2">Voice feedback</p>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What worked or didn't? (optional)"
        className="w-full bg-surface-hover border border-border rounded px-2.5 py-1.5 text-xs text-foreground mb-2 focus:outline-none focus:border-accent"
      />
      {submitted ? (
        <p className="text-xs text-success text-center py-1.5">Logged. Thanks.</p>
      ) : (
        <div className="flex gap-1.5">
          <button
            onClick={() => submit("positive")}
            className="flex-1 py-1.5 text-center border border-border rounded text-xs text-success hover:bg-success/5"
          >
            Sounds like me
          </button>
          <button
            onClick={() => submit("negative")}
            className="flex-1 py-1.5 text-center border border-border rounded text-xs text-draft hover:bg-draft/5"
          >
            Not quite
          </button>
        </div>
      )}
    </div>
  );
}
