import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vendor } from "@/types/vendor";
import { getAllVendors } from "@/actions/vendors/vendors";
import { VendorTableActions } from "@/components/vendors/VendorTableActions";
import { VendorSearchFilter } from "@/components/vendors/VendorSearchFilter";
import { Pagination } from "@/components/dashboard/Pagination";
import { Store, Star, MapPin, Mail, Phone } from "lucide-react";
import { getSession } from "@/actions/session";
import { isAdminRole } from "@/utils/permissions";

interface VendorsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const { user } = await getSession();
  if (!isAdminRole(user?.role)) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const sp = await searchParams;
  const page = sp.page || "1";
  const limit = sp.limit || "30";
  const search = sp.search || "";

  const vendorsData = await getAllVendors({ page, limit, search });

  const { pagination } = vendorsData;
  const vendors = vendorsData.data || [];
  const totalVendors = pagination?.total || pagination?.totalCount || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage and monitor all registered vendors</p>
        </div>
      </div>

      {/* Search Filter */}
      <VendorSearchFilter />

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Vendors List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Business</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Store className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {search ? `No vendors found for "${search}"` : "No vendors found"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  vendors.map((vendor: Vendor) => (
                    <TableRow key={vendor._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <Link
                            href={`#`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {vendor.business_name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{vendor.business_owner}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{vendor.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{vendor.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">
                              {vendor.address.city}, {vendor.address.state}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            PIN: {vendor.address.pincode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {vendor.gst_number}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{vendor.rating || 0}</span>
                        </div>
                        {vendor.total_reviews && (
                          <div className="text-xs text-muted-foreground">
                            {vendor.total_reviews} reviews
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={vendor.isActive ? "default" : "secondary"}>
                          {vendor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <VendorTableActions vendor={vendor} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        page={parseInt(page)}
        totalPages={pagination?.totalPages || 0}
        totalItems={totalVendors}
        itemLabel="vendor"
        useUrlNavigation={true}
      />
    </div>
  );
}
