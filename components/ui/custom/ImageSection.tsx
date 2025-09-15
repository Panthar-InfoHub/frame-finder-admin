"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageSectionProps {
  images: string[]; // array of signed URLs ready to display
  getSignedUrl?: (path: string) => Promise<string>; // optional helper
  onChange: (newImages: string[]) => void; // required, parent setter
}

export function ImageSection({ images, getSignedUrl, onChange }: ImageSectionProps) {
  const [urls, setUrls] = useState<string[]>([]);

  //   useEffect(() => {
  //     let mounted = true;

  //     async function fetchNewUrls() {
  //       const newImages = images.slice(urls.length); // only new images
  //       const newUrls = await Promise.all(
  //         newImages.map(async (img) => (getSignedUrl ? getSignedUrl(img) : img))
  //       );
  //       if (mounted) setUrls((prev) => [...prev, ...newUrls]);
  //     }

  //     fetchNewUrls();
  //     return () => {
  //       mounted = false;
  //     };
  //   }, [images, getSignedUrl]);

  useEffect(() => {
    let mounted = true;

    async function fetchUrls() {
      const mappedUrls = await Promise.all(
        images.map(async (img) => {
          if (getSignedUrl) return getSignedUrl(img);
          return img;
        })
      );
      if (mounted) setUrls(mappedUrls);
    }

    fetchUrls();
    return () => {
      mounted = false;
    };
  }, [images, getSignedUrl]);

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {urls.map((url, i) => (
        <div key={i} className="relative aspect-square w-40 rounded-lg bg-muted group">
          <img
            src={url}
            alt={`Image ${i + 1}`}
            className="w-full h-full object-contain bg-muted rounded-md "
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemove(i)}
            aria-label={`Remove image ${i + 1}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
