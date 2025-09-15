"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-script mb-6">Frame Finder</h1>
        <h2 className="text-xl text-gray-600">Create Your Account</h2>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="email">
            Email
          </label>
          <Input id="email" placeholder="Enter your email" className="w-full p-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="confirm-password">
            Confirm Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            className="w-full p-2 border rounded"
          />
        </div>

        <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">Register</Button>

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
          Sign up with Google
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-600 hover:text-gray-800">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
