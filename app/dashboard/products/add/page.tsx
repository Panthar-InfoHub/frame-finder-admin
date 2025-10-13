import AddAccessoriesForm from "@/components/products/accessories/create-accessories-form";
import AddFrameForm from "@/components/products/frames/create-frame-form";
import AddSunglassesForm from "@/components/products/sunglasses/create-sunglasses-form";
import AddReaderForm from "@/components/products/readers/create-reader-form";
import CreateContactLensForm from "@/components/products/contact-lens/create-contact-lens-form";
import CreateColorContactLensForm from "@/components/products/contact-lens-color/create-color-contact-lens-form";

import { redirect } from "next/navigation";
import React from "react";

const getFormByType = (type: string) => {
  switch (type) {
    case "frames":
      return <AddFrameForm />;
    case "sunglasses":
      return <AddSunglassesForm />;
    case "accessories":
      return <AddAccessoriesForm />;
    case "readers":
      return <AddReaderForm />;
    case "contact-lens":
      return <CreateContactLensForm />;
    case "contact-lens-color":
      return <CreateColorContactLensForm />;
    default:
      return <div>Unknown Product Type</div>;
  }
};

const page = async ({ searchParams }: { searchParams: Promise<{ type?: string }> }) => {
  const { type } = await searchParams;
  if (!type) redirect("/dashboard/products");

  const FormComponent = getFormByType(type);
  return FormComponent;
};

export default page;
