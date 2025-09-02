import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SearchForm from '@/components/vendors/searchBoxVendors'
import { Vendor } from '@/types/vendor'
import { getAllVendors } from '@/actions/vendors/getAllVendors'
import { VendorTableActions } from '@/components/vendors/VendorTableActions'

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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Vendors</h1>
            </div>

            {/* Search Bar */}
            <SearchForm search={search} />

            {/* Vendors Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Owner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                GST No.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rating
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendorsData.data.map((vendor: Vendor) => (
                            <tr key={vendor._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {vendor.business_name}
                                        </div>

                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {vendor.business_owner}
                                        </div>

                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm text-gray-900">
                                            {vendor.email}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {vendor.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 ">
                                        {vendor.address.address_line_1}, {vendor.address.city},{vendor.address.state}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Pincode: {vendor.address.pincode}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {vendor.gst_number}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-900">
                                            {vendor.rating}/5
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${vendor.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'

                                        }`}>
                                        {vendor.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <VendorTableActions vendor={vendor} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
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
                        {hasNextPage && (
                            <Button variant="outline" asChild>
                                <Link href={`/admin/vendors?page=${pagination.page + 1}&limit=${pagination.limit}${search ? `&search=${search}` : ''}`}>
                                    Next
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
