"use client";

import { supabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    toast.success("Logged out");
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline"
    >
      Logout
    </button>
  );
}