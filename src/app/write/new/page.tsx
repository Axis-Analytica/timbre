"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Platform } from "@/lib/types";
import { motion } from "motion/react";

export default function NewPiecePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("linkedin");

  async function handleCreate() {
    if (!title.trim()) return;
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, platform }),
    });
    const { slug } = await res.json();
    router.push(`/write/${slug}`);
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg">
      <h1 className="font-serif text-2xl text-foreground mb-6">New Piece</h1>

      <label className="block text-sm text-muted mb-1.5">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="The thirty percent rule"
        className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent mb-4 transition-shadow duration-150"
        style={{ boxShadow: "var(--shadow-card)" }}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-card)";
        }}
      />

      <label className="block text-sm text-muted mb-1.5">Platform</label>
      <div className="flex gap-2 mb-6">
        {(["linkedin", "substack", "both"] as Platform[]).map((p) => (
          <motion.button
            key={p}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-md text-sm capitalize border transition-colors duration-150 ${
              platform === p
                ? "border-accent text-accent bg-accent/5"
                : "border-border text-muted hover:border-border-hover"
            }`}
          >
            {p}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCreate}
        className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-150 ${
          title.trim()
            ? "bg-accent text-accent-foreground cursor-pointer hover:-translate-y-px"
            : "bg-accent/50 text-accent-foreground/70 cursor-not-allowed"
        }`}
        style={title.trim() ? { boxShadow: "var(--shadow-card)" } : {}}
        onMouseEnter={(e) => {
          if (title.trim()) e.currentTarget.style.boxShadow = "var(--shadow-accent-glow)";
        }}
        onMouseLeave={(e) => {
          if (title.trim()) e.currentTarget.style.boxShadow = "var(--shadow-card)";
        }}
      >
        Create
      </motion.button>
    </div>
  );
}
