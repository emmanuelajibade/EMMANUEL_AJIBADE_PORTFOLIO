"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/upload";
import type { WritingPostRow } from "@/types/admin";
import { adminMutation } from "@/lib/admin-api";

interface WritingFormProps {
  post?: WritingPostRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function WritingForm({ post, onSaved, onCancel }: WritingFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    summary: string;
    body: string;
    category: string;
    tags: string;
    date: string;
    cover_image_url: string;
    visibility: string;
    author: string;
    active: boolean;
  }>({
    title: post?.title || "",
    slug: post?.slug || "",
    summary: post?.summary || "",
    body: post?.body || "",
    category: post?.category || "",
    tags: post?.tags?.join(", ") || "",
    date: post?.date || "",
    cover_image_url: post?.cover_image?.url || "",
    visibility: post?.visibility || "published",
    author: post?.author || "Emmanuel Ajibade",
    active: post?.active ?? true,
  });

  const [uploading, setUploading] = useState(false);

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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadToCloudinary(file, "image");
      setFormData((prev) => ({ ...prev, cover_image_url: url }));
      toast.success("Cover image uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      body: formData.body,
      category: formData.category,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      date: formData.date,
      cover_image: formData.cover_image_url
        ? { url: formData.cover_image_url, provider: "cloudinary" }
        : null,
      visibility: formData.visibility,
      author: formData.author,
      active: formData.active,
    };

    try {
      await adminMutation(post ? "update" : "insert", "writing_posts", postData, post?.id);
      toast.success(post ? "Post updated! AI will now know about it." : "Post created! AI will now know about it.");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          {post ? "Edit Writing Post" : "Add New Writing Post"}
        </h3>
        <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Body (Markdown)</label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={10}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleChange}
              className="flex-1 rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste URL or upload"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className="px-4 py-2 text-sm bg-slate-100 rounded-md cursor-pointer hover:bg-slate-200"
            >
              {uploading ? "Uploading..." : "Upload"}
            </label>
          </div>
          {formData.cover_image_url && (
            <div className="mt-2">
              <Image
                src={formData.cover_image_url}
                alt="Cover preview"
                width={192}
                height={96}
                className="h-24 w-auto rounded-md border border-slate-200 object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

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

      <div className="flex gap-3">
        <button
          type="submit"
          className="glass-button-primary px-6 py-2 text-sm font-medium text-white rounded-lg"
        >
          {post ? "Update Post" : "Create Post"}
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