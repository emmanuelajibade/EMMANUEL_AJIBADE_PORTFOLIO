"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "react-hot-toast";
import { uploadToImageKit } from "@/lib/upload";
import type { DesignRow } from "@/types/admin";

interface DesignFormProps {
  design?: DesignRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

interface DesignFormData {
  title: string;
  slug: string;
  category: string;
  image_url: string;
  description: string;
  tags: string;
  featured: boolean;
  sort_order: number;
  date: string;
  external_link: string;
  active: boolean;
  gallery: { url: string; altText?: string }[];
}

function getDraftKey(designId?: string) {
  return `design-form-draft:${designId || "new"}`;
}

export default function DesignForm({ design, onSaved, onCancel }: DesignFormProps) {
  const [formData, setFormData] = useState<DesignFormData>({
    title: design?.title || "",
    slug: design?.slug || "",
    category: design?.category || "",
    image_url: design?.image?.url || "",
    description: design?.description || "",
    tags: design?.tags?.join(", ") || "",
    featured: design?.featured || false,
    sort_order: design?.sort_order || 0,
    date: design?.date || "",
    external_link: design?.external_link || "",
    active: design?.active ?? true,
    gallery: design?.gallery || [],
  });

  const [uploading, setUploading] = useState<"image" | "gallery" | null>(null);
  const [saving, setSaving] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const draftKey = getDraftKey(design?.id);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsedDraft: DesignFormData = JSON.parse(savedDraft);
        setFormData(parsedDraft);
      }
    } catch (error) {
      console.error("Unable to restore design draft:", error);
    } finally {
      setDraftLoaded(true);
    }
  }, [draftKey]);

  useEffect(() => {
    if (!draftLoaded) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(formData));
    } catch (error) {
      console.error("Unable to save design draft:", error);
    }
  }, [draftKey, draftLoaded, formData]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.error("Unable to clear design draft:", error);
    }
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setUploading("image");
    try {
      const url = await uploadToImageKit(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      toast.error("Only image files can be added to the gallery.");
    }
    if (imageFiles.length === 0) return;
    setUploading("gallery");
    const newItems: { url: string; altText?: string }[] = [];
    try {
      for (const file of imageFiles) {
        const url = await uploadToImageKit(file);
        newItems.push({ url });
      }
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newItems],
      }));
      toast.success(`${newItems.length} image(s) added to gallery!`);
    } catch (err) {
      if (newItems.length > 0) {
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...newItems] }));
        toast.error(
          `${newItems.length} of ${imageFiles.length} gallery images uploaded. ${err instanceof Error ? err.message : "The remaining upload failed."}`
        );
        return;
      }
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const normalizedSlug = formData.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (!normalizedSlug) {
      toast.error("Slug must contain letters or numbers.");
      setSaving(false);
      return;
    }

    const designData = {
      title: formData.title,
      slug: normalizedSlug,
      category: formData.category,
      image: formData.image_url
        ? { url: formData.image_url, provider: "imagekit" }
        : null,
      description: formData.description,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: formData.featured,
      sort_order: Number(formData.sort_order),
      date: formData.date,
      external_link: formData.external_link || null,
      active: formData.active,
      gallery: formData.gallery,
    };

    const { error } = design
      ? await supabaseClient.from("designs").update(designData).eq("id", design.id)
      : await supabaseClient.from("designs").insert(designData);

    if (error) toast.error(error.message);
    else {
      clearDraft();
      toast.success(design ? "Design updated! AI will now know about it." : "Design created! AI will now know about it.");
      onSaved();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          {design ? "Edit Design" : "Add New Design"}
        </h3>
        <button type="button" onClick={() => { clearDraft(); onCancel(); }} className="text-sm text-slate-500 hover:text-slate-700">
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
        <label className="block text-sm font-medium mb-1">Main Image</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="flex-1 rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste URL or upload"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            ref={imageInputRef}
          />
          <label
            htmlFor="image-upload"
            className="px-4 py-2 text-sm bg-slate-100 rounded-md cursor-pointer hover:bg-slate-200"
          >
            {uploading === "image" ? "Uploading..." : "Upload"}
          </label>
        </div>
        {formData.image_url && (
          <div className="mt-2">
            <Image
              src={formData.image_url}
              alt="Main image preview"
              width={192}
              height={96}
              className="h-24 w-auto rounded-md border border-slate-200 object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gallery (multiple images)</label>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
            id="gallery-upload"
            ref={galleryInputRef}
          />
          <label
            htmlFor="gallery-upload"
            className="px-4 py-2 text-sm bg-slate-100 rounded-md cursor-pointer hover:bg-slate-200"
          >
            {uploading === "gallery" ? "Uploading..." : "Upload Gallery"}
          </label>
        </div>
        {formData.gallery.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {formData.gallery.map((item, index) => (
              <div key={index} className="relative">
                <Image
                  src={item.url}
                  alt={`Gallery item ${index + 1}`}
                  width={192}
                  height={128}
                  className="h-24 w-full object-cover rounded-md border border-slate-200"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  aria-label="Remove gallery item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input
            type="number"
            name="sort_order"
            value={formData.sort_order}
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
          <label className="block text-sm font-medium mb-1">External Link</label>
          <input
            type="text"
            name="external_link"
            value={formData.external_link}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="rounded border-slate-300"
          />
          Featured
        </label>
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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="glass-button-primary px-6 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : design ? "Update Design" : "Create Design"}
        </button>
        <button
          type="button"
          onClick={() => { clearDraft(); onCancel(); }}
          className="glass-button px-6 py-2 text-sm font-medium text-slate-700 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}