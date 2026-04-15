"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConfig } from "@/components/ConfigProvider";

const views = [
  { href: "/", label: "Pipeline" },
  { href: "/writing", label: "All Writing" },
  { href: "/voice", label: "Voice Guide" },
  { href: "/images", label: "Image Studio" },
];

const platforms = [
  { href: "/writing?platform=linkedin", label: "LinkedIn" },
  { href: "/writing?platform=substack", label: "Substack" },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const config = useConfig();

  if (collapsed) {
    return (
      <aside className="w-14 bg-surface border-r border-border flex flex-col items-center py-4 gap-4 shrink-0">
        <Link
          href="/"
          className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-accent-foreground text-sm font-bold"
        >
          T
        </Link>
        <div className="w-px h-4 bg-border" />
        {views.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs border ${
              pathname === v.href
                ? "border-accent text-accent"
                : "border-border text-muted"
            }`}
          >
            {v.label[0]}
          </Link>
        ))}
      </aside>
    );
  }

  return (
    <aside className="w-56 bg-surface border-r border-border p-4 shrink-0 flex flex-col">
      <div className="mb-1">
        <span className="text-base font-bold text-foreground tracking-tight">Timbre</span>
      </div>
      <p className="text-xs text-muted mb-6">by {config.brand}</p>

      <Link
        href="/write/new"
        className="block text-center py-2.5 bg-accent rounded-md text-accent-foreground text-sm font-semibold mb-5"
      >
        + New Piece
      </Link>

      <div className="mb-5">
        <p className="text-[10px] uppercase text-muted tracking-widest mb-2">Views</p>
        {views.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className={`block py-2 px-3 rounded-md text-sm mb-0.5 border-l-2 ${
              pathname === v.href
                ? "bg-surface-hover text-foreground font-medium border-accent"
                : "text-muted border-transparent hover:bg-surface-hover"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <div className="mb-5">
        <p className="text-[10px] uppercase text-muted tracking-widest mb-2">Platform</p>
        {platforms.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="block py-2 px-3 rounded-md text-sm text-muted border-l-2 border-transparent hover:bg-surface-hover mb-0.5"
          >
            {p.label}
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <p className="text-[10px] uppercase text-muted tracking-widest mb-2">Settings</p>
        <Link
          href="/settings"
          className={`block py-2 px-3 rounded-md text-sm border-l-2 ${
            pathname === "/settings"
              ? "bg-surface-hover text-foreground font-medium border-accent"
              : "text-muted border-transparent hover:bg-surface-hover"
          }`}
        >
          API Keys
        </Link>
      </div>
    </aside>
  );
}
