"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConfig } from "@/components/ConfigProvider";
import Icon from "@/components/Icon";
import { motion } from "motion/react";

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

const navItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

const navContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const config = useConfig();

  if (collapsed) {
    return (
      <aside className="w-14 bg-surface border-r border-border flex flex-col items-center py-4 gap-4 shrink-0">
        <Link
          href="/"
          style={{ boxShadow: "var(--shadow-accent-soft)", borderRadius: 8 }}
        >
          <Icon size={32} />
        </Link>
        <div className="w-px h-4 bg-border" />
        {views.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-colors duration-150 ${
              pathname === v.href
                ? "border border-accent text-accent bg-surface-warm"
                : "border border-border text-muted hover:bg-surface-hover"
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
      <div className="flex items-center gap-2.5 mb-1">
        <Icon size={32} />
        <span className="text-xl text-foreground font-serif">Timbre</span>
      </div>
      <p className="text-[11px] text-muted mb-4 pl-[42px]" style={{ letterSpacing: "0.02em" }}>
        by {config.brand}
      </p>

      {/* Decorative editorial rule */}
      <div className="w-8 h-0.5 bg-accent mb-5 rounded-full" />

      <Link
        href="/write/new"
        className="block text-center py-2.5 bg-accent rounded-lg text-accent-foreground text-sm font-medium mb-5 transition-all duration-150 hover:-translate-y-px"
        style={{ boxShadow: "var(--shadow-card)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-accent-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-card)";
        }}
      >
        + New Piece
      </Link>

      <motion.div
        variants={navContainerVariants}
        initial="hidden"
        animate="show"
      >
        <p className="text-[10px] uppercase text-border-hover tracking-widest mb-2 font-medium">
          Views
        </p>
        {views.map((v) => (
          <motion.div key={v.href} variants={navItemVariants}>
            <Link
              href={v.href}
              className={`block py-3 px-3 rounded-md text-sm mb-0.5 border-l-2 transition-all duration-150 ${
                pathname === v.href
                  ? "bg-surface-warm text-foreground font-medium border-accent"
                  : "text-muted border-transparent hover:bg-surface-hover"
              }`}
            >
              {v.label}
            </Link>
          </motion.div>
        ))}

        <p className="text-[10px] uppercase text-border-hover tracking-widest mb-2 mt-5 font-medium">
          Platform
        </p>
        {platforms.map((p) => (
          <motion.div key={p.href} variants={navItemVariants}>
            <Link
              href={p.href}
              className="block py-3 px-3 rounded-md text-sm text-muted border-l-2 border-transparent hover:bg-surface-hover mb-0.5 transition-all duration-150"
            >
              {p.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-auto">
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-[10px] uppercase text-border-hover tracking-widest mb-2 font-medium">
            Settings
          </p>
          <Link
            href="/settings"
            className={`block py-3 px-3 rounded-md text-sm border-l-2 transition-all duration-150 ${
              pathname === "/settings"
                ? "bg-surface-warm text-foreground font-medium border-accent"
                : "text-muted border-transparent hover:bg-surface-hover"
            }`}
          >
            API Keys
          </Link>
        </div>
      </div>
    </aside>
  );
}
