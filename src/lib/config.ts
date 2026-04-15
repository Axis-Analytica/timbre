import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "timbre.config.json");

export interface TimbreConfig {
  name: string;
  bio: string;
  brand: string;
  url: string;
  theme: {
    background: string;
    foreground: string;
    surface: string;
    surfaceHover: string;
    border: string;
    borderHover: string;
    muted: string;
    accent: string;
    accentHover: string;
    accentForeground: string;
    success: string;
    warning: string;
    draft: string;
    idea: string;
  };
  imageStyle: string;
  llm: {
    provider: string;
    model: string;
  };
  imageProvider: string;
}

let cachedConfig: TimbreConfig | null = null;

export function getConfig(): TimbreConfig {
  if (cachedConfig) return cachedConfig;
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error("timbre.config.json not found. Run setup first.");
  }
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  cachedConfig = JSON.parse(raw);
  return cachedConfig!;
}

export function saveConfig(config: TimbreConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  cachedConfig = config;
}

export function configExists(): boolean {
  return fs.existsSync(CONFIG_PATH);
}
