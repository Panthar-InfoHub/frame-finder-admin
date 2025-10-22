"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDown,
  KeyRound,
  Lock,
  LogOut,
  UserRoundMinus
} from "lucide-react";

import { useState } from "react";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";
import { ChangePasswordModal } from "./passwordchange-modal";
export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg"> {user.name.split(" ")[0].slice(0, 3).toUpperCase() || user.email.split(" ")[0].slice(0, 2).toUpperCase()} </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg"> {user.name.split(" ")[0].slice(0, 3).toUpperCase() || user.email.split(" ")[0].slice(0, 2).toUpperCase()} </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button className="bg-transparent hover:bg-transparent" onClick={() => setIsModalOpen(true)}><Lock /> Change Password</Button>
            </DropdownMenuItem>

            {/* TODO : Enable 2fa and Deactivate account in future */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRoundMinus />
              Deactive Account
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <KeyRound />
              Two Factor Authentication
            </DropdownMenuItem>


            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <LogoutButton className="w-full bg-transparent hover:bg-transparent pr-43" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </SidebarMenu>
  );
}
