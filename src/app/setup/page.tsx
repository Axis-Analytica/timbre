"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@/components/Icon";

// ---------------------------------------------------------------------------
// Theme presets
// ---------------------------------------------------------------------------

const themePresets = {
  warm: {
    background: "#f5f5f4",
    foreground: "#0a0a0f",
    surface: "#ffffff",
    surfaceHover: "#fafaf9",
    border: "#e5e5e5",
    borderHover: "#d4d4d4",
    muted: "#737373",
    accent: "#f97316",
    accentHover: "#ea580c",
    accentForeground: "#ffffff",
    success: "#16a34a",
    warning: "#b45309",
    draft: "#ea580c",
    idea: "#f97316",
  },
  cool: {
    background: "#f0f4f8",
    foreground: "#1a2332",
    surface: "#ffffff",
    surfaceHover: "#f7f9fb",
    border: "#d9e2ec",
    borderHover: "#bcccdc",
    muted: "#627d98",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentForeground: "#ffffff",
    success: "#16a34a",
    warning: "#b45309",
    draft: "#2563eb",
    idea: "#3b82f6",
  },
  neutral: {
    background: "#ffffff",
    foreground: "#171717",
    surface: "#fafafa",
    surfaceHover: "#f5f5f5",
    border: "#e5e5e5",
    borderHover: "#d4d4d4",
    muted: "#737373",
    accent: "#171717",
    accentHover: "#404040",
    accentForeground: "#ffffff",
    success: "#16a34a",
    warning: "#b45309",
    draft: "#525252",
    idea: "#737373",
  },
} as const;

type ThemeKey = keyof typeof themePresets;

// ---------------------------------------------------------------------------
// Provider model defaults
// ---------------------------------------------------------------------------

const providerDefaults: Record<string, string> = {
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4o",
  google: "gemini-2.0-flash",
};

const DEFAULT_IMAGE_STYLE =
  "Editorial illustration style. Clean, thoughtful composition that captures the essence of the article conceptually rather than literally. Muted, professional colour palette. Avoid stock photo aesthetics, overly saturated colours, and generic AI art style. The image should feel like it belongs in a quality magazine or journal.";

const TOTAL_STEPS = 5;

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

interface FormState {
  name: string;
  bio: string;
  brand: string;
  voiceDescription: string;
  platforms: string[];
  llmProvider: string;
  llmModel: string;
  imageProvider: string;
  theme: ThemeKey;
  imageStyle: string;
}

const initialForm: FormState = {
  name: "",
  bio: "",
  brand: "Timbre",
  voiceDescription: "",
  platforms: [],
  llmProvider: "anthropic",
  llmModel: providerDefaults.anthropic,
  imageProvider: "openai",
  theme: "warm",
  imageStyle: DEFAULT_IMAGE_STYLE,
};

// ---------------------------------------------------------------------------
// Small reusable UI pieces
// ---------------------------------------------------------------------------

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1.5"
      style={{ color: "#0a0a0f" }}
    >
      {children}
    </label>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-sm" style={{ color: "#737373" }}>
      {children}
    </p>
  );
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        color: "#0a0a0f",
      }}
      {...focusGlow}
    />
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-150 resize-none"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        color: "#0a0a0f",
        lineHeight: "1.6",
      }}
      {...focusGlow}
    />
  );
}

function Select({
  id,
  value,
  onChange,
  children,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-150 appearance-none cursor-pointer"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        color: "#0a0a0f",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "36px",
      }}
      {...focusGlow}
    >
      {children}
    </select>
  );
}

const focusGlow = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#f97316";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.08)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#e5e5e5";
    e.currentTarget.style.boxShadow = "none";
  },
};

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

function StepProfile({
  form,
  update,
}: {
  form: FormState;
  update: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(v) => update("name", v)}
          placeholder="e.g. Alex Chen"
        />
      </div>
      <div>
        <Label htmlFor="bio">Short bio</Label>
        <Input
          id="bio"
          value={form.bio}
          onChange={(v) => update("bio", v)}
          placeholder="e.g. Founder, Axis Analytica"
        />
        <HelperText>One line about who you are and what you do.</HelperText>
      </div>
      <div>
        <Label htmlFor="brand">Brand name</Label>
        <Input
          id="brand"
          value={form.brand}
          onChange={(v) => update("brand", v)}
          placeholder="Timbre"
        />
        <HelperText>This appears in the app header. Defaults to "Timbre".</HelperText>
      </div>
    </div>
  );
}

