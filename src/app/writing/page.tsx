import Link from "next/link";
import { listArticles } from "@/lib/content";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  idea: "bg-idea/10 text-idea",
  draft: "bg-draft/10 text-draft",
  review: "bg-warning/10 text-warning",
  published: "bg-success/10 text-success",
};

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; q?: string }>;
}) {
  const { platform, q } = await searchParams;
  let articles = listArticles();

  if (platform) {
    articles = articles.filter(
      (a) => a.frontmatter.platform === platform || a.frontmatter.platform === "both"
    );
  }
  if (q) {
    const query = q.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.frontmatter.title.toLowerCase().includes(query) ||
        a.frontmatter.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-foreground">All Writing</h1>
        <span className="text-sm text-muted">{articles.length} pieces</span>
      </div>

      <div className="space-y-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/write/${article.slug}`}
            className="flex items-center justify-between bg-surface border border-border rounded-lg p-4 hover:border-border-hover transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {article.frontmatter.title}
              </p>
              <p className="text-xs text-muted mt-1">
                {article.frontmatter.platform} · {article.frontmatter.updated}
                {article.frontmatter.tags.length > 0 &&
                  ` · ${article.frontmatter.tags.join(", ")}`}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${statusBadge[article.frontmatter.status] || ""}`}
            >
              {article.frontmatter.status}
            </span>
          </Link>
        ))}

        {articles.length === 0 && (
          <p className="text-sm text-muted text-center py-12">
            No writing yet. Click &quot;+ New Piece&quot; to start.
          </p>
        )}
      </div>
    </div>
  );
}
