import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import SearchForm from '@/components/vendors/searchBoxVendors'
import { Vendor } from '@/types/vendor'
import { getAllVendors } from '@/actions/vendors/getAllVendors'
import { VendorTableActions } from '@/components/vendors/VendorTableActions'
import { Plus, Store, Users, Star, MapPin, Mail, Phone } from 'lucide-react'

interface VendorsPageProps {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
    const sp = await searchParams
    const page = sp.page || '1'
    const limit = sp.limit || '10'
    const search = sp.search || ''

    const vendorsData = await getAllVendors({ page, limit, search })

    // Use pagination data from API response
    const { pagination } = vendorsData
    const startIndex = (pagination.page - 1) * pagination.limit + 1
    const endIndex = Math.min(pagination.page * pagination.limit, pagination.totalCount)
    const hasNextPage = pagination.page < pagination.totalPages
    const hasPrevPage = pagination.page > 1

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor all registered vendors
                    </p>
                </div>
                <Button asChild>
                    <Link href="/register-vendor">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vendor
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination.totalCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Active businesses registered
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {vendorsData.data.filter((v: Vendor) => v.isActive).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Currently operational
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {vendorsData.data.length > 0
                                ? (vendorsData.data.reduce((acc: number, v: Vendor) => acc + v.rating, 0) / vendorsData.data.length).toFixed(1)
                                : '0.0'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Out of 5.0 stars
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <SearchForm search={search} />
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
                                {vendorsData.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <Store className="h-8 w-8 text-muted-foreground" />
                                                <div className="text-sm text-muted-foreground">
                                                    {search ? `No vendors found for "${search}"` : 'No vendors found'}
                                                </div>
                                                {!search && (
                                                    <Button asChild size="sm">
                                                        <Link href="/register-vendor">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add First Vendor
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendorsData.data.map((vendor: Vendor) => (
                                        <TableRow key={vendor._id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Link
                                                        href={`/admin/vendors/${vendor._id}`}
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
                                                    <span className="text-sm font-medium">{vendor.rating}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={vendor.isActive ? "default" : "secondary"}>
                                                    {vendor.isActive ? 'Active' : 'Inactive'}
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
            {pagination.totalPages > 1 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex} to {endIndex} of {pagination.totalCount} vendors
                            </div>
                            <div className="flex gap-2">
                                {hasPrevPage && (
                                    <Button variant="outline" asChild>
                                        <Link href={`/admin/vendors?page=${pagination.page - 1}&limit=${pagination.limit}${search ? `&search=${search}` : ''}`}>
                                            Previous
                                        </Link>
                                    </Button>
                                )}

                                {/* Page numbers */}
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const pageNum = Math.max(1, pagination.page - 2) + i;
                                        if (pageNum > pagination.totalPages) return null;

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === pagination.page ? "default" : "outline"}
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/admin/vendors?page=${pageNum}&limit=${pagination.limit}${search ? `&search=${search}` : ''}`}>
                                                    {pageNum}
                                                </Link>
                                            </Button>
                                        );
                                    })}
                                </div>

                                {hasNextPage && (
                                    <Button variant="outline" asChild>
                                        <Link href={`/admin/vendors?page=${pagination.page + 1}&limit=${pagination.limit}${search ? `&search=${search}` : ''}`}>
                                            Next
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
