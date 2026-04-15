import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "images");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getImageDir(articleSlug: string): string {
  const dir = path.join(IMAGES_DIR, articleSlug);
  ensureDir(dir);
  return dir;
}

export function getPrompt(articleSlug: string): string | null {
  const promptPath = path.join(getImageDir(articleSlug), "prompt.md");
  if (!fs.existsSync(promptPath)) return null;
  return fs.readFileSync(promptPath, "utf-8");
}

export function savePrompt(articleSlug: string, prompt: string): void {
  const dir = getImageDir(articleSlug);
  fs.writeFileSync(path.join(dir, "prompt.md"), prompt, "utf-8");
}

export function listImages(articleSlug: string): string[] {
  const dir = getImageDir(articleSlug);
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((f) => `/images/${articleSlug}/${f}`);
}
