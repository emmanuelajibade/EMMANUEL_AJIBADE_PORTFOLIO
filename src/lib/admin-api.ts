export type AdminTable = "projects" | "designs" | "writing_posts" | "profile" | "ai_knowledge";

interface AdminMutationResponse {
  error?: string;
}

export async function adminMutation(
  operation: "insert" | "update" | "delete",
  table: AdminTable,
  data?: Record<string, unknown>,
  id?: string
): Promise<void> {
  const response = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation, table, data, id }),
  });
  const result: AdminMutationResponse = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Admin operation failed");
  }
}

export async function adminQuery<T>(table: AdminTable): Promise<T[]> {
  const response = await fetch(`/api/admin/content?table=${encodeURIComponent(table)}`);
  const result: { data?: T[]; error?: string } = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to load admin content");
  return result.data || [];
}
