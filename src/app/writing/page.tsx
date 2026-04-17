import Link from "next/link";
import { listArticles } from "@/lib/content";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

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
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-serif text-2xl text-foreground">All Writing</h1>
        <span className="text-sm text-muted">{articles.length} pieces</span>
      </div>

      <StaggerGroup className="space-y-2">
        {articles.map((article) => (
          <StaggerItem key={article.slug}>
            <Link
              href={`/write/${article.slug}`}
              className="flex items-center justify-between bg-surface border border-border rounded-lg p-4 transition-all duration-150 hover:border-border-hover hover:-translate-y-px"
              style={{ boxShadow: "var(--shadow-card)" }}
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
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[article.frontmatter.status] || ""}`}
              >
                {article.frontmatter.status}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {articles.length === 0 && (
        <p className="text-sm text-muted text-center py-12">
          No writing yet. Click &quot;+ New Piece&quot; to start.
        </p>
      )}
    </div>
  );
}
