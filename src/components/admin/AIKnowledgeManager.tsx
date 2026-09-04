"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "react-hot-toast";
import AIKnowledgeForm from "./AIKnowledgeForm";

export default function AIKnowledgeManager() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseClient
        .from("ai_knowledge")
        .select("*")
        .order("importance", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setItems(data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch knowledge.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleToggleActive(id: string, currentActive: boolean) {
    const newActive = !currentActive;
    const { error } = await supabaseClient
      .from("ai_knowledge")
      .update({ active: newActive })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(newActive ? "Enabled" : "Disabled");
      fetchItems();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this knowledge?")) return;
    const { error } = await supabaseClient.from("ai_knowledge").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      fetchItems();
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">AI Knowledge</h2>
        <p className="text-sm text-slate-500 mt-1">
          Add personal facts the AI can use to answer questions about you.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-slate-500">{items.length} entries</span>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="glass-button-primary px-4 py-2 text-sm font-medium text-white rounded-lg"
        >
          + Add Knowledge
        </button>
      </div>

      {showForm && (
        <AIKnowledgeForm
          knowledge={editing}
          onSaved={() => {
            setShowForm(false);
            setEditing(null);
            fetchItems();
            toast.success("Saved!");
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {loading && <div className="text-center py-8 text-slate-500">Loading...</div>}

      {!loading && error && (
        <div className="text-center py-12 border-2 border-dashed border-red-300 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchItems}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-slate-500">No knowledge yet. Add some!</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center gap-4 ${
                item.active ? "border-slate-200 bg-white/40" : "border-red-300 bg-red-50/40"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <span className="text-xs bg-slate-100 rounded-full px-2 py-0.5">{item.category}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${item.visibility === "public" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.visibility}
                  </span>
                  {!item.active && <span className="text-xs text-red-600 font-medium">Disabled</span>}
                </div>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.content}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditing(item);
                    setShowForm(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(item.id, item.active)}
                  className={`text-sm hover:underline ${item.active ? "text-yellow-600" : "text-green-600"}`}
                >
                  {item.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}