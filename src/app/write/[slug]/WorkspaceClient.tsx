"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import PlatformPreview from "@/components/PlatformPreview";
import VoiceFeedback from "@/components/VoiceFeedback";

export default function WorkspaceClient({ article: initial }: { article: Article }) {
  const router = useRouter();
  const [article, setArticle] = useState(initial);
  const [draft, setDraft] = useState(initial.content);

  async function handleSave(content: string, frontmatter: Article["frontmatter"]) {
    await fetch(`/api/content/${article.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frontmatter: { ...frontmatter, version: frontmatter.version + 1 }, content }),
    });
    setArticle({ ...article, content, frontmatter: { ...frontmatter, version: frontmatter.version + 1 } });
    setDraft(content);
  }

  return (
    <div className="flex h-screen">
      <Sidebar collapsed />
      <div className="flex-1 flex">
        <div className="flex-1 border-r border-border flex flex-col">
          <Editor
            article={article}
            onSave={handleSave}
            onDraftChange={setDraft}
            onDelete={async () => {
              await fetch(`/api/content/${article.slug}`, { method: "DELETE" });
              router.push("/");
            }}
          />
        </div>
        <div className="w-64 bg-surface flex flex-col shrink-0">
          <PlatformPreview content={draft} article={article} />
          <VoiceFeedback article={article} />
        </div>
      </div>
    </div>
  );
}
