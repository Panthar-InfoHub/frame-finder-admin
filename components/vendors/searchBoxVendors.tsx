"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";

export default function SearchForm({ search }: { search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(search);
  const [isPending, startTransition] = useTransition();

  const updateUrl = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue) {
      params.set("search", newValue);
      params.set("page", "1"); // Reset to first page when searching
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/admin/vendors?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUrl(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    updateUrl("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <form onSubmit={handleSearch} className="flex gap-2 items-center flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search vendors by name, email, or GST..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-9"
            disabled={isPending}
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              disabled={isPending}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button type="submit" disabled={isPending || !searchValue.trim()}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>
      
      {search && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Searching for: </span>
          <span className="font-medium text-foreground">{search}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isPending}
            className="h-6 text-xs"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
