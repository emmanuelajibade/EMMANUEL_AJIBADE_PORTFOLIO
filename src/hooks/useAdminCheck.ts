"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

export function useAdminCheck() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (mounted) {
        setUser(user);
      }
      if (user) {
        const { data } = await supabaseClient
          .from("admins")
          .select("email")
          .eq("email", user.email)
          .single();
        if (mounted) {
          setIsAdmin(!!data);
          setLoading(false);
        }
      } else {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, isAdmin, loading };
}