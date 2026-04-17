"use client";

import { useState } from "react";
import { motion } from "motion/react";

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

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
      <motion.div
        className="grid grid-cols-2 gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {images.map((img) => (
          <motion.button
            key={img}
            variants={imageVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelect(img)}
            className={`aspect-square rounded-lg border-2 overflow-hidden transition-colors duration-150 ${
              selected === img ? "border-accent" : "border-border"
            }`}
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </motion.button>
        ))}
        <div
          className="aspect-square rounded-lg border border-dashed flex items-center justify-center text-lg text-border-hover"
          style={{ animation: "breathing 3s ease-in-out infinite" }}
        >
          +
        </div>
      </motion.div>
      {images.length === 0 && (
        <p className="text-xs text-muted text-center mt-2">
          No images yet. Generate a prompt and use your preferred tool.
        </p>
      )}
    </div>
  );
}
