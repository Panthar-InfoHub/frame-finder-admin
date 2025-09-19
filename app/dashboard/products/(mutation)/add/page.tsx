import AddFrameForm from "@/components/products/frames/create-frame-form";
import AddSunglassesForm from "@/components/products/sunglasses/create-sunglasses-form";
import { redirect } from "next/navigation";
import React from "react";

const getFormByType = (type: string) => {
  switch (type) {
    case "frames":
      return <AddFrameForm />;
    case "sunglasses":
      return <AddSunglassesForm />;
    case "contact-lens":
      return <div>Add Contact Lens Form later</div>;
    default:
      return <div>Unknown Product Type</div>;
  }
};

const page = async ({ searchParams }: { searchParams: Promise<{ type?: string }> }) => {
  const allowedTypes = ["frames", "sunglasses", "contact-lens"];

  const { type } = await searchParams;
  if (!type || !allowedTypes.includes(type)) redirect("/dashboard/products");

  const FormComponent = getFormByType(type);
  return FormComponent;
};

export default page;
