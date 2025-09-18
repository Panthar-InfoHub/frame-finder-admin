"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ProductType } from "@/types";


export function PackagesTable({ products, type }: { products: any[]; type: ProductType }) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 text-sm mt-6">No products found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Design</TableHead>
          <TableHead>Index</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((pkg) => (
          <TableRow key={pkg._id}>
            <TableCell>{pkg.company}</TableCell>
            <TableCell>{pkg.package_type}</TableCell>
            <TableCell>{pkg.package_design}</TableCell>
            <TableCell>{pkg.index}</TableCell>
            <TableCell>₹{pkg.packagePrice}</TableCell>
            <TableCell>
              {pkg.stock.current} / {pkg.stock.maximum}
            </TableCell>
            <TableCell className="font-mono text-xs">{pkg.packageCode}</TableCell>
            <TableCell className="font-semibold">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size={"icon"}>
                    &#x22EE;
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`${type}/${pkg._id}`}>View Details</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
