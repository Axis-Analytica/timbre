"use client";

import { useState } from "react";

interface Section {
  title: string;
  content: string;
}

function parseIntoSections(markdown: string): Section[] {
  const lines = markdown.split("\n");
  const sections: Section[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentLines.join("\n").trim() });
      }
      currentTitle = line.replace("## ", "");
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentLines.join("\n").trim() });
  }

  return sections;
}

function sectionsToMarkdown(sections: Section[], header: string): string {
  const body = sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n");
  return `${header}\n\n${body}\n`;
}

export default function StyleGuideEditor({ initialContent }: { initialContent: string }) {
  const headerEnd = initialContent.indexOf("\n## ");
  const header = headerEnd > -1 ? initialContent.slice(0, headerEnd).trim() : initialContent.split("\n")[0];

  const parsed = parseIntoSections(initialContent);
  const hasSections = parsed.length > 0;

  const [sections, setSections] = useState(() =>
    hasSections ? parsed : [{ title: "Voice Guide", content: initialContent.replace(/^#[^\n]*\n*/, "").trim() }]
  );
  const [openIndex, setOpenIndex] = useState<number | null>(hasSections ? null : 0);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const markdown = hasSections
      ? sectionsToMarkdown(sections, header)
      : `${header}\n\n${sections[0].content}\n`;
    await fetch("/api/voice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styleGuide: markdown }),
    });
    setSaving(false);
  }

  function updateSection(index: number, content: string) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, content } : s)));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Voice Style Guide</h2>
          <p className="text-xs text-muted">Your living voice framework</p>
        </div>
        <button
          onClick={save}
          className="px-3 py-1.5 bg-accent text-accent-foreground rounded-md text-xs font-medium"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((section, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-4 py-3 flex justify-between items-center text-left"
            >
              <span className="text-sm font-semibold text-foreground">{section.title}</span>
              <span className="text-xs text-muted">
                {openIndex === i ? "editing" : "collapsed"}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4">
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(i, e.target.value)}
                  className="w-full bg-surface-hover border border-border rounded-md p-3 text-sm text-foreground leading-6 min-h-[200px] resize-y focus:outline-none focus:border-accent"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
