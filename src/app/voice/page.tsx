import { getStyleGuide, getCorrections } from "@/lib/voice";
import StyleGuideEditor from "@/components/StyleGuideEditor";
import CorrectionLog from "@/components/CorrectionLog";

export const dynamic = "force-dynamic";

export default function VoicePage() {
  const styleGuide = getStyleGuide();
  const corrections = getCorrections();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <StyleGuideEditor initialContent={styleGuide} />
        </div>
        <div className="w-72 shrink-0">
          <CorrectionLog corrections={corrections} />
        </div>
      </div>
    </div>
  );
}
