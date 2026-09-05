"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import type { AIKnowledge } from "@/types/ai";
import { adminMutation } from "@/lib/admin-api";

interface AIKnowledgeFormProps {
  knowledge?: AIKnowledge | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function AIKnowledgeForm({ knowledge, onSaved, onCancel }: AIKnowledgeFormProps) {
  const [formData, setFormData] = useState({
    category: knowledge?.category || "background",
    title: knowledge?.title || "",
    content: knowledge?.content || "",
    visibility: knowledge?.visibility || "public",
    importance: knowledge?.importance || 0,
    tags: knowledge?.tags?.join(", ") || "",
    active: knowledge?.active ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      category: formData.category,
      title: formData.title,
      content: formData.content,
      visibility: formData.visibility,
      importance: Number(formData.importance),
      tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      active: formData.active,
    };

    try {
      await adminMutation(knowledge ? "update" : "insert", "ai_knowledge", data, knowledge?.id);
      toast.success("Knowledge saved!");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save knowledge");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          {knowledge ? "Edit Knowledge" : "Add Knowledge"}
        </h3>
        <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="identity">Identity</option>
            <option value="background">Background</option>
            <option value="education">Education</option>
            <option value="learning">Learning</option>
            <option value="career">Career</option>
            <option value="skills">Skills</option>
            <option value="technology">Technology</option>
            <option value="projects">Projects</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="interests">Interests</option>
            <option value="goals">Goals</option>
            <option value="achievements">Achievements</option>
            <option value="contact">Contact</option>
            <option value="faq">FAQ</option>
            <option value="preferences">Preferences</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          required
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Importance</label>
          <input
            type="number"
            name="importance"
            value={formData.importance}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="rounded border-slate-300"
            />
            Active
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="glass-button-primary px-6 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : knowledge ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="glass-button px-6 py-2 text-sm font-medium text-slate-700 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}