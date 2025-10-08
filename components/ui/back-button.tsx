"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ href, className, children }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`flex items-center space-x-2 ${className || ""}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{children || "Back"}</span>
    </Button>
  );
}
