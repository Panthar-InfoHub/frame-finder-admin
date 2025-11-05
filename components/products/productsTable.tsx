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

  // Check if products have variants (handle both 'variants' and 'variant' field names)
  const hasVariants = products.some(
    (p) => (p.variants && p.variants.length > 0) || (p.variants && p.variants.length > 0)
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Brand</TableHead>
          <TableHead>Product Code</TableHead>
          {hasVariants && <TableHead>Variants</TableHead>}
          {type === "accessories" && <TableHead>Stock</TableHead>}
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
              {hasVariants && (
                <TableCell>
                  <span className="text-sm">
                    {product?.variants?.length || product?.variant?.length || 0} variants
                  </span>
                </TableCell>
              )}
              {type === "accessories" && (
                <TableCell>
                  <span className="text-sm">{product?.stock?.current || 0} units</span>
                </TableCell>
              )}
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
