import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import LogoutButton from "@/components/admin/LogoutButton";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, can't set cookies
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user's email is in admins table
  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .single();

  if (!admin) {
    redirect("/");
  }

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b border-border">
        <span className="font-semibold">Admin Panel</span>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}