"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import useDebounce from "@/hooks/use-debounce";

export function VendorSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  // Track if we're searching - only show as searching if there's actual pending work
  const isSearching = isPending;

  // Auto-search when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    params.set("page", "1");

    const queryString = params.toString();
    const currentQuery = searchParams.toString();

    // Only navigate if the query actually changed
    if (queryString !== currentQuery) {
      startTransition(() => {
        router.push(`/dashboard/vendors?${queryString}`);
      });
    }
  }, [debouncedSearchTerm, router, searchParams]);

  const handleClear = () => {
    setSearchTerm("");
    router.push("/dashboard/vendors");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by business name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-20"
        />
        {isSearching && (
          <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
