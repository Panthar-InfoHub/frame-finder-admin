import VendorRegistrationWizard from "@/components/vendor-registration/VendorRegistrationWizard";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="text-center mb-8 flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-emerald-600 text-white font-bold flex w-8 h-8 p-2 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          Frame Finder.co
        </Link>
      </div>
      <VendorRegistrationWizard />
    </div>
  );
}
