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
import { getAllFrames, getAllSunglasses } from "@/actions/vendors/products";

// Main Page
const page = async () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ProductsPage />
    </Suspense>
  );
};

const ProductsPage = async () => {
  const { user } = await getSession();

  if (!user) redirect("/login");
  if (user?.role !== "VENDOR") redirect("/dashboard");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Products</h1>
        <AddProductDialog />
      </div>

      <Tabs defaultValue="sunglasses" className="w-full">
        <TabsList>
          <TabsTrigger value="sunglasses">Sunglasses</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="contact-lens">Contact Lens</TabsTrigger>
        </TabsList>

        <TabsContent value="sunglasses">
          <Suspense fallback={<DashboardSkeleton />}>
            <SunglassesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="frames">
          <Suspense fallback={<DashboardSkeleton />}>
            <FramesTab />
          </Suspense>
        </TabsContent>
        <TabsContent value="contact-lens">
          <Suspense fallback={<DashboardSkeleton />}>
            <ProductsTable products={[]} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Sunglasses tab server component
const SunglassesTab = async () => {
  const resp = await getAllSunglasses();
  return <ProductsTable products={resp.data.sunglass} />;
};

// Frames tab server component
const FramesTab = async () => {
  const resp = await getAllFrames();
  return <ProductsTable products={resp.data.products} />;
};

// Table Component
export function ProductsTable({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 text-sm mt-6">No products found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const stockStatus =
            product.stock?.current > product.stock?.minimum
              ? "In Stock"
              : product.stock?.current <= product.stock?.minimum
              ? "Low Stock"
              : "Out of Stock";

          return (
            <TableRow key={product._id}>
              <TableCell>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.brand_name}
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.brand_name}</TableCell>
              <TableCell className="max-w-xs truncate text-sm text-gray-600">
                {product.desc}
              </TableCell>
              <TableCell className="font-semibold">₹{product.price}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    stockStatus === "In Stock"
                      ? "default"
                      : stockStatus === "Low Stock"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {stockStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-gray-500">{product.productCode}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default page;
