import { getAllFrames, getAllSunglasses } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const getProductComponent = (type: string) => {
  switch (type) {
    case "sunglasses":
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <SunglassesTab />
        </Suspense>
      );
    case "frames":
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <FramesTab />
        </Suspense>
      );
    case "contact-lens":
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <div>Contact Lens Products</div>
        </Suspense>
      );
  }
};

const page = async ({ params }: { params: Promise<{ type?: string }> }) => {
  const { type } = await params;
  const allowedTypes = ["sunglasses", "frames", "contact-lens"];

  if (!type || !allowedTypes.includes(type)) {
    return redirect("/dashboard");
  }

  const ProductComponent = getProductComponent(type);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{type}</h1>
        <Button>
          <Link href={`/dashboard/products/add-product?type=${type}`}>Add New</Link>
        </Button>
      </div>
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
      {ProductComponent}
    </div>
  );
};

const SunglassesTab = async () => {
  const resp = await getAllSunglasses();
  return <ProductsTable products={resp?.data?.sunglass} />;
};

const FramesTab = async () => {
  const resp = await getAllFrames();
  return <ProductsTable products={resp?.data?.products} />;
};

export default page;
