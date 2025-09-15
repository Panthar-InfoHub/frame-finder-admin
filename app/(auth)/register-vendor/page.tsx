import { VendorRegistrationForm } from "@/components/vendors/VendorRegisterForm";

export default function Home() {
  return (
    <div className="w-full overflow-auto py-4 px-1 h-full ">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-script mb-6">Frame Finder</h1>
        <h2 className="text-xl text-gray-600">Vendor Registration</h2>
        <p className="text-sm text-gray-500 mt-2">Join our platform and grow your business</p>
      </div>
      <VendorRegistrationForm />
    </div>
  );
}
