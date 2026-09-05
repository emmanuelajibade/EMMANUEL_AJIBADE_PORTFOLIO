import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

const allowedTables = new Set(["projects", "designs", "writing_posts", "profile", "ai_knowledge"]);
const allowedOperations = new Set(["insert", "update", "delete"]);
type AdminTable = "projects" | "designs" | "writing_posts" | "profile" | "ai_knowledge";

async function requireAdmin() {
  const cookieStore = await cookies();
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server component cookies may be read-only.
          }
        },
      },
    }
  );
  const { data: { user } } = await authClient.auth.getUser();
  if (!user?.email) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: admin, error: adminError } = await supabaseServer
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();
  if (adminError) return { error: NextResponse.json({ error: adminError.message }, { status: 500 }) };
  if (!admin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { admin: true };
}

export async function GET(request: Request) {
  const tableName = new URL(request.url).searchParams.get("table");
  if (!tableName || !allowedTables.has(tableName)) {
    return NextResponse.json({ error: "Invalid admin table" }, { status: 400 });
  }

  const authorization = await requireAdmin();
  if (authorization.error) return authorization.error;

  const table = tableName as AdminTable;
  let query = supabaseServer.from(table).select("*");
  if (table === "profile") query = query.eq("id", "main");
  if (table === "projects" || table === "designs") {
    query = query.order("sort_order", { ascending: true });
  } else if (table === "writing_posts") {
    query = query.order("date", { ascending: false });
  } else if (table === "ai_knowledge") {
    query = query.order("importance", { ascending: false });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input = body as {
    operation?: unknown;
    table?: unknown;
    id?: unknown;
    data?: unknown;
  };
  if (
    typeof input.operation !== "string" ||
    typeof input.table !== "string" ||
    !allowedOperations.has(input.operation) ||
    !allowedTables.has(input.table) ||
    (input.operation !== "insert" && typeof input.id !== "string") ||
    (input.operation !== "delete" &&
      (!input.data || typeof input.data !== "object" || Array.isArray(input.data)))
  ) {
    return NextResponse.json({ error: "Invalid admin operation" }, { status: 400 });
  }

  const authorization = await requireAdmin();
  if (authorization.error) return authorization.error;

  const table = input.table as AdminTable;
  let result;
  if (input.operation === "insert") {
    result = await supabaseServer.from(table).insert(input.data as Record<string, unknown>);
  } else if (input.operation === "update") {
    result = await supabaseServer
      .from(table)
      .update(input.data as Record<string, unknown>)
      .eq("id", input.id);
  } else {
    result = await supabaseServer.from(table).delete().eq("id", input.id);
  }
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
