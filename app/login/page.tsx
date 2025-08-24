"use client"
import { loginAction } from "@/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await loginAction(formData);

        console.log("Login response", res);

        if (!res.success) {
            console.log("Login failed", res.message);
            setLoading(false);
            return;
        }
        router.push("/admin");
        setLoading(false);
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side with illustration */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-[#B5CCBE] text-white">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%89%8D%E9%9D%A2%204.%20Lovebirds%20Website%20Login%20Design.jpg-1paoL13xn74ze0DJ424BHsfCXvnvkO.jpeg"
                        alt="Decorative bird illustration"
                        width={300}
                        height={300}
                        className="mx-auto"
                    />
                    <h2 className="text-2xl font-medium">Maecenas mattis egestas</h2>
                    <p className="text-sm text-white/80">
                        Eidum et malesuada fames ac ante ipsum primis in faucibus suspendisse porta
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

            {/* Right side with login form */}
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-script mb-6">Frame Finder</h1>
                        <h2 className="text-xl text-gray-600">Welcome to Frame Finder</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500" htmlFor="email">
                                Email
                            </label>
                            <Input id="email" name="email" placeholder="Enter your email" className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-500" htmlFor="password">
                                Password
                            </label>
                            <Input id="password" name="password" type="password" placeholder="Enter your password" className="w-full p-2 border rounded" />
                            <div className="text-right">
                                <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                    Forget password?
                                </Link>
                            </div>
                        </div>

                        <Button disabled={loading} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full border-gray-300">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png" alt="Google" width={20} height={20} className="mr-2" />
                            Sign in with Google
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-gray-600 hover:text-gray-800">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
