import { AppSidebar } from "@/components/dashboard/AdminSidebar";
import LogoutButton from "@/components/dashboard/LogoutButton";
import ThemeToggle from "@/components/dashboard/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorProvider } from "@/context/vendor-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VendorProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </main>
      </SidebarProvider>
    </VendorProvider>
  );
}
