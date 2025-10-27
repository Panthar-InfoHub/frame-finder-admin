"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import Link from "next/link";
import { ProductType } from "@/types";
import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";

interface LensPackage {
  _id: string;
  productCode: string;
  display_name?: string;
  brand_name?: string;
  index: string;
  price: {
    mrp: number;
    base_price: number;
    total_price: number;
  };
  duration: number;
  prescription_type: string;
  lens_type?: string;
  lens_color?: string;
  createdAt: string;
  updatedAt: string;
}

export function PackagesTable({ products, type }: { products: LensPackage[]; type: ProductType }) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 text-sm mt-6">No packages found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Code</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Index</TableHead>
          <TableHead>Prescription</TableHead>
          {type === "frames" ? <TableHead>Lens Type</TableHead> : <TableHead>Lens Color</TableHead>}
          <TableHead>Duration</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((pkg) => (
          <TableRow key={pkg._id}>
            <TableCell className="font-mono text-xs">{pkg.productCode}</TableCell>
            <TableCell>{pkg.display_name || "-"}</TableCell>
            <TableCell>{pkg.brand_name || "-"}</TableCell>
            <TableCell>{pkg.index}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {pkg.prescription_type.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>
              {type === "frames"
                ? pkg.lens_type?.replace("_", " ").toUpperCase() || "-"
                : pkg.lens_color?.replace("_", " ").toUpperCase() || "-"}
            </TableCell>
            <TableCell>{pkg.duration ? `${pkg.duration} days` : "-"}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">MRP: ₹{pkg.price.mrp}</span>
                <span className="font-medium">₹{pkg.price.total_price}</span>
              </div>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`${type}/${pkg._id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
