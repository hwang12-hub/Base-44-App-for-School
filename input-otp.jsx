import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ value, onChange, readonly = false, size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-9 h-9" };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-all duration-200",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              "transition-colors duration-200",
              star <= value
                ? "fill-accent text-accent"
                : "fill-none text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}