"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Vendor } from '@/types/vendor'
import { updateVendor, UpdateVendorData } from '@/actions/vendors/updateVendor'
import { deleteVendor } from '@/actions/vendors/deleteVendor'
import { Eye, Edit, Trash2, Loader2, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface VendorTableActionsProps {
    vendor: Vendor
}

export function VendorTableActions({ vendor }: VendorTableActionsProps) {
    const router = useRouter()
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateMessage, setUpdateMessage] = useState('')
    const [deleteMessage, setDeleteMessage] = useState('')

    const [formData, setFormData] = useState<UpdateVendorData>({
        business_name: vendor.business_name,
        business_owner: vendor.business_owner,
        email: vendor.email,
        phone: vendor.phone,
        gst_number: vendor.gst_number,
        address: {
            address_line_1: vendor.address.address_line_1,
            city: vendor.address.city,
            state: vendor.address.state,
            pincode: vendor.address.pincode,
        },
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        setUpdateMessage('')

        try {
            const result = await updateVendor(vendor._id, formData)

            if (result.success) {
                setUpdateMessage('Vendor updated successfully!')
                setIsUpdateOpen(false)
            } else {
                setUpdateMessage(result.message || 'Failed to update vendor')
            }
        } catch (error) {
            setUpdateMessage('An error occurred while updating the vendor')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        setDeleteMessage('')

        try {
            const result = await deleteVendor(vendor._id)

            if (result.success) {
                setDeleteMessage('Vendor deleted successfully!')
                setIsDeleteOpen(false)
            } else {
                setDeleteMessage(result.message || 'Failed to delete vendor')
            }
        } catch (error) {
            setDeleteMessage('An error occurred while deleting the vendor')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/vendors/${vendor._id}`} className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update Dialog */}
            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Vendor</DialogTitle>
                        <DialogDescription>
                            Update the vendor information. All fields are optional.
                        </DialogDescription>
                    </DialogHeader>

                    {updateMessage && (
                        <div className={`p-3 rounded-md text-sm ${updateMessage.includes('successfully')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {updateMessage}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="business_name">Business Name</Label>
                                <Input
                                    id="business_name"
                                    value={formData.business_name || ''}
                                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                    placeholder="Business name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_owner">Business Owner</Label>
                                <Input
                                    id="business_owner"
                                    value={formData.business_owner || ''}
                                    onChange={(e) => setFormData({ ...formData, business_owner: e.target.value })}
                                    placeholder="Business owner"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone number"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="gst_number">GST Number</Label>
                                <Input
                                    id="gst_number"
                                    value={formData.gst_number || ''}
                                    onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                                    placeholder="GST number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Address</Label>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Input
                                        value={formData.address?.address_line_1 || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address!, address_line_1: e.target.value }
                                        })}
                                        placeholder="Address line 1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        value={formData.address?.city || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address!, city: e.target.value }
                                        })}
                                        placeholder="City"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        value={formData.address?.state || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address!, state: e.target.value }
                                        })}
                                        placeholder="State"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        value={formData.address?.pincode || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address!, pincode: e.target.value }
                                        })}
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUpdateOpen(false)}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Update Vendor
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the vendor
                            &quot;{vendor.business_name}&quot; and remove all associated data from the system.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteMessage && (
                        <div className={`p-3 rounded-md text-sm ${deleteMessage.includes('successfully')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {deleteMessage}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Delete Vendor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
