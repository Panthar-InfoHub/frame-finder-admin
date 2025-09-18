import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

const SectionFilterSort = () => {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Search */}
      <form className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-8 pr-8" />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {/* Filters + Sort */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="price_low_high">Price: Low → High</SelectItem>
            <SelectItem value="price_high_low">Price: High → Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Button */}
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default SectionFilterSort;
