import EditSunglassForm from "@/components/products/sunglasses/edit-sunglass-form";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="container mx-auto p-6">
      <EditSunglassForm sunglassId={id} />
    </div>
  );
};

export default page;
