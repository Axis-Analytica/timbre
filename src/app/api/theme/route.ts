import { NextResponse } from "next/server";
import { getConfig, configExists } from "@/lib/config";

export async function GET() {
  if (!configExists()) {
    return new NextResponse("", { headers: { "Content-Type": "text/css" } });
  }

  const { theme } = getConfig();

  const css = `:root {
  --color-background: ${theme.background};
  --color-foreground: ${theme.foreground};
  --color-surface: ${theme.surface};
  --color-surface-hover: ${theme.surfaceHover};
  --color-border: ${theme.border};
  --color-border-hover: ${theme.borderHover};
  --color-muted: ${theme.muted};
  --color-accent: ${theme.accent};
  --color-accent-hover: ${theme.accentHover};
  --color-accent-foreground: ${theme.accentForeground};
  --color-success: ${theme.success};
  --color-warning: ${theme.warning};
  --color-draft: ${theme.draft};
  --color-idea: ${theme.idea};
}`;

  return new NextResponse(css, {
    headers: { "Content-Type": "text/css" },
  });
}
