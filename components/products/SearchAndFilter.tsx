"use client";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchAndFilterProps {
  initialSearchTerm?: string;
  placeholder: string;
  searchParamName?: string; // Either "search" or "code"
}

const SearchAndFilter = ({
  initialSearchTerm = "",
  placeholder,
  searchParamName = "search",
}: SearchAndFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Handle search term changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (debouncedSearchTerm) {
      current.set(searchParamName, debouncedSearchTerm);
    } else {
      current.delete(searchParamName);
    }
    // Reset to page 1 when searching
    current.set("page", "1");
    router.push(`?${current.toString()}`);
  }, [debouncedSearchTerm, router, searchParams, searchParamName]);

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
