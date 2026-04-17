"use client";

import { useState, useEffect } from "react";
import { Article } from "@/lib/types";
import ImagePromptGenerator from "@/components/ImagePromptGenerator";
import ImageGallery from "@/components/ImageGallery";

export default function ImagesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryKey, setGalleryKey] = useState(0);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then(setArticles);
  }, []);

  useEffect(() => {
    if (!selectedSlug) {
      setGalleryImages([]);
      return;
    }
    fetch(`/api/article-images/${selectedSlug}`)
      .then((res) => res.json())
      .then((data) => setGalleryImages(data.images || []))
      .catch(() => setGalleryImages([]));
  }, [selectedSlug, galleryKey]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <ImagePromptGenerator
            articles={articles}
            onSlugChange={setSelectedSlug}
            onImageGenerated={() => setGalleryKey((k) => k + 1)}
          />
        </div>
        <div className="w-72 shrink-0">
          {selectedSlug ? (
            <ImageGallery images={galleryImages} />
          ) : (
            <>
              <h3 className="text-sm font-semibold text-foreground mb-3">Generated images</h3>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="aspect-square rounded-lg border border-dashed flex items-center justify-center text-lg text-border-hover"
                  style={{ animation: "breathing 3s ease-in-out infinite" }}
                >
                  +
                </div>
              </div>
              <p className="text-xs text-muted text-center mt-3">
                Select an article and generate a prompt, then use your preferred image tool.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
