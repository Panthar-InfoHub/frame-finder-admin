"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CMSEntry, CMS_KEY_OPTIONS } from "@/types/cms";
import { useState } from "react";
import { CMSDetailsDialog } from "./CMSDetailsDialog";
import { DeleteCMSDialog } from "./DeleteCMSDialog";
import { useRouter } from "next/navigation";

interface CMSTableProps {
  entries: CMSEntry[];
}

export function CMSTable({ entries }: CMSTableProps) {
  const router = useRouter();
  const [selectedEntry, setSelectedEntry] = useState<CMSEntry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!entries || entries.length === 0) {
    return <div className="text-center text-gray-500 text-sm mt-6">No CMS entries found.</div>;
  }

  const handleView = (entry: CMSEntry) => {
    setSelectedEntry(entry);
    setViewDialogOpen(true);
  };

  const handleEdit = (entryId: string) => {
    router.push(`/dashboard/cms/${entryId}/edit`);
  };

  const handleDelete = (entry: CMSEntry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  const getKeyLabel = (key: string) => {
    const option = CMS_KEY_OPTIONS.find((opt) => opt.value === key);
    return option?.label || key;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Content Items</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{getKeyLabel(entry.key)}</span>
                  <span className="text-xs text-muted-foreground font-mono">{entry.key}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{entry.value?.length || 0} item(s)</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{entry.images?.length || 0} image(s)</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{formatDate(entry.createdAt)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{formatDate(entry.updatedAt)}</span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(entry)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(entry._id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(entry)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedEntry && (
        <>
          <CMSDetailsDialog
            entry={selectedEntry}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
          <DeleteCMSDialog
            entry={selectedEntry}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
