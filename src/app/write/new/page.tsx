"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Platform } from "@/lib/types";

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
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold text-foreground mb-6">New Piece</h1>

      <label className="block text-sm text-muted mb-1.5">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="The thirty percent rule"
        className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent mb-4"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
        }}
      />

      <label className="block text-sm text-muted mb-1.5">Platform</label>
      <div className="flex gap-2 mb-6">
        {(["linkedin", "substack", "both"] as Platform[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-md text-sm capitalize border ${
              platform === p
                ? "border-accent text-accent bg-accent/5"
                : "border-border text-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={handleCreate}
        className={`px-6 py-2.5 rounded-md text-sm font-semibold ${
          title.trim()
            ? "bg-accent text-accent-foreground cursor-pointer"
            : "bg-accent/50 text-accent-foreground/70 cursor-not-allowed"
        }`}
      >
        Create
      </button>
    </div>
  );
}
