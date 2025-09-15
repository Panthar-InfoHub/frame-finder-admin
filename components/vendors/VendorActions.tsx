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
import { Vendor } from '@/types/vendor'
import { deleteVendor } from '@/actions/vendors/vendors'
import { Edit, Trash2, Loader2 } from 'lucide-react'

interface VendorActionsProps {
  vendor: Vendor
}

export function VendorActions({ vendor }: VendorActionsProps) {
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteMessage('')

    try {
      const result = await deleteVendor(vendor._id)
      
      if (result.success) {
        setDeleteMessage('Vendor deleted successfully!')
        setTimeout(() => {
          router.push('/admin/vendors')
          router.refresh()
        }, 2000)
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
    <div className="flex gap-2">
      {/* Edit Button - Links to dedicated edit page */}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/vendors/${vendor._id}/edit`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Link>
      </Button>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the vendor
              &quot;{vendor.business_name}&quot; and remove all associated data from the system.
            </DialogDescription>
          </DialogHeader>
          
          {deleteMessage && (
            <div className={`p-3 rounded-md text-sm ${
              deleteMessage.includes('successfully') 
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
    </div>
  )
}
