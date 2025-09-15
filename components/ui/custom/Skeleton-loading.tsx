import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";


export const DashboardSkeleton = () => {
  return (
    <div>
      <div className="p-4 space-y-4 ">
        <Skeleton className="h-8 w-1/4 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg shadow">
              <Skeleton className="h-6 w-3/4 mb-4 rounded" />
              <Skeleton className="h-4 w-full mb-2 rounded" />
              <Skeleton className="h-4 w-5/6 mb-2 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>

        <div>
          <Skeleton className="h-6 w-1/4 mb-4 rounded" />

          <Skeleton className="h-52 flex-1 w-full mb-2 rounded" />
        </div>
      </div>
    </div>
  );
};

export function SidebarSkeleton() {
  return (
    <Sidebar className="border-r [&_div[data-slot='skeleton']]:bg-muted [&_div[data-slot='skeleton']]:border-2">
      {/* Header */}
      <SidebarHeader className="border-b px-6 py-4 h-16 ">
        <div className="flex items-center gap-2 h-full w-full">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex flex-col gap-1  w-full">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
      </SidebarHeader>

      {/* Nav links */}
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs p-0 font-medium text-muted-foreground mb-2">
            <Skeleton className="h-4 w-20" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 w-full ">
                  <Skeleton className="h-6 w-6 rounded shrink-0" />
                  <Skeleton className="h-5 w-full rounded-none" />
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <div className="flex flex-col gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 w-full ">
              <Skeleton className="h-6 w-6 rounded shrink-0" />
              <Skeleton className="h-8 w-full rounded-none" />
            </div>
          ))}
        </div> */}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-28" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
