import { streamText, generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getVoiceFramework } from "./voice";
import { getConfig } from "./config";
import { Platform } from "./types";

function getModel() {
  const config = getConfig();
  const { provider, model } = config.llm;

  switch (provider) {
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      return anthropic(model);
    }
    case "openai": {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      return openai(model);
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
      return google(model);
    }
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

function buildSystemPrompt(platform: Platform): string {
  const { styleGuide, examples, corrections } = getVoiceFramework();
  const config = getConfig();

  const recentCorrections = corrections.slice(0, 20);
  const correctionBlock =
    recentCorrections.length > 0
      ? `\n\n## Recent Voice Corrections\n\nThese are recent feedback entries from ${config.name} about draft quality. Use them to calibrate your output:\n\n${recentCorrections
          .map(
            (c) =>
              `- [${c.sentiment === "positive" ? "Good" : "Fix"}] ${c.note} (${c.article}, ${c.platform})`
          )
          .join("\n")}`
      : "";

  return `You are a writing assistant for ${config.name}. Your job is to draft content in ${config.name}'s authentic voice.

${styleGuide}
${correctionBlock}

## Reference Examples

${examples}

Target platform: ${platform === "both" ? "LinkedIn and Substack" : platform}
`;
}

export async function generateDraft(
  input: string,
  mode: "brief" | "transcription",
  platform: Platform,
  currentDraft?: string,
  revisionNotes?: string
): Promise<ReadableStream> {
  let userMessage: string;
  if (revisionNotes && currentDraft) {
    userMessage = `Here is the current draft:\n\n${currentDraft}\n\nRevision request: ${revisionNotes}`;
  } else if (mode === "brief") {
    userMessage = `Here's an idea for a ${platform} piece. Write a full draft in my voice:\n\n${input}`;
  } else {
    userMessage = `Here's a raw brain-dump transcription. Structure this into a polished piece in my voice for ${platform}:\n\n${input}`;
  }

  const result = streamText({
    model: getModel(),
    maxOutputTokens: 4096,
    system: buildSystemPrompt(platform),
    messages: [{ role: "user", content: userMessage }],
  });

  return result.textStream.pipeThrough(new TextEncoderStream());
}

export async function voiceCheck(draft: string): Promise<string> {
  const { styleGuide } = getVoiceFramework();
  const config = getConfig();

  const result = await generateText({
    model: getModel(),
    maxOutputTokens: 1024,
    system: `You are a voice consistency checker. Given ${config.name}'s voice framework and a draft, identify specific issues where the draft deviates from their voice. Be precise: cite line numbers, quote the problematic text, and explain why it doesn't sound like ${config.name}. If the draft sounds good, say so briefly.

${styleGuide}`,
    messages: [
      {
        role: "user",
        content: `Check this draft against ${config.name}'s voice rules:\n\n${draft}`,
      },
    ],
  });

  return result.text;
}

export async function generateImagePrompt(
  articleContent: string,
  title: string
): Promise<string> {
  const config = getConfig();

  const result = await generateText({
    model: getModel(),
    maxOutputTokens: 512,
    system: `You generate editorial image prompts for articles. Every prompt you create MUST follow this house style:

${config.imageStyle}

The prompt should work with AI image generators like DALL-E, Midjourney, or Nano Banana.

Return ONLY the image prompt text, nothing else.`,
    messages: [
      {
        role: "user",
        content: `Generate an editorial image prompt for this article:\n\nTitle: ${title}\n\n${articleContent}`,
      },
    ],
  });

  return result.text;
}
