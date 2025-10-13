import EditColorContactLensForm from "@/components/products/contact-lens-color/edit-color-contact-lens-form";

export default async function EditColorContactLensPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <EditColorContactLensForm colorContactLensId={id} />
    </div>
  );
}
