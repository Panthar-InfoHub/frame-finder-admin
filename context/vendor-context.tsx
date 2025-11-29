"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "@/hooks/use-session";
import { getVendorById } from "@/actions/vendors/vendors";

interface VendorContextType {
  categories: string[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    if (!user?.id || user?.role !== "VENDOR") {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getVendorById(user.id);

      if (response.success && response.data?.categories) {
        setCategories(response.data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching vendor categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user?.id]);

  const refreshCategories = async () => {
    await fetchCategories();
  };

  return (
    <VendorContext.Provider value={{ categories, loading, refreshCategories }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendorCategories() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error("useVendorCategories must be used within a VendorProvider");
  }
  return context;
}