function StepVoice({
  form,
  update,
}: {
  form: FormState;
  update: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="voice">Your writing voice</Label>
        <Textarea
          id="voice"
          value={form.voiceDescription}
          onChange={(v) => update("voiceDescription", v)}
          placeholder="I write for operators and executives who don't have time to waste. I use short paragraphs, concrete examples, and I avoid jargon unless it's the right word for the job. I tend to open with the conclusion — readers can stop early if they got what they needed. I never write 'In conclusion' or 'In today's fast-paced world'..."
          rows={10}
        />
        <HelperText>
          Think about your tone, your audience, how you start pieces, what you avoid. The more
          specific, the better. This becomes your voice framework — you can always refine it later.
        </HelperText>
      </div>
    </div>
  );
}

const PLATFORM_OPTIONS = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "substack", label: "Substack" },
  { id: "blog", label: "Blog" },
  { id: "other", label: "Other" },
];

function StepPlatforms({
  form,
  togglePlatform,
}: {
  form: FormState;
  togglePlatform: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: "#737373" }}>
        Which platforms do you write for? Select all that apply.
      </p>
      <div className="space-y-2.5">
        {PLATFORM_OPTIONS.map((p) => {
          const checked = form.platforms.includes(p.id);
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => togglePlatform(p.id)}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-colors"
              style={{
                background: checked ? "#fff7ed" : "#ffffff",
                border: `1px solid ${checked ? "#f97316" : "#e5e5e5"}`,
                color: "#0a0a0f",
              }}
            >
              <span
                className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                style={{
                  background: checked ? "#f97316" : "#ffffff",
                  border: `1.5px solid ${checked ? "#f97316" : "#d4d4d4"}`,
                }}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="font-medium">{p.label}</span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs pt-1" style={{ color: "#a3a3a3" }}>
        This is informational for now — it will help tailor suggestions in a future update.
      </p>
    </div>
  );
}

function StepAI({
  form,
  update,
}: {
  form: FormState;
  update: (k: keyof FormState, v: string) => void;
}) {
  function handleProviderChange(provider: string) {
    update("llmProvider", provider);
    update("llmModel", providerDefaults[provider] ?? "");
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="llmProvider">LLM provider</Label>
        <Select id="llmProvider" value={form.llmProvider} onChange={handleProviderChange}>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="openai">OpenAI (GPT)</option>
          <option value="google">Google (Gemini)</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="llmModel">Model</Label>
        <Input
          id="llmModel"
          value={form.llmModel}
          onChange={(v) => update("llmModel", v)}
          placeholder="Model name"
        />
        <HelperText>You can change this any time in Settings.</HelperText>
      </div>
      <div>
        <Label htmlFor="imageProvider">Image provider</Label>
        <Select
          id="imageProvider"
          value={form.imageProvider}
          onChange={(v) => update("imageProvider", v)}
        >
          <option value="openai">OpenAI (DALL-E)</option>
          <option value="none">None (copy prompts only)</option>
        </Select>
      </div>
      <div
        className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg text-sm"
        style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
      >
        <svg
          className="flex-shrink-0 mt-0.5"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <circle cx="7.5" cy="7.5" r="7" stroke="#f97316" strokeWidth="1.2" />
          <path
            d="M7.5 4.5v3.5M7.5 10.5v.5"
            stroke="#f97316"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <p style={{ color: "#9a3412" }}>
          Add your API keys to <code className="font-mono text-xs">.env.local</code> after setup
          completes.
        </p>
      </div>
    </div>
  );
}

const themeLabels: Record<ThemeKey, { name: string; description: string }> = {
  warm: { name: "Warm", description: "Eggshell background, slate text, orange accent" },
  cool: { name: "Cool", description: "Blue-grey background, navy text, blue accent" },
  neutral: { name: "Neutral", description: "White background, dark grey text, black accent" },
};

function ThemeSwatch({ themeKey }: { themeKey: ThemeKey }) {
  const t = themePresets[themeKey];
  return (
    <div
      className="w-full h-16 rounded-md overflow-hidden flex"
      style={{ background: t.background, border: `1px solid ${t.border}` }}
    >
      <div className="flex-1 p-2.5 flex flex-col justify-between">
        <div className="h-1.5 w-3/4 rounded-full" style={{ background: t.foreground, opacity: 0.7 }} />
        <div className="h-1 w-1/2 rounded-full" style={{ background: t.muted, opacity: 0.5 }} />
      </div>
      <div className="flex flex-col gap-1 p-2.5 justify-center">
        <div
          className="h-5 w-12 rounded text-center text-xs flex items-center justify-center font-medium"
          style={{ background: t.accent, color: t.accentForeground, fontSize: "9px" }}
        >
          Button
        </div>
      </div>
    </div>
  );
}

