import { getSession } from "@/actions/session";

import AddProductDialog from "@/components/products/addProductDialog";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddLensPackageDialog from "@/components/products/addLensPackageDialog";
import { PackagesTable } from "@/components/products/lensPackageTable";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllFrameLensPackages,
  getAllSunglassLensPackages,
} from "@/actions/vendors/lens-package";

// Main Page
const page = async () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LensPackagePage />
    </Suspense>
  );
};

const LensPackagePage = async () => {
  const { user } = await getSession();

  if (!user) redirect("/login");
  if (user?.role !== "VENDOR") redirect("/dashboard");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lens Packages</h1>
        <AddLensPackageDialog />
      </div>

      <Tabs defaultValue="frame" className="w-full">
        <TabsList>
          <TabsTrigger value="frame">Frames</TabsTrigger>
          <TabsTrigger value="sunglass">Sunglass</TabsTrigger>
        </TabsList>

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

        <TabsContent value="sunglass">
          <Suspense fallback={<DashboardSkeleton />}>
            <SunglassesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="frame">
          <Suspense fallback={<DashboardSkeleton />}>
            <FramesTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SunglassesTab = async () => {
  const resp = await getAllSunglassLensPackages();
  console.log(resp);
  return <PackagesTable products={resp.data.lensPackage} />;
};

// Frames tab server component
const FramesTab = async () => {
  const resp = await getAllFrameLensPackages();
  console.log(resp);
  return <PackagesTable products={resp.data.lensPackage} />;
};

export default page;
