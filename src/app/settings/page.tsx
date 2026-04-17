import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-lg">
      <h1 className="font-serif text-2xl text-foreground mb-1">Settings</h1>
      <p className="text-xs text-muted mb-6">
        API keys are stored in .env.local at the project root.
      </p>

      <StaggerGroup className="space-y-4" delay={0.06}>
        <StaggerItem>
          <div
            className="bg-surface border border-border rounded-lg p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-2">Claude API</h3>
            <p className="text-xs text-muted mb-3">
              Required for writing generation, voice checking, and image prompts.
            </p>
            <div className="bg-surface-hover rounded-md p-3">
              <code className="text-xs text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                ANTHROPIC_API_KEY=sk-ant-...
              </code>
            </div>
            <p className="text-[11px] text-muted mt-2">
              Get your key at{" "}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener"
                className="text-accent relative group"
              >
                <span>console.anthropic.com</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-200" />
              </a>
            </p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div
            className="bg-surface border border-border rounded-lg p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Image Generation (optional)
            </h3>
            <p className="text-xs text-muted mb-3">
              For direct API image generation. Not needed if you copy prompts to external tools.
            </p>
            <div className="bg-surface-hover rounded-md p-3 space-y-1">
              <code className="text-xs text-foreground block" style={{ fontFamily: "'DM Mono', monospace" }}>
                IMAGE_API_PROVIDER=openai
              </code>
              <code className="text-xs text-foreground block" style={{ fontFamily: "'DM Mono', monospace" }}>
                IMAGE_API_KEY=sk-...
              </code>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div
            className="bg-surface-hover border border-border rounded-lg p-4 border-l-2 border-l-accent"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-2">How to update</h3>
            <ol className="text-xs text-muted space-y-1.5 list-decimal list-inside">
              <li>
                Open <code className="text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>.env.local</code> in the
                project root
              </li>
              <li>Add or update the key values</li>
              <li>
                Restart the dev server (
                <code className="text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>npm run dev</code>)
              </li>
            </ol>
          </div>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
