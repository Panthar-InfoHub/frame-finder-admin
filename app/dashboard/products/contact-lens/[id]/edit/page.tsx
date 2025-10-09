import EditContactLensForm from "@/components/products/contact-lens/edit-contact-lens-form";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EditContactLensForm contactLensId={id} />;
};

export default page;
