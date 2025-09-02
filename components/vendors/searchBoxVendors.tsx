"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";

export default function SearchForm({ search }: { search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(search);
  const [isPending, startTransition] = useTransition(); // ⬅️ for loading state

  const updateUrl = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue) {
      params.set("search", newValue);
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
    <form onSubmit={handleSearch} className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Search vendors..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Searching..." : "Search"}
      </Button>
      <Button type="button" onClick={handleClear} disabled={isPending} variant="outline">
        {isPending ? "Clearing..." : "Clear"}
      </Button>
    </form>
  );
}
