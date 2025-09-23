import { getContactLensById } from "@/actions/vendors/products";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ContactLensColorsDetails id={id} />
    </Suspense>
  );
};

const ContactLensColorsDetails = async ({ id }: { id: string }) => {
  const resp = await getContactLensById("contact_lens_color", id);
  if (!resp) return <div>Contact Lens not found</div>;
  return <pre lang="json">{JSON.stringify(resp, null, 2)}</pre>;
};

export default page;
