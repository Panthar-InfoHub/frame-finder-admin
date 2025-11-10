import { getLensSolutionById } from "@/actions/vendors/products";
import EditLensSolutionForm from "@/components/products/lens-solution/edit-lens-solution-form";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Suspense } from "react";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EditLensSolutionWrapper id={id} />
    </Suspense>
  );
};

const EditLensSolutionWrapper = async ({ id }: { id: string }) => {
  const resp = await getLensSolutionById(id);

  if (!resp.success || !resp.data) {
    return <div className="p-4">Unable to fetch lens solution details</div>;
  }

  return <EditLensSolutionForm lensSolution={resp.data} />;
};

export default EditPage;
