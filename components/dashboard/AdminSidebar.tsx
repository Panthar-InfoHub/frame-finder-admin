"use client"
import {
    Calendar,
    Home,
    Store,
    Users,
    Settings,
    BarChart3,
    Package,
    MessageSquare,
    Bell,
    Search,
    FileText,
    Shield,
    PlusCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Main navigation items
const navItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
        badge: null,
    },
    {
        title: "Vendors",
        url: "/admin/vendors",
        icon: Store,
        badge: null,
    },
    {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
        badge: null,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: Package,
        badge: "12",
    },
    {
        title: "Messages",
        url: "/admin/messages",
        icon: MessageSquare,
        badge: "3",
    },
    {
        title: "Notifications",
        url: "/admin/notifications",
        icon: Bell,
        badge: "5",
    },
]

// Quick actions
const quickActions = [
    {
        title: "Add Vendor",
        url: "/register-vendor",
        icon: PlusCircle,
    },
    {
        title: "Reports",
        url: "/admin/reports",
        icon: FileText,
    },
    {
        title: "Search",
        url: "/admin/search",
        icon: Search,
    },
]

// Admin tools
const adminTools = [
    {
        title: "User Management",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Security",
        url: "/admin/security",
        icon: Shield,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar className="border-r">
            <SidebarHeader className="border-b px-6 py-4 h-16">
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
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                            pathname === item.url && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="ml-auto h-5 text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Actions */}
                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
                        Quick Actions
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {quickActions.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                            pathname === item.url && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Admin Tools */}
                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
                        Administration
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {adminTools.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                            pathname === item.url && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">Admin User</span>
                        <span className="text-xs text-muted-foreground truncate">admin@framefinder.com</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}