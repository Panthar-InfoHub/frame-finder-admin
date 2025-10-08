import EditReaderForm from "@/components/products/readers/edit-reader-form";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EditReaderForm readerId={id} />
    </Suspense>
  );
};

export default page;
