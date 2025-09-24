import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ProductType } from "@/types";

function ProductsTable({ products, type }: { products: any[]; type: ProductType }) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 text-sm mt-6">No products found.</div>;
  }


  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead>Image</TableHead> */}
          <TableHead>Brand</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Variants</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Options</TableHead>
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
              <TableCell className="font-medium">{product.brand_name}</TableCell>
              <TableCell className="max-w-xs truncate text-sm text-gray-600">
                {product.desc}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.productCode}
                </Badge>
              </TableCell>
              <TableCell>
                {product?.variants?.length || 0} variant
              </TableCell>
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
              <TableCell className="font-semibold">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      &#x22EE;
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`${type}/${product._id}`}>View Details</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table >
  );
}

export default ProductsTable;
