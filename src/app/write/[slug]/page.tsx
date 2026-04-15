import { getArticle } from "@/lib/content";
import { notFound } from "next/navigation";
import WorkspaceClient from "./WorkspaceClient";

export const dynamic = "force-dynamic";

export default async function WritePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return <WorkspaceClient article={article} />;
}
