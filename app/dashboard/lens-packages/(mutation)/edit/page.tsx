import FrameLensPackageForm from "@/components/lens-package/frame-lens-package-form";
import SunglassLensPackageForm from "@/components/lens-package/sunglass-lens-package-form";
import { redirect } from "next/navigation";
import React from "react";

const getFormByType = (type: string) => {
  switch (type) {
    case "frame":
      return <FrameLensPackageForm />;
    case "sunglass":
      return <SunglassLensPackageForm />;
    default:
      return <div>Unknown Lens Package Type</div>;
  }
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string }>;
}) => {
  const allowedTypes = ["frame", "sunglass"];

  const { type } = await searchParams;
  if (!type || !allowedTypes.includes(type)) redirect("/dashboard/lens-packages");

  const FormComponent = getFormByType(type);
  return FormComponent;
};

export default page;
