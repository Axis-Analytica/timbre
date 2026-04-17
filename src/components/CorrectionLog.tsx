import { Correction } from "@/lib/types";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export default function CorrectionLog({ corrections }: { corrections: Correction[] }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground mb-1">Correction Log</h2>
      <p className="text-xs text-muted mb-4">Feedback that sharpens the voice over time</p>

      <StaggerGroup className="space-y-2">
        {corrections.map((c, i) => (
          <StaggerItem key={i}>
            <div
              className="bg-surface border border-border rounded-lg p-3.5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex justify-between mb-1.5">
                <span
                  className={`text-xs font-medium ${
                    c.sentiment === "positive" ? "text-success" : "text-draft"
                  }`}
                >
                  {c.sentiment === "positive" ? "Sounds like me" : "Not quite"}
                </span>
                <span className="text-[10px] text-muted">{c.date}</span>
              </div>
              <p className="text-[13px] text-foreground leading-relaxed mb-1.5">
                &ldquo;{c.note}&rdquo;
              </p>
              <p className="text-[11px] text-muted">
                {c.article} · {c.platform}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {corrections.length === 0 && (
        <p className="text-sm text-muted text-center py-8">
          No corrections yet. Use &ldquo;Sounds like me&rdquo; / &ldquo;Not quite&rdquo; in the
          writing workspace.
        </p>
      )}

      <div className="mt-4 p-3 border border-dashed border-border rounded-lg text-center">
        <p className="text-xs text-muted">
          Corrections are automatically used when generating new drafts
        </p>
      </div>
    </div>
  );
}
