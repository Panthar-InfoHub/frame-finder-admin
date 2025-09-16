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

function ProductsTable({ products }: { products: any[] }) {
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
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Edit</TableHead>
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
              {/* <TableCell>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.brand_name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover bg-muted overflow-hidden flex items-center justify-center"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </TableCell> */}
              <TableCell className="font-medium">{product.brand_name}</TableCell>
              <TableCell className="max-w-xs truncate text-sm text-gray-600">
                {product.desc}
              </TableCell>
              <TableCell
                className="text-xs text-gray-500 overflow-hidden truncate max-w-xs
              "
              >
                {product.productCode}
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
              <TableCell className="font-semibold">
                <Button variant={"outline"} size={"sm"} asChild>
                  <Link href={`/dashboard/products/edit-product/${product._id}`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ProductsTable;
