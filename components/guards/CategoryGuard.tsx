"use client";

import { useVendorCategories } from "@/context/vendor-context";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

interface CategoryGuardProps {
  children: React.ReactNode;
  requiredCategories: string[];
  featureName?: string;
}

export function CategoryGuard({
  children,
  requiredCategories,
  featureName = "this page",
}: CategoryGuardProps) {
  const { categories, loading: categoriesLoading } = useVendorCategories();
  const { user, loading: userLoading } = useSession();

  // Show loading state
  if (userLoading || categoriesLoading) {
    return <DashboardSkeleton />;
  }

  // Admin/Super Admin have access to everything
  if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  // Check if user has at least one of the required categories
  const hasAccess = requiredCategories.some((category) => categories.includes(category));

  // If no access, show restriction message
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>You don't have permission to access {featureName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/setting">Update Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render the children
  return <>{children}</>;
}
