"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const data = [
  {
    stock: { current: 10, minimum: 5, maximum: 100 },
    _id: "68c599a44ff1a58d980d430b",
    company: "Essilor",
    vendorId: null,
    package_design: "Progressive",
    index: "1.56",
    packagePrice: 2999,
    packageImage: [{ url: "https://example.com/image1.jpg", _id: "68c599a44ff1a58d980d430c" }],
    package_type: "Single Vision",
    packageCode: "LPKGMFIH23XK7ZYN3H",
    createdAt: "2025-09-13T16:19:48.205Z",
    updatedAt: "2025-09-13T16:19:48.205Z",
    __v: 0,
  },
  {
    stock: { current: 10, minimum: 5, maximum: 100 },
    _id: "68c2c1791f8e3af1abd1329c",
    company: "Essilor",
    vendorId: null,
    package_design: "Progressive",
    index: "1.56",
    packagePrice: 2999,
    packageImage: [{ url: "https://example.com/image1.jpg", _id: "68c2c1791f8e3af1abd1329d" }],
    package_type: "Single Vision",
    packageCode: "LPKGMFFE2OG9JG2TL0",
    createdAt: "2025-09-11T12:32:57.423Z",
    updatedAt: "2025-09-11T12:32:57.423Z",
    __v: 0,
  },
];

export function PackagesTable({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    // return <div className="text-center text-gray-500 text-sm mt-6">No products found.</div>;
    products = data; // Use sample data if no products are provided
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((pkg) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
