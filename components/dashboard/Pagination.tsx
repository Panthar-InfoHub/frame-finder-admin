"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  /** Current active page */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Optional: Callback fired when page changes (for controlled mode) */
  onPageChange?: (page: number) => void;
  /** Optional: className for styling overrides */
  className?: string;
  /** Optional: disable controls globally */
  disabled?: boolean;
  /** Optional: Total number of items to display count */
  totalItems?: number;
  /** Optional: Label for items (e.g., "products", "users") */
  itemLabel?: string;
  /** Optional: Use URL-based navigation instead of callback */
  useUrlNavigation?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  disabled = false,
  totalItems,
  itemLabel = "items",
  useUrlNavigation = false,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const handlePageChange = (newPage: number) => {
    if (useUrlNavigation) {
      // URL-based navigation
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    } else if (onPageChange) {
      // Callback-based navigation
      onPageChange(newPage);
    }
  };

  const handlePrev = () => {
    if (!isFirst && !disabled) {
      handlePageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (!isLast && !disabled) {
      handlePageChange(page + 1);
    }
  };

  // Don't show pagination if there's only 1 page or no pages
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex flex-col items-center gap-2 py-4", className)}>
      <div className="flex items-center justify-center gap-4 text-sm">
        <Button variant="outline" size="icon" onClick={handlePrev} disabled={isFirst || disabled}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="whitespace-nowrap">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <Button variant="outline" size="icon" onClick={handleNext} disabled={isLast || disabled}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {totalItems !== undefined && (
        <p className="text-sm text-muted-foreground">
          Showing {totalItems} {itemLabel}
          {totalItems !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
