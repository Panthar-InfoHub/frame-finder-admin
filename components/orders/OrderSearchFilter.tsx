"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter, Calendar, Loader2 } from "lucide-react";
import useDebounce from "@/hooks/use-debounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function OrderSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Track if we're searching
  const isSearching = searchTerm !== debouncedSearchTerm || isPending;

  // Auto-search when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchTerm) params.set("searchTerm", debouncedSearchTerm);
    if (status && status !== "all") params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("page", "1");

    const queryString = params.toString();
    const currentQuery = searchParams.toString();

    // Only navigate if the query actually changed
    if (queryString !== currentQuery) {
      startTransition(() => {
        router.push(`/dashboard/orders?${queryString}`);
      });
    }
  }, [debouncedSearchTerm, status, startDate, endDate, router, searchParams]);

  const handleClear = () => {
    setSearchTerm("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    router.push("/dashboard/orders");
  };

  const activeFiltersCount = [status && status !== "all", startDate, endDate].filter(
    Boolean
  ).length;
  const hasFilters = searchTerm || status || startDate || endDate;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order code, product, phone, or tracking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-20"
          disabled={isPending}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && (
            <div className="flex items-center justify-center h-7 w-7">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {searchTerm && !isSearching && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters Popover */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter Orders</h4>
              <p className="text-sm text-muted-foreground">
                Refine your search with additional filters
              </p>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status || "all"} onValueChange={setStatus}>
                <SelectTrigger className="w-full border-border">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      All Statuses
                    </div>
                  </SelectItem>
                  <SelectItem value="pending" className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="processing" className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      Processing
                    </div>
                  </SelectItem>
                  <SelectItem value="shipped" className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      Shipped
                    </div>
                  </SelectItem>
                  <SelectItem value="delivered" className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      Delivered
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled" className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      Cancelled
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">From</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">To</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Clear All Button */}
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={handleClear} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Button (outside popover) */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
