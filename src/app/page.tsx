import { listArticles } from "@/lib/content";
import PipelineBoard from "@/components/PipelineBoard";
import { configExists } from "@/lib/config";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PipelinePage() {
  if (!configExists()) redirect("/setup");

  const articles = listArticles();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-serif text-2xl text-foreground">Pipeline</h1>
      </div>
      <PipelineBoard initialArticles={articles} />
    </div>
  );
}