function StepStyle({
  form,
  update,
}: {
  form: FormState;
  update: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Colour scheme</Label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {(Object.keys(themePresets) as ThemeKey[]).map((key) => {
            const selected = form.theme === key;
            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => update("theme", key)}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col gap-2 p-2.5 rounded-xl text-left transition-all hover:-translate-y-px"
                style={{
                  border: `2px solid ${selected ? "#f97316" : "#e5e5e5"}`,
                  background: selected ? "#fff7ed" : "#ffffff",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <ThemeSwatch themeKey={key} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0a0a0f" }}>
                    {themeLabels[key].name}
                  </p>
                  <p className="text-xs leading-tight" style={{ color: "#737373" }}>
                    {themeLabels[key].description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      <div>
        <Label htmlFor="imageStyle">Default image style</Label>
        <Textarea
          id="imageStyle"
          value={form.imageStyle}
          onChange={(v) => update("imageStyle", v)}
          rows={5}
        />
        <HelperText>
          This prompt is appended to every image generation request to keep visuals consistent.
        </HelperText>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress indicator
// ---------------------------------------------------------------------------

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === current - 1 ? 20 : 6,
            height: 6,
            backgroundColor: i < current ? "#f97316" : "#e5e5e5",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step transition variants
// ---------------------------------------------------------------------------

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Step metadata
// ---------------------------------------------------------------------------

const STEPS = [
  { title: "Welcome to Timbre", subtitle: "Let's start with a bit about you." },
  { title: "Your writing voice", subtitle: "This is the heart of Timbre." },
  { title: "Where you publish", subtitle: "Tell us about your platforms." },
  { title: "AI configuration", subtitle: "Connect your preferred AI provider." },
  { title: "Look and feel", subtitle: "Make Timbre yours." },
];

// ---------------------------------------------------------------------------
// Main wizard
// ---------------------------------------------------------------------------

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePlatform(id: string) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }));
  }

  function canAdvance(): boolean {
    if (step === 1) return form.name.trim().length > 0;
    if (step === 2) return form.voiceDescription.trim().length > 0;
    return true;
  }

  async function handleLaunch() {
    setSubmitting(true);
    setError(null);

    const selectedTheme = themePresets[form.theme];

    const config = {
      name: form.name.trim(),
      bio: form.bio.trim(),
      brand: form.brand.trim() || "Timbre",
      url: "",
      theme: selectedTheme,
      imageStyle: form.imageStyle.trim(),
      llm: {
        provider: form.llmProvider,
        model: form.llmModel.trim(),
      },
      imageProvider: form.imageProvider,
      platforms: form.platforms,
    };

    try {
      const configRes = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!configRes.ok) throw new Error("Failed to save config");

      const voiceRes = await fetch("/api/setup/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceDescription: form.voiceDescription.trim(),
          name: form.name.trim(),
        }),
      });

      if (!voiceRes.ok) throw new Error("Failed to create voice files");

      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const meta = STEPS[step - 1];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#f5f5f4" }}
    >
      {/* Logo / wordmark */}
      <div className="mb-8 flex items-center gap-2.5">
        <Icon size={32} />
        <span className="text-xl font-serif" style={{ color: "#0a0a0f" }}>
          Timbre
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-xl rounded-2xl px-8 py-8 overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <ProgressDots current={step} total={TOTAL_STEPS} />
            <span className="text-xs tabular-nums" style={{ color: "#a3a3a3" }}>
              {step} of {TOTAL_STEPS}
            </span>
          </div>
          <h1 className="text-xl font-serif mb-1" style={{ color: "#0a0a0f" }}>
            {meta.title}
          </h1>
          <p className="text-sm" style={{ color: "#737373" }}>
            {meta.subtitle}
          </p>
        </div>

        {/* Step content */}
        <div className="mb-8 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" as const }}
            >
              {step === 1 && <StepProfile form={form} update={update} />}
              {step === 2 && <StepVoice form={form} update={update} />}
              {step === 3 && <StepPlatforms form={form} togglePlatform={togglePlatform} />}
              {step === 4 && <StepAI form={form} update={update} />}
              {step === 5 && <StepStyle form={form} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-3.5 py-3 rounded-lg text-sm"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}
          >
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: step === 1 ? "transparent" : "#737373",
              background: "transparent",
              pointerEvents: step === 1 ? "none" : "auto",
            }}
          >
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <motion.button
              type="button"
              onClick={goNext}
              disabled={!canAdvance()}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-px"
              style={{
                background: "#f97316",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (canAdvance()) e.currentTarget.style.background = "#ea580c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f97316";
              }}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleLaunch}
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              className="relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden hover:-translate-y-px"
              style={{
                background: "#f97316",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.currentTarget.style.background = "#ea580c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f97316";
              }}
            >
              {!submitting && (
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.3) 55%, transparent 60%)",
                    transform: "translateX(-100%)",
                    animation: "shimmer 2.5s ease-in-out infinite",
                  }}
                />
              )}
              {submitting ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="5.5"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Setting up...
                </>
              ) : (
                "Launch Timbre"
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-center" style={{ color: "#a3a3a3" }}>
        Everything can be changed in Settings after setup.
      </p>
    </div>
  );
}
