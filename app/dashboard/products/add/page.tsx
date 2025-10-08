import AddAccessoriesForm from "@/components/products/accessories/create-accessories-form";
import AddFrameForm from "@/components/products/frames/create-frame-form";
import AddSunglassesForm from "@/components/products/sunglasses/create-sunglasses-form";
import AddReaderForm from "@/components/products/readers/create-reader-form";

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
      return <div>Add Contact Lens Form later</div>;
    case "contact-lens-color":
      return <div>Add Contact Lens Color Form later</div>;
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
