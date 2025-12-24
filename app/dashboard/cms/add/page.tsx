import { CMSForm } from "@/components/cms/CMSForm";
import { BackButton } from "@/components/ui/back-button";

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Create CMS Entry</h1>
      </div>
      <CMSForm mode="create" />
    </div>
  );
};

export default page;
