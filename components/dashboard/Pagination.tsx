"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  /** Current active page */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when page changes */
  onPageChange: (page: number) => void;
  /** Optional: className for styling overrides */
  className?: string;
  /** Optional: disable controls globally */
  disabled?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  disabled = false,
}: PaginationProps) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const handlePrev = () => {
    if (!isFirst && !disabled) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (!isLast && !disabled) {
      onPageChange(page + 1);
    }
  };

  if (totalPages <= 0) return null; // nothing to paginate

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-sm",
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrev}
        disabled={isFirst || disabled}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="whitespace-nowrap">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={isLast || disabled}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
