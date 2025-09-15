"use client";
import React, { useTransition } from "react";
import { Logout } from "@/actions/auth/auth-actions";
import { Button } from "@/components/ui/button";

const LogoutButton = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await Logout();
    });
  };

  return (
    <Button size="sm" onClick={handleLogout} disabled={isPending} className={className}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
