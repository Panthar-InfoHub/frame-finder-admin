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
          <TableHead>Brand</TableHead>
          <TableHead>Product Code</TableHead>
          <TableHead>Variants</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          return (
            <TableRow key={product._id}>
              <TableCell className="font-medium">{product.brand_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.productCode}</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">{product?.variants?.length || 0} variants</span>
              </TableCell>
              <TableCell>
                <Badge variant={product?.status === "active" ? "default" : "secondary"}>
                  {product?.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      &#x22EE;
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
    </Table>
  );
}

export default ProductsTable;
