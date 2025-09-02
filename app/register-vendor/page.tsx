import { VendorRegistrationForm } from "@/components/vendors/VendorRegisterForm";

export default function Home() {
    return (
        <div className="h-screen grid lg:grid-cols-2">
            {/* Left side with illustration */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-[#B5CCBE] text-white">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%89%8D%E9%9D%A2%204.%20Lovebirds%20Website%20Login%20Design.jpg-1paoL13xn74ze0DJ424BHsfCXvnvkO.jpeg"
                        alt="Business registration illustration"
                        width={300}
                        height={300}
                        className="mx-auto"
                    />
                    <h2 className="text-2xl font-medium">Join Our Platform</h2>
                    <p className="text-sm text-white/80">
                        Register your business and start connecting with customers today
                    </p>
                    {/* Dots navigation */}
                    <div className="flex justify-center gap-2 pt-4">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>
                </div>
            </div>

            {/* Right side with registration form */}
            <div className="flex flex-col h-screen overflow-y-auto p-8">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-script mb-6">Frame Finder</h1>
                        <h2 className="text-xl text-gray-600">Vendor Registration</h2>
                        <p className="text-sm text-gray-500 mt-2">Join our platform and grow your business</p>
                    </div>
                    <VendorRegistrationForm />
                </div>
            </div>
        </div>
    )
}
