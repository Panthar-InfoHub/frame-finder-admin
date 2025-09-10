import FrameLensPackageForm from "@/components/products/frame-lens-package-form";
import SunglassLensPackageForm from "@/components/products/sunglass-lens-package-form";
import { redirect } from "next/navigation";
import React from "react";

const getFormByType = (type: string) => {
  switch (type) {
    case "frames":
      return <FrameLensPackageForm />;
    case "sunglasses":
      return <SunglassLensPackageForm />;
    default:
      return <div>Unknown Lens Package Type</div>;
  }
};

const page = async ({ searchParams }: { searchParams: Promise<{ type?: string }> }) => {
  const allowedTypes = ["frames", "sunglasses"];

  const { type } = await searchParams;
  if (!type || !allowedTypes.includes(type)) redirect("/dashboard/lens-packages");

  const FormComponent = getFormByType(type);
  return FormComponent;
};

export default page;
