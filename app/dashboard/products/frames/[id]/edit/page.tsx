
import EditFrameForm from "@/components/products/frames/edit-frame-form";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="container mx-auto p-6">
      <EditFrameForm frameId={id} />
    </div>
  );
};

export default page;
