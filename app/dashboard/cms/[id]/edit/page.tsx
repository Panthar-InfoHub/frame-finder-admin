import { searchCMSEntries } from "@/actions/cms";
import { CMSForm } from "@/components/cms/CMSForm";
import { BackButton } from "@/components/ui/back-button";
import { notFound } from "next/navigation";

interface EditCMSPageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: { params: Promise<EditCMSPageProps["params"]> }) => {
  const { id } = await params;

  // Fetch all CMS entries and find by ID
  // Note: This is a workaround since the API doesn't provide a direct getCMSEntryById endpoint
  const searchResult = await searchCMSEntries(1, 100);

  if (!searchResult.success || !searchResult.data) {
    notFound();
  }

  const entry = searchResult.data.find((e) => e._id === id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Edit CMS Entry</h1>
      </div>
      <CMSForm mode="edit" initialData={entry} />
    </div>
  );
};

export default page;
