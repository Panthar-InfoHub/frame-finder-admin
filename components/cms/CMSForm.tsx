"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createCMSEntry, updateCMSEntry } from "@/actions/cms";
import {
  CMSEntry,
  CMSCreatePayload,
  CMSValue,
  CMSImage,
  CMS_KEY_OPTIONS,
  getCMSKeyConfig,
} from "@/types/cms";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { getSignedViewUrl } from "@/actions/cloud-storage";

interface CMSFormProps {
  initialData?: CMSEntry;
  mode: "create" | "edit";
}

export function CMSForm({ initialData, mode }: CMSFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>(initialData?.key || "");

  const keyConfig = selectedKey ? getCMSKeyConfig(selectedKey) : null;
  const isSingleValue = keyConfig?.single ?? false;
  const formType = keyConfig?.type ?? "text";

  // Manage value items (text content) - single or multiple based on config
  const [valueItems, setValueItems] = useState<CMSValue[]>(
    initialData?.value && initialData.value.length > 0
      ? initialData.value
      : [{ title: "", desc: "", order: 1, misc: {} }]
  );

  // Manage image items
  const [imageItems, setImageItems] = useState<CMSImage[]>(initialData?.images || []);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<{ [key: number]: string }>({});
  const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});

  // Track misc field keys for each value item
  const [miscFields, setMiscFields] = useState<{ [itemIndex: number]: string[] }>(
    valueItems.reduce((acc, item, index) => {
      acc[index] = item.misc ? Object.keys(item.misc) : [];
      return acc;
    }, {} as { [itemIndex: number]: string[] })
  );

  // Load signed URLs for existing images
  useEffect(() => {
    const loadImagePreviews = async () => {
      if (imageItems.length > 0) {
        const previews: { [key: number]: string } = {};
        for (let i = 0; i < imageItems.length; i++) {
          if (imageItems[i].url) {
            try {
              const signedUrl = await getSignedViewUrl(imageItems[i].url);
              previews[i] = signedUrl;
            } catch (error) {
              console.error("Error loading image preview:", error);
            }
          }
        }
        setImagePreviewUrls(previews);
      }
    };
    loadImagePreviews();
  }, [imageItems.length]);

  // Reset form when key changes (only in create mode)
  useEffect(() => {
    if (mode === "create" && selectedKey) {
      const config = getCMSKeyConfig(selectedKey);
      if (config?.single) {
        // For single value, keep only one item
        setValueItems([{ title: "", desc: "", order: 1, misc: {} }]);
      }
      if (config?.type === "banner") {
        setImageItems([]);
      }
    }
  }, [selectedKey, mode]);

  // Add new value item (only for multi-value)
  const addValueItem = () => {
    if (isSingleValue) return; // Prevent adding if single value
    setValueItems([
      ...valueItems,
      {
        title: "",
        desc: "",
        order: valueItems.length + 1,
        misc: {},
      },
    ]);
  };

  // Remove value item (only for multi-value)
  const removeValueItem = (index: number) => {
    if (isSingleValue || valueItems.length <= 1) return; // Keep at least one
    const newItems = valueItems.filter((_, i) => i !== index);
    // Reorder remaining items
    const reorderedItems = newItems.map((item, i) => ({
      ...item,
      order: i + 1,
    }));
    setValueItems(reorderedItems);
  };

  // Update value item
  const updateValueItem = (index: number, field: keyof CMSValue, value: any) => {
    const newItems = [...valueItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setValueItems(newItems);
  };

  // Update misc field in value item
  const updateValueItemMisc = (index: number, key: string, value: string) => {
    const newItems = [...valueItems];
    newItems[index] = {
      ...newItems[index],
      misc: { ...newItems[index].misc, [key]: value },
    };
    setValueItems(newItems);
  };

  // Add new misc field
  const addMiscField = (itemIndex: number, key: string) => {
    if (!key.trim()) return;
    const newMiscFields = { ...miscFields };
    if (!newMiscFields[itemIndex]) {
      newMiscFields[itemIndex] = [];
    }
    if (!newMiscFields[itemIndex].includes(key)) {
      newMiscFields[itemIndex].push(key);
      setMiscFields(newMiscFields);
      updateValueItemMisc(itemIndex, key, "");
    }
  };

  // Remove misc field
  const removeMiscField = (itemIndex: number, key: string) => {
    const newMiscFields = { ...miscFields };
    newMiscFields[itemIndex] = newMiscFields[itemIndex].filter((k) => k !== key);
    setMiscFields(newMiscFields);

    const newItems = [...valueItems];
    const newMisc = { ...newItems[itemIndex].misc };
    delete newMisc[key];
    newItems[itemIndex] = { ...newItems[itemIndex], misc: newMisc };
    setValueItems(newItems);
  };

  // Add new image item
  const addImageItem = () => {
    setImageItems([
      ...imageItems,
      {
        url: "",
        order: imageItems.length + 1,
      },
    ]);
  };

  // Remove image item
  const removeImageItem = (index: number) => {
    const newItems = imageItems.filter((_, i) => i !== index);
    // Reorder remaining items
    const reorderedItems = newItems.map((item, i) => ({
      ...item,
      order: i + 1,
    }));
    setImageItems(reorderedItems);
    // Remove preview URL
    const newPreviews = { ...imagePreviewUrls };
    delete newPreviews[index];
    setImagePreviewUrls(newPreviews);
  };

  // Update image URL
  const updateImageUrl = (index: number, url: string) => {
    const newItems = [...imageItems];
    newItems[index] = { ...newItems[index], url };
    setImageItems(newItems);
  };

  // Handle image upload
  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingImages({ ...uploadingImages, [index]: true });

      const { success, failed } = await uploadFilesToCloud({
        files: [file],
        folder: { rootFolder: "vendor", folderName: "banner" },
      });

      if (success.length > 0 && success[0].path) {
        updateImageUrl(index, success[0].path);

        // Load signed URL for preview
        const signedUrl = await getSignedViewUrl(success[0].path);
        setImagePreviewUrls({ ...imagePreviewUrls, [index]: signedUrl });

        toast.success("Image uploaded successfully");
      } else {
        toast.error(failed[0]?.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading image");
    } finally {
      setUploadingImages({ ...uploadingImages, [index]: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!selectedKey) {
        toast.error("Please select a CMS key");
        setIsSubmitting(false);
        return;
      }

      if (mode === "create") {
        // Create payload
        const payload: CMSCreatePayload = {
          key: selectedKey,
        };

        // Add value items if form type is text
        if (
          formType === "text" &&
          valueItems.length > 0 &&
          valueItems.some((item) => item.title || item.desc)
        ) {
          payload.value = valueItems
            .filter((item) => item.title || item.desc)
            .map(({ _id, ...item }) => item);
        }

        // Add image items if form type is banner
        if (formType === "banner" && imageItems.length > 0 && imageItems.some((item) => item.url)) {
          payload.images = imageItems.filter((item) => item.url).map(({ _id, ...item }) => item);
        }

        const result = await createCMSEntry(payload);

        if (result.success) {
          toast.success(result.message);
          router.push("/dashboard/cms");
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } else {
        // Update mode
        if (!initialData?._id) {
          toast.error("CMS entry ID is missing");
          setIsSubmitting(false);
          return;
        }

        const payload: any = {};

        // Only send fields that exist
        if (valueItems.length > 0) {
          payload.value = valueItems.filter((item) => item.title || item.desc);
        }

        if (imageItems.length > 0) {
          payload.images = imageItems.filter((item) => item.url);
        }

        const result = await updateCMSEntry(initialData._id, payload);

        if (result.success) {
          toast.success(result.message);
          router.push("/dashboard/cms");
          router.refresh();
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CMS Key Selection */}
          <div className="space-y-2">
            <Label htmlFor="key">
              CMS Key <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedKey}
              onValueChange={setSelectedKey}
              disabled={mode === "edit"}
              required
            >
              <SelectTrigger id="key">
                <SelectValue placeholder="Select CMS key" />
              </SelectTrigger>
              <SelectContent>
                {CMS_KEY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select the predefined key for this CMS entry
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Empty state when no key selected */}
      {!selectedKey && mode === "create" && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">No CMS Key Selected</p>
              <p className="text-sm">Please select a CMS key above to start creating content</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Content Section */}
      {selectedKey && formType === "text" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{isSingleValue ? "Content" : "Text Content"}</CardTitle>
            {!isSingleValue && (
              <Button type="button" variant="outline" size="sm" onClick={addValueItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content Item
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {isSingleValue && (
              <p className="text-sm text-muted-foreground">
                This is a single-value content entry. Use markdown formatting in the description.
              </p>
            )}
            {valueItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                {!isSingleValue && valueItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeValueItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}

                {!isSingleValue && (
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title || ""}
                      onChange={(e) => updateValueItem(index, "title", e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>
                    {isSingleValue ? "Content (Markdown Supported)" : "Description"}
                    {isSingleValue && <span className="text-red-500">*</span>}
                  </Label>
                  <Textarea
                    value={item.desc || ""}
                    onChange={(e) => updateValueItem(index, "desc", e.target.value)}
                    placeholder={
                      isSingleValue ? "Enter content in markdown format..." : "Enter description"
                    }
                    rows={isSingleValue ? 15 : 4}
                    className="font-mono text-sm"
                    required={isSingleValue}
                  />
                  {isSingleValue && (
                    <p className="text-xs text-muted-foreground">
                      Supports markdown: **bold**, *italic*, # headings, - lists, [links](url), etc.
                    </p>
                  )}
                </div>

                {!isSingleValue && (
                  <>
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={item.order}
                        onChange={(e) => updateValueItem(index, "order", Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Additional Data (Optional)</Label>
                      </div>
                      <div className="space-y-3">
                        {miscFields[index]?.map((key) => (
                          <div key={key} className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                              <Label className="text-sm capitalize">{key.replace(/_/g, " ")}</Label>
                              <Input
                                value={item.misc?.[key] || ""}
                                onChange={(e) => updateValueItemMisc(index, key, e.target.value)}
                                placeholder={`Enter ${key.replace(/_/g, " ")}`}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMiscField(index, key)}
                              className="mt-7"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            id={`new-misc-key-${index}`}
                            placeholder="Enter field name (e.g., button_text, link)"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.currentTarget;
                                addMiscField(
                                  index,
                                  input.value.trim().toLowerCase().replace(/\s+/g, "_")
                                );
                                input.value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById(
                                `new-misc-key-${index}`
                              ) as HTMLInputElement;
                              if (input && input.value.trim()) {
                                addMiscField(
                                  index,
                                  input.value.trim().toLowerCase().replace(/\s+/g, "_")
                                );
                                input.value = "";
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Add custom fields like button_text, link, color, etc. Press Enter or click
                          + to add.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Banner Images Section */}
      {selectedKey && formType === "banner" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Banner Images</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addImageItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {imageItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No Images Added</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Click "Add Image" to upload banner images
                </p>
                <Button type="button" variant="outline" onClick={addImageItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Image
                </Button>
              </div>
            )}
            {imageItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeImageItem(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>

                <div className="space-y-2">
                  <Label>
                    Image Upload <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(index, file);
                        }
                      }}
                      disabled={uploadingImages[index]}
                      className="flex-1"
                    />
                    {uploadingImages[index] && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload an image file. Preview will be generated automatically.
                  </p>
                </div>

                {item.url && imagePreviewUrls[index] && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-lg overflow-hidden bg-muted">
                      <img
                        src={imagePreviewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover"
                        onError={() => {
                          // Fallback if signed URL fails
                          console.error("Failed to load image preview");
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">✓ Image uploaded successfully</p>
                  </div>
                )}

                {!item.url && !uploadingImages[index] && (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/20">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No image uploaded yet</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={item.order}
                    onChange={(e) => {
                      const newItems = [...imageItems];
                      newItems[index] = {
                        ...newItems[index],
                        order: Number(e.target.value),
                      };
                      setImageItems(newItems);
                    }}
                    min={1}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/cms")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || (!selectedKey && mode === "create")}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create CMS Entry"
          ) : (
            "Update CMS Entry"
          )}
        </Button>
      </div>
    </form>
  );
}
