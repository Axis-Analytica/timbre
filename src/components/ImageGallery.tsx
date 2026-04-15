"use client";

import { useState } from "react";

export default function ImageGallery({
  images,
  selectedImage,
  onSelect,
}: {
  images: string[];
  selectedImage?: string;
  onSelect?: (path: string) => void;
}) {
  const [selected, setSelected] = useState(selectedImage || "");

  function handleSelect(img: string) {
    setSelected(img);
    onSelect?.(img);
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Generated images</h3>
      <div className="grid grid-cols-2 gap-2">
        {images.map((img) => (
          <button
            key={img}
            onClick={() => handleSelect(img)}
            className={`aspect-square rounded-lg border-2 overflow-hidden ${
              selected === img ? "border-accent" : "border-border"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
        <div className="aspect-square rounded-lg border border-dashed border-border flex items-center justify-center text-lg text-border-hover">
          +
        </div>
      </div>
      {images.length === 0 && (
        <p className="text-xs text-muted text-center mt-2">
          No images yet. Generate a prompt and use your preferred tool.
        </p>
      )}
    </div>
  );
}
