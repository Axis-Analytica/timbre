import { getConfig } from "../config";

export interface ImageGenerateResult {
  url: string;
}

export interface ImageProvider {
  generate(prompt: string): Promise<ImageGenerateResult>;
}

export function getImageProvider(): ImageProvider {
  const config = getConfig();

  switch (config.imageProvider) {
    case "openai":
      return new OpenAIImageProvider();
    case "replicate":
      return new ReplicateImageProvider();
    case "none":
      throw new Error("No image provider configured. Copy the prompt and use your preferred tool.");
    default:
      throw new Error(`Unsupported image provider: ${config.imageProvider}`);
  }
}

class OpenAIImageProvider implements ImageProvider {
  async generate(prompt: string): Promise<ImageGenerateResult> {
    const OpenAI = (await import("openai")).default;
    const apiKey = process.env.IMAGE_API_KEY;
    if (!apiKey) throw new Error("IMAGE_API_KEY not set. Add it to .env.local");

    const openai = new OpenAI({ apiKey });
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error("No image returned from OpenAI");
    return { url };
  }
}

class ReplicateImageProvider implements ImageProvider {
  async generate(prompt: string): Promise<ImageGenerateResult> {
    const apiKey = process.env.IMAGE_API_KEY;
    if (!apiKey) throw new Error("IMAGE_API_KEY not set. Add it to .env.local");

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "black-forest-labs/flux-1.1-pro",
        input: { prompt, aspect_ratio: "1:1" },
      }),
    });

    const prediction = await response.json();

    // Poll for completion
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });
      result = await pollRes.json();
    }

    if (result.status === "failed") throw new Error("Image generation failed on Replicate");

    const url = Array.isArray(result.output) ? result.output[0] : result.output;
    if (!url) throw new Error("No image returned from Replicate");
    return { url };
  }
}
