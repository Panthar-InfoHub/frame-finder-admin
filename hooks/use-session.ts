"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth/session";

export function useSession() {
  const [session, setSession] = useState<{ user: any | null }>({ user: null });
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getSession(); 
    setSession(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { ...session, loading };
}
