import fs from "fs";
import path from "path";
import { Correction, VoiceFramework } from "./types";

const VOICE_DIR = path.join(process.cwd(), "voice");

function ensureDir() {
  if (!fs.existsSync(VOICE_DIR)) {
    fs.mkdirSync(VOICE_DIR, { recursive: true });
  }
}

function readFile(filename: string): string {
  const filePath = path.join(VOICE_DIR, filename);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

function writeFile(filename: string, content: string): void {
  ensureDir();
  fs.writeFileSync(path.join(VOICE_DIR, filename), content, "utf-8");
}

export function getStyleGuide(): string {
  return readFile("style-guide.md");
}

export function saveStyleGuide(content: string): void {
  writeFile("style-guide.md", content);
}

export function getExamples(): string {
  return readFile("examples.md");
}

export function getCorrections(): Correction[] {
  const raw = readFile("corrections.json");
  if (!raw) return [];
  return JSON.parse(raw);
}

export function addCorrection(correction: Correction): void {
  const corrections = getCorrections();
  corrections.unshift(correction);
  writeFile("corrections.json", JSON.stringify(corrections, null, 2));
}

export function getVoiceFramework(): VoiceFramework {
  return {
    styleGuide: getStyleGuide(),
    examples: getExamples(),
    corrections: getCorrections(),
  };
}
