"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CMSEntry, CMS_KEY_OPTIONS, getCMSKeyConfig } from "@/types/cms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { removeSubCMSValue } from "@/actions/cms";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { useRouter } from "next/navigation";

interface CMSDetailsDialogProps {
  entry: CMSEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CMSDetailsDialog({ entry, open, onOpenChange }: CMSDetailsDialogProps) {
  const router = useRouter();
  const [removingItems, setRemovingItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState<{
    [key: string]: string;
  }>({});

  const keyConfig = getCMSKeyConfig(entry.key);
  const isSingleValue = keyConfig?.single ?? false;

  // Load signed URLs for images
  useEffect(() => {
    const loadImagePreviews = async () => {
      if (entry.images && entry.images.length > 0) {
        const previews: { [key: string]: string } = {};
        for (const image of entry.images) {
          if (image.url && image._id) {
            try {
              const signedUrl = await getSignedViewUrl(image.url);
              previews[image._id] = signedUrl;
            } catch (error) {
              console.error("Error loading image preview:", error);
            }
          }
        }
        setImagePreviewUrls(previews);
      }
    };
    if (open) {
      loadImagePreviews();
    }
  }, [entry.images, open]);

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

  const handleRemoveSubItem = async (subId: string, type: "value" | "image") => {
    try {
      setRemovingItems({ ...removingItems, [subId]: true });

      const result = await removeSubCMSValue(entry._id, subId);

      if (result.success) {
        toast.success(`${type === "value" ? "Content item" : "Image"} removed successfully`);
        router.refresh();
        // Optionally close dialog or update entry
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error removing sub item:", error);
      toast.error("An error occurred while removing the item");
    } finally {
      setRemovingItems({ ...removingItems, [subId]: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>CMS Entry Details</DialogTitle>
          <DialogDescription>View and manage CMS entry content</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Key</p>
                  <p className="text-lg font-semibold">{getKeyLabel(entry.key)}</p>
                  <p className="text-xs text-muted-foreground font-mono">{entry.key}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(entry.createdAt)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Updated</p>
                  <p className="text-sm">{formatDate(entry.updatedAt)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Value Items (Text Content) */}
            {entry.value && entry.value.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {isSingleValue ? "Content" : "Text Content"}
                  {!isSingleValue && (
                    <Badge variant="secondary">{entry.value.length} item(s)</Badge>
                  )}
                </h3>
                {entry.value.map((item, index) => (
                  <Card key={item._id || index}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <CardTitle className="text-base">
                        {isSingleValue ? "Content" : `Item #${item.order}`}
                      </CardTitle>
                      {!isSingleValue && item._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSubItem(item._id!, "value")}
                          disabled={removingItems[item._id]}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {!isSingleValue && item.title && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Title</p>
                          <p className="text-base">{item.title}</p>
                        </div>
                      )}
                      {item.desc && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {isSingleValue ? "Content" : "Description"}
                          </p>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap prose prose-sm max-w-none">
                            {item.desc}
                          </div>
                          {isSingleValue && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Note: Markdown formatting is preserved in the content above
                            </p>
                          )}
                        </div>
                      )}
                      {!isSingleValue && item.misc && Object.keys(item.misc).length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Additional Data
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(item.misc).map(([key, value]) => (
                              <div key={key} className="p-2 bg-muted rounded-md">
                                <p className="font-medium capitalize">{key.replace(/_/g, " ")}</p>
                                <p className="text-muted-foreground">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Image Items */}
            {entry.images && entry.images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Banner Images
                  <Badge variant="secondary">{entry.images.length} image(s)</Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.images.map((image, index) => (
                    <Card key={image._id || index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">Image #{image.order}</CardTitle>
                        {image._id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSubItem(image._id!, "image")}
                            disabled={removingItems[image._id]}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="rounded-lg overflow-hidden border">
                          <img
                            src={
                              image._id && imagePreviewUrls[image._id]
                                ? imagePreviewUrls[image._id]
                                : image.url
                            }
                            alt={`Image ${image.order}`}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              // Fallback to original URL if signed URL fails
                              const target = e.target as HTMLImageElement;
                              if (target.src !== image.url) {
                                target.src = image.url;
                              }
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Storage Path</p>
                          <p className="text-xs font-mono break-all text-muted-foreground">
                            {image.url}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!entry.value || entry.value.length === 0) &&
              (!entry.images || entry.images.length === 0) && (
                <div className="text-center text-muted-foreground py-8">
                  No content or images found in this CMS entry
                </div>
              )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
