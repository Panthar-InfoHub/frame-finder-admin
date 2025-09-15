"use client";
import { Home, Store, Settings, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";
import { Role } from "@/utils/permissions";
import { SidebarSkeleton } from "../ui/custom/Skeleton-loading";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string;
}

const BaseLinks: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

const CommonLinks: NavItem[] = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

const VendorLinks: NavItem[] = [
  ...BaseLinks,
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
    badge: "New",
  },
  ...CommonLinks,
];
const AdminLinks: NavItem[] = [
  ...BaseLinks,
  {
    title: "Vendors",
    url: "/dashboard/vendors",
    icon: Store,
    badge: "5",
  },
  ...CommonLinks,
];

function getSidebarLinks(userRole: Role): NavItem[] {
  switch (userRole) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return AdminLinks;
    case "VENDOR":
      return VendorLinks;
    case "USER":
      return [...BaseLinks, ...CommonLinks];
    default:
      return [];
  }
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useSession();
  const navItems = getSidebarLinks(user?.role!);

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-4 h-16">
        <div className="flex items-center  gap-2 h-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Frame Finder</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.url && "bg-primary/10 text-accent-foreground"
                )}
              >
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item?.badge && (
                    <Badge variant="default" className="ml-auto h-5 text-xs">
                      {item?.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || "/placeholders/avatar.svg"} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{user?.name}</span>
            <span className="text-sm text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
