import { getSession } from "@/actions/session";
import LogoutButton from "@/components/dashboard/LogoutButton";
import Link from "next/link";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-svh bg-black text-white">
      <div>
        <h1 className="text-2xl font-bold">Welcome to the Frame Finder Admin</h1>
        <div className="mt-4 flex gap-2  justify-center">
          <Suspense
            fallback={<div className="animate-pulse bg-muted-foreground w-24 rounded-md" />}
          >
            <AuthBtns />
          </Suspense>
          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const AuthBtns = async () => {
  const { user } = await getSession();
  if (user) {
    return (
      <LogoutButton className="bg-red-500 hover:bg-red-700 h-10 text-white font-bold py-2 px-4 rounded" />
    );
  }
  return (
    <div className="flex gap-2">
      <Link
        href="/register"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Up
      </Link>
      <Link
        href="/login"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign In
      </Link>
    </div>
  );
};

export default page;
