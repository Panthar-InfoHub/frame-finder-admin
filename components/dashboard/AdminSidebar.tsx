"use client";
import {
  Home,
  Store,
  Package,
  PackagePlus,
  CircleQuestionMark,
  Contact,
  ShoppingCart,
  IndianRupee,
  Settings2,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-session";
import { Role } from "@/utils/permissions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarSkeleton } from "../ui/custom/Skeleton-loading";
import { NavUser } from "./sidebarfooter";
import { useVendorCategories } from "@/context/vendor-context";

export type NavItem =
  | {
      title: string;
      icon?: React.ElementType;
      url: string;
      badge?: string;
      children?: never;
      requiredCategory?: string[];
    }
  | {
      title: string;
      icon?: React.ElementType;
      children?: NavItem[];
      badge?: string;
      url?: never;
      requiredCategory?: string[];
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
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    icon: Package,
    requiredCategory: ["Product", "Sunglasses", "Accessories", "Reader", "LensSolution"],
    children: [
      {
        title: "Frames",
        url: "/dashboard/products/frames",
        requiredCategory: ["Product"],
      },
      {
        title: "Sunglasses",
        url: "/dashboard/products/sunglasses",
        requiredCategory: ["Sunglasses"],
      },
      {
        title: "Accessories",
        url: "/dashboard/products/accessories",
        requiredCategory: ["Accessories"],
      },
      {
        title: "Readers",
        url: "/dashboard/products/readers",
        requiredCategory: ["Reader"],
      },
      {
        title: "Contact Lens",
        url: "/dashboard/products/contact-lens",
        requiredCategory: ["ContactLens"],
      },
      {
        title: "Color Contact Lens",
        url: "/dashboard/products/contact-lens-color",
        requiredCategory: ["ColorContactLens"],
      },
      {
        title: "Lens Solution",
        url: "/dashboard/products/lens-solution",
        requiredCategory: ["LensSolution"],
      },
    ],
  },
  {
    title: "Prescription Lens",
    icon: PackagePlus,
    requiredCategory: ["LensPackage", "SunglassLensPackage"],
    children: [
      {
        title: "Frames",
        url: "/dashboard/lens-packages/frames",
        requiredCategory: ["LensPackage"],
      },
      {
        title: "Sunglasses",
        url: "/dashboard/lens-packages/sunglasses",
        requiredCategory: ["SunglassLensPackage"],
      },
    ],
  },
  {
    title: "Coupons",
    url: "/dashboard/coupons",
    icon: Ticket,
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: IndianRupee,
  },
  {
    title: "Reviews",
    url: "/dashboard/reviews",
    icon: Contact,
  },
  {
    title: "Setting",
    url: "/dashboard/setting",
    icon: Settings2,
  },
  {
    title: "Help & Support",
    icon: CircleQuestionMark,
    children: [
      {
        title: "Vendor Guidelines",
        url: "/dashboard/help/guidelines",
      },
      {
        title: "Vendor Support",
        url: "/dashboard/help/support",
      },
      {
        title: "Tutorials",
        url: "/dashboard/help/tutorials",
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

function filterLinksByCategories(links: NavItem[], categories: string[]): NavItem[] {
  if (categories.length === 0) return links;

  return links
    .map((link) => {
      // If link has requiredCategory, check if user has any of those categories
      if (link.requiredCategory) {
        const hasAccess = link.requiredCategory.some((cat) => categories.includes(cat));
        if (!hasAccess) return null;
      }

      // If link has children, filter them recursively
      if (link.children) {
        const filteredChildren = filterLinksByCategories(link.children, categories);
        // If no children remain after filtering, hide the parent
        if (filteredChildren.length === 0) return null;
        return { ...link, children: filteredChildren };
      }

      return link;
    })
    .filter((link): link is NavItem => link !== null);
}

function getSidebarLinks(userRole: Role, categories: string[] = []): NavItem[] {
  switch (userRole) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return AdminLinks;
    case "VENDOR":
      return filterLinksByCategories(VendorLinks, categories);
    case "USER":
      return BaseLinks;
    default:
      return [];
  }
}

const isActive = (item: NavItem, pathname: string): boolean => {
  if ("url" in item && item.url) {
    // Exact match for dashboard home
    if (item.url === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other routes, check if pathname starts with the URL followed by / or is exact match
    return pathname === item.url || pathname.startsWith(item.url + "/");
  }
  if ("children" in item && item.children) {
    return item.children.some((child) => isActive(child, pathname));
  }
  return false;
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useSession();
  const { categories, loading: categoriesLoading } = useVendorCategories();
  const navItems = getSidebarLinks(user?.role!, categories);

  if (loading || categoriesLoading) {
    return <SidebarSkeleton />;
  }
  const userDetail = {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.image || "",
  };

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
              <Collapsible
                key={item.title}
                defaultOpen={isActive(item, pathname)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "w-full justify-start gap-3 rounded-lg hover:text-primary-foreground! px-3 py-2 text-sm font-medium hover:bg-primary/10"
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
                              (pathname === sub.url ||
                                pathname.startsWith((sub.url || "") + "/")) &&
                                "bg-primary/10 text-primary-foreground"
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
                    isActive(item, pathname) && "bg-primary/10 text-primary-foreground"
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
        <NavUser user={userDetail} />
      </SidebarFooter>
    </Sidebar>
  );
}
