"use client";
import { loginAction } from "@/actions/auth/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("type", "VENDOR");
    const res = await loginAction(formData);

    if (!res.success) {
      toast.error(res.message || "Login failed");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-script mb-6">Frame Finder</h1>
        <h2 className="text-xl text-gray-600">Vendor Login</h2>
        <p className="text-sm text-gray-500 mt-2">Log in to your account to continue</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border rounded"
          />
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
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register-vendor" className="text-gray-600 hover:text-gray-800">
            Register as Vendor
          </Link>
        </p>
      </form>
    </div>
  );
}
