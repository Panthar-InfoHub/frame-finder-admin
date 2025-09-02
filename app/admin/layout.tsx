import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AdminSidebar"
import LogoutButton from "@/components/dashboard/LogoutButton"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <header className="flex h-10 bg-accent  justify-between w-full items-center px-2">
                    <SidebarTrigger />
                    <LogoutButton />
                </header>
                <div className="p-2 flex-1">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}