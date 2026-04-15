export type ArticleStatus = "idea" | "draft" | "review" | "published";
export type Platform = "linkedin" | "substack" | "both";

export interface ArticleFrontmatter {
  title: string;
  status: ArticleStatus;
  platform: Platform;
  created: string;
  updated: string;
  version: number;
  image?: string;
  tags: string[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export interface Correction {
  date: string;
  sentiment: "positive" | "negative";
  note: string;
  article: string;
  platform: Platform;
}

export interface VoiceFramework {
  styleGuide: string;
  examples: string;
  corrections: Correction[];
}
