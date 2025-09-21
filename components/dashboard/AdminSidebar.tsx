"use client";
import { Home, Store, Package, PackagePlus, Glasses, Eye, Sun } from "lucide-react";
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
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";
import { Role } from "@/utils/permissions";
import { SidebarSkeleton } from "../ui/custom/Skeleton-loading";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { NavUser } from "./sidebarfooter";

export type NavItem =
  | {
      title: string;
      icon?: React.ElementType;
      url: string;
      badge?: string;
      children?: never;
    }
  | {
      title: string;
      icon?: React.ElementType;
      children: NavItem[];
      badge?: string;
      url?: never;
    };
    
const BaseLinks: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

const VendorLinks: NavItem[] = [
  ...BaseLinks,
  {
    title: "Products",
    // url: "/dashboard/products",
    icon: Package,
    children: [
      {
        title: "Frames",
        url: "/dashboard/products/frames",
      },
      {
        title: "Sunglasses",
        url: "/dashboard/products/sunglasses",
      },
      {
        title: "Accessories",
        url: "/dashboard/products/accessories",
      },
      {
        title: "Contact Lens",
        url: "/dashboard/products/contact-lens",
      },
    ],
  },
  {
    title: "Lens Packages",
    icon: PackagePlus,
    children: [
      {
        title: "Frames",
        url: "/dashboard/lens-packages/frames",
      },
      {
        title: "Sunglasses",
        url: "/dashboard/lens-packages/sunglasses",
      },
    ],
  },
];
const AdminLinks: NavItem[] = [
  ...BaseLinks,
  {
    title: "Vendors",
    url: "/dashboard/vendors",
    icon: Store,
    badge: "5",
  },
];

function getSidebarLinks(userRole: Role): NavItem[] {
  switch (userRole) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return AdminLinks;
    case "VENDOR":
      return VendorLinks;
    case "USER":
      return BaseLinks;
    default:
      return [];
  }
}

const isActive = (item: NavItem, pathname: string): boolean => {
  if ("url" in item && item.url) {
    return pathname === item.url;
  }
  if ("children" in item && item.children) {
    return item.children.some((child) => isActive(child, pathname));
  }
  return false;
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useSession();
  const navItems = getSidebarLinks(user?.role!);

  if (loading) {
    return <SidebarSkeleton />;
  }
  const userDetail = {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.image || ""
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
          {navItems.map((item) =>
            item.children ? (
              <Collapsible key={item.title} defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "w-full justify-start gap-3 rounded-lg hover:text-primary-foreground! px-3 py-2 text-sm font-medium hover:bg-primary/10 "
                        // isActive(item, pathname) && "bg-primary/10 text-primary-foreground"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                      {item?.badge && (
                        <Badge variant="default" className="ml-auto h-5 text-xs">
                          {item?.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((sub) => (
                        <SidebarMenuItem key={sub.title}>
                          <Link
                            href={sub.url || "#"}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary-foreground",
                              pathname === sub.url && "bg-primary/10 text-primary-foreground"
                            )}
                          >
                            {sub.icon && <sub.icon className="h-4 w-4" />}
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary-foreground",
                    pathname === item.url && "bg-primary/10 text-primary-foreground"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                    {item?.badge && (
                      <Badge variant="default" className="ml-auto h-5 text-xs">
                        {item?.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser user = {userDetail}/>
      </SidebarFooter>
    </Sidebar>
  );
}
