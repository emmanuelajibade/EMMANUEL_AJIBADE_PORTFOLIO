"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DesignForm from "./DesignForm";
import type { DesignRow } from "@/types/admin";
import { adminMutation, adminQuery } from "@/lib/admin-api";

export default function DesignsManager() {
  const [designs, setDesigns] = useState<DesignRow[]>([]);
  const [editingDesign, setEditingDesign] = useState<DesignRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  async function fetchDesigns() {
    setLoading(true);
    try {
      const loadedDesigns = await adminQuery<DesignRow>("designs");
      setDesigns(loadedDesigns);
      try {
        const draftKey = Object.keys(localStorage).find((key) =>
          key.startsWith("design-form-draft:")
        );
        if (draftKey) {
          const draftDesignId = draftKey.replace("design-form-draft:", "");
          const draftDesign =
            draftDesignId === "new"
              ? null
              : loadedDesigns.find((item) => item.id === draftDesignId);
          if (draftDesignId === "new" || draftDesign) {
            setEditingDesign(draftDesign || null);
            setShowForm(true);
          }
        }
      } catch (storageError) {
        console.error("Unable to inspect saved design drafts:", storageError);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load designs");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    const newActive = !currentActive;
    try {
      await adminMutation("update", "designs", { active: newActive }, id);
      toast.success(newActive ? "Design enabled" : "Design disabled");
      fetchDesigns();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update design");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this design?")) return;
    try {
      await adminMutation("delete", "designs", undefined, id);
      toast.success("Design deleted");
      fetchDesigns();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete design");
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Designs Manager</h2>
        <p className="text-sm text-muted-foreground mt-1">Add, edit, disable, or remove your design works.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-muted-foreground">
          {designs.length} {designs.length === 1 ? "design" : "designs"} total
        </span>
        <button
          onClick={() => {
            setEditingDesign(null);
            setShowForm(true);
          }}
          className="glass-button-primary px-4 py-2 text-sm font-medium text-white rounded-lg"
        >
          + Add New Design
        </button>
      </div>

      {showForm && (
        <DesignForm
          design={editingDesign}
          onSaved={() => {
            setShowForm(false);
            setEditingDesign(null);
            fetchDesigns();
            toast.success("Design saved!");
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingDesign(null);
          }}
        />
      )}

      {loading && <div className="text-center py-8 text-muted-foreground">Loading designs...</div>}

      {!loading && designs.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-muted-foreground">No designs yet.</p>
          <button
            onClick={() => {
              setEditingDesign(null);
              setShowForm(true);
            }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Create your first design
          </button>
        </div>
      )}

      {!loading && designs.length > 0 && (
        <div className="space-y-4">
          {designs.map((design) => (
            <div
              key={design.id}
              className={`p-4 border rounded-xl flex justify-between items-center ${
                design.active ? "border-slate-200 bg-white/40" : "border-red-300 bg-red-50/40"
              }`}
            >
              <div>
                <h3 className="font-semibold text-slate-900">{design.title}</h3>
                <p className="text-sm text-muted-foreground">{design.slug}</p>
                {!design.active && <span className="text-xs text-red-600 font-medium">Disabled</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingDesign(design);
                    setShowForm(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(design.id, design.active)}
                  className={`text-sm hover:underline ${
                    design.active ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {design.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(design.id)}
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