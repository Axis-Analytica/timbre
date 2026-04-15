# Timbre

A voice-driven writing tool that learns how you write. Draft LinkedIn posts and Substack articles in your authentic voice, manage a writing pipeline, and generate editorial images — all powered by AI that gets better with your feedback.

Built by [Axis Analytica](https://axis-analytica.com).

## How it works

1. **Define your voice** — Describe your writing style, tone, and anti-patterns during setup
2. **Write with AI** — Enter an idea or paste a brain-dump, and Timbre generates drafts in your voice
3. **Refine over time** — Flag what sounds right and what doesn't. Your voice framework sharpens with every piece
4. **Publish anywhere** — Preview for LinkedIn or Substack, copy with one click

## Features

- **Writing pipeline** — Kanban board tracking pieces from Idea to Published
- **Three input modes** — Brief (quick idea), Transcription (brain-dump), or direct Edit
- **Voice feedback loop** — "Sounds like me" / "Not quite" corrections accumulate and improve generation
- **Platform previews** — See how your piece looks on LinkedIn vs Substack before copying
- **Editorial image generation** — AI-crafted image prompts in your brand style, with DALL-E integration
- **Multi-provider AI** — Works with Claude, GPT-4, or Gemini via the Vercel AI SDK
- **File-based storage** — Everything is markdown and JSON. No database. Works with Claude Code remotely
- **Configurable themes** — Warm, Cool, or Neutral colour presets, or set your own brand colours

## Getting started

```bash
git clone https://github.com/Axis-Analytica/timbre.git
cd timbre
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the setup wizard will walk you through configuring your voice, AI provider, and theme.

### API keys

You'll need at least one LLM API key. Add them to `.env.local`:

```
# Pick your LLM provider
ANTHROPIC_API_KEY=sk-ant-...     # For Claude
OPENAI_API_KEY=sk-...            # For GPT-4
GOOGLE_API_KEY=...               # For Gemini

# Optional — for image generation
IMAGE_API_KEY=sk-...
IMAGE_API_PROVIDER=openai
```

## Project structure

```
timbre/
├── content/          # Your articles (markdown + YAML frontmatter)
├── voice/
│   ├── style-guide.md      # Your voice framework (editable)
│   ├── examples.md          # Approved writing samples
│   └── corrections.json     # Accumulated voice feedback
├── images/           # Generated image prompts and saved images
├── src/
│   ├── app/          # Next.js App Router pages and API routes
│   ├── components/   # React components
│   └── lib/          # Data layer, AI client, config
└── timbre.config.json  # Your personal config (created during setup)
```

## Views

| View | Path | Purpose |
|------|------|---------|
| Pipeline | `/` | Kanban board — drag pieces between Idea, Draft, Review, Published |
| All Writing | `/writing` | Searchable list, filterable by platform |
| Writing Workspace | `/write/[slug]` | Editor with AI generation, platform preview, voice feedback |
| Voice Guide | `/voice` | Edit your voice framework, view correction history |
| Image Studio | `/images` | Generate editorial image prompts, preview and save |
| Settings | `/settings` | API key reference |

## Tech stack

- Next.js 16 (App Router)
- React 19, TypeScript, Tailwind CSS 4
- Vercel AI SDK (multi-provider: Anthropic, OpenAI, Google)
- OpenAI SDK (DALL-E image generation)
- gray-matter (frontmatter parsing)
- File-based storage (markdown + JSON)

## License

MIT
