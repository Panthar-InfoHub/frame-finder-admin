"use client";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GalleryVerticalEnd } from "lucide-react";

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
      <div className="text-center mb-8 flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-emerald-600 text-white font-bold flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Frame Finder.co
        </Link>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>


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

            <Link href="/register-vendor">
              <Button variant="outline" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white! font-bold">
                Register as Vendor
              </Button>
            </Link>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
