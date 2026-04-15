import { listArticles } from "@/lib/content";
import PipelineBoard from "@/components/PipelineBoard";
import { configExists } from "@/lib/config";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PipelinePage() {
  if (!configExists()) redirect("/setup");

  const articles = listArticles();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-foreground">Pipeline</h1>
      </div>
      <PipelineBoard initialArticles={articles} />
    </div>
  );
}
