"use client";

import { cn } from "@/lib/utils";
import type { DiceValue } from "@/lib/types";
import { motion } from "framer-motion";

type DiceProps = {
  value: DiceValue | null; // Allow null for empty state
  className?: string;
};

// A single dot on the dice face
const Dot = ({ className }: { className?: string }) => (
  <div className={cn("w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-current", className)} />
);

const DiceFace = ({ value }: { value: DiceValue | null }) => {
  // Common classes for all faces
  const baseClasses = "w-full h-full rounded-lg p-1.5 flex";

  switch (value) {
    case 1:
      // Center dot
      return (
        <div className={cn(baseClasses, "items-center justify-center")}>
          <Dot />
        </div>
      );
    case 2:
      // Diagonal from top-left to bottom-right
      return (
        <div className={cn(baseClasses, "justify-between")}>
          <Dot className="self-start" />
          <Dot className="self-end" />
        </div>
      );
    case 3:
      // Diagonal from top-left to bottom-right
      return (
        <div className={cn(baseClasses, "justify-between")}>
          <Dot className="self-start" />
          <Dot className="self-center" />
          <Dot className="self-end" />
        </div>
      );
    case 4:
      // Two columns, two rows
      return (
        <div className={cn(baseClasses, "flex-col justify-between")}>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
        </div>
      );
    case 5:
      // A 'X' pattern
      return (
        <div className={cn(baseClasses, "flex-col justify-between")}>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
          <div className="flex justify-center">
            <Dot />
          </div>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
        </div>
      );
    case 6:
      // Two columns of three dots
      return (
        <div className={cn(baseClasses, "flex-col justify-between")}>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
          <div className="flex justify-between">
            <Dot />
            <Dot />
          </div>
        </div>
      );
    default:
      // Placeholder for null or undefined value
      return (
        <div
          className={cn(
            baseClasses,
            "items-center justify-center text-4xl font-bold opacity-30 text-muted-foreground"
          )}
        >
          ?
        </div>
      );
  }
};

export default function Dice({ value, className }: DiceProps) {
  return (
    // Added aspect-square to ensure it's always a square
    <motion.div
      className={cn(
        "bg-card text-card-foreground border-2 rounded-xl p-0.5 aspect-square",
        className
      )}
      initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <DiceFace value={value} />
    </motion.div>
  );
}
