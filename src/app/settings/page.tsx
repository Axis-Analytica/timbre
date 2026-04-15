export default function SettingsPage() {
  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold text-foreground mb-1">Settings</h1>
      <p className="text-xs text-muted mb-6">API keys are stored in .env.local at the project root.</p>

      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Claude API</h3>
          <p className="text-xs text-muted mb-3">
            Required for writing generation, voice checking, and image prompts.
          </p>
          <div className="bg-surface-hover rounded-md p-3">
            <code className="text-xs text-foreground">ANTHROPIC_API_KEY=sk-ant-...</code>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Get your key at{" "}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener"
              className="text-accent"
            >
              console.anthropic.com
            </a>
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Image Generation (optional)</h3>
          <p className="text-xs text-muted mb-3">
            For direct API image generation. Not needed if you copy prompts to external tools.
          </p>
          <div className="bg-surface-hover rounded-md p-3 space-y-1">
            <code className="text-xs text-foreground block">IMAGE_API_PROVIDER=openai</code>
            <code className="text-xs text-foreground block">IMAGE_API_KEY=sk-...</code>
          </div>
        </div>

        <div className="bg-surface-hover border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">How to update</h3>
          <ol className="text-xs text-muted space-y-1.5 list-decimal list-inside">
            <li>Open <code className="text-foreground">.env.local</code> in the project root</li>
            <li>Add or update the key values</li>
            <li>Restart the dev server (<code className="text-foreground">npm run dev</code>)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
