"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "react-hot-toast";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/upload";
import type { ProjectRow } from "@/types/admin";

interface ProjectFormProps {
  project?: ProjectRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSaved, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    short_description: string;
    description: string;
    type: string;
    role: string;
    technologies: string;
    project_status: string;
    visibility: string;
    date: string;
    thumbnail_url: string;
    video_url: string;
    gallery: { url: string; type: "image" | "video"; altText?: string }[];
    features: string;
    github_url: string;
    live_url: string;
    featured: boolean;
    sort_order: number;
    tags: string;
    active: boolean;
  }>({
    title: project?.title || "",
    slug: project?.slug || "",
    short_description: project?.short_description || "",
    description: project?.description || "",
    type: project?.type || "",
    role: project?.role || "",
    technologies: project?.technologies?.join(", ") || "",
    project_status: project?.project_status || "completed",
    visibility: project?.visibility || "published",
    date: project?.date || "",
    thumbnail_url: project?.thumbnail?.url || "",
    video_url: project?.video?.url || "",
    gallery: project?.gallery || [],
    features: project?.features?.join(", ") || "",
    github_url: project?.github_url || "",
    live_url: project?.live_url || "",
    featured: project?.featured || false,
    sort_order: project?.sort_order || 0,
    tags: project?.tags?.join(", ") || "",
    active: project?.active ?? true,
  });

  const [selectedThumbnail, setSelectedThumbnail] = useState<string>(
    project?.thumbnail?.url || ""
  );

  const [uploading, setUploading] = useState<"thumbnail" | "video" | "gallery" | null>(null);
  const [saving, setSaving] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const handleSlugGeneration = () => {
    if (!formData.slug && formData.title) {
      const generated = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generated }));
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setUploading("thumbnail");
    try {
      const url = await uploadToCloudinary(file, "image");
      setFormData((prev) => ({ ...prev, thumbnail_url: url }));
      setSelectedThumbnail(url);
      toast.success("Thumbnail uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file.");
      return;
    }
    setUploading("video");
    try {
      const url = await uploadToCloudinary(file, "video");
      setFormData((prev) => ({ ...prev, video_url: url }));
      toast.success("Video uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading("gallery");
    try {
      const newItems: { url: string; type: "image" | "video"; altText?: string }[] = [];
      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const url = await uploadToCloudinary(file, isVideo ? "video" : "image");
        newItems.push({ url, type: isVideo ? "video" : "image" });
      }
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newItems],
      }));
      // Auto-select first image as thumbnail if none selected yet
      if (!selectedThumbnail && newItems.length > 0) {
        const firstImage = newItems.find((item) => item.type === "image");
        if (firstImage) setSelectedThumbnail(firstImage.url);
      }
      toast.success(`${newItems.length} gallery item(s) uploaded!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeGalleryItem = (index: number) => {
    const removed = formData.gallery[index];
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    if (removed && selectedThumbnail === removed.url) {
      const remainingImages = formData.gallery.filter((item, i) => i !== index && item.type === "image");
      setSelectedThumbnail(remainingImages.length > 0 ? remainingImages[0].url : "");
    }
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
    if (formData.github_url && !/^https?:\/\/.+/.test(formData.github_url)) {
      toast.error("GitHub URL must start with http:// or https://");
      return false;
    }
    if (formData.live_url && !/^https?:\/\/.+/.test(formData.live_url)) {
      toast.error("Live URL must start with http:// or https://");
      return false;
    }
    if (formData.thumbnail_url && !/^https?:\/\/.+/.test(formData.thumbnail_url)) {
      toast.error("Thumbnail URL must start with http:// or https://");
      return false;
    }
    if (formData.video_url && !/^https?:\/\/.+/.test(formData.video_url)) {
      toast.error("Video URL must start with http:// or https://");
      return false;
    }
    if (formData.gallery.some((item) => !/^https?:\/\/.+/.test(item.url))) {
      toast.error("Gallery URLs must start with http:// or https://");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const finalThumbnailUrl = selectedThumbnail || formData.thumbnail_url;

    const projectData = {
      title: formData.title,
      slug: formData.slug,
      short_description: formData.short_description,
      description: formData.description,
      type: formData.type,
      role: formData.role,
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      project_status: formData.project_status,
      visibility: formData.visibility,
      date: formData.date,
      thumbnail: finalThumbnailUrl
        ? { url: finalThumbnailUrl, provider: "cloudinary" }
        : null,
      video: formData.video_url
        ? { url: formData.video_url, provider: "cloudinary" }
        : null,
      gallery: formData.gallery,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      github_url: formData.github_url || null,
      live_url: formData.live_url || null,
      featured: formData.featured,
      sort_order: Number(formData.sort_order),
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      active: formData.active,
    };

    const { error } = project
      ? await supabaseClient.from("projects").update(projectData).eq("id", project.id)
      : await supabaseClient.from("projects").insert(projectData);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(project ? "Project updated!" : "Project created!");
      onSaved();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          {project ? "Edit Project" : "Add New Project"}
        </h3>
        <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>

      {/* Basic Information */}
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleSlugGeneration}
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
            <p className="text-xs text-slate-500 mt-1">Leave blank to auto-generate from title.</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Project Details */}
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Status</label>
            <select
              name="project_status"
              value={formData.project_status}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>
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
        </div>
      </section>

      {/* Technology */}
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Technology & Features</h4>
        <div>
          <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
          <input
            type="text"
            name="features"
            value={formData.features}
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
      </section>

      {/* Media */}
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Media</h4>
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail (upload manually or select from gallery below)</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="flex-1 rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste URL or upload"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
              id="thumbnail-upload"
              ref={thumbnailInputRef}
            />
            <label
              htmlFor="thumbnail-upload"
              className="px-4 py-2 text-sm bg-slate-100 rounded-md cursor-pointer hover:bg-slate-200"
            >
              {uploading === "thumbnail" ? "Uploading..." : "Upload"}
            </label>
          </div>
          {formData.thumbnail_url && (
            <div className="mt-2">
              <Image
                src={formData.thumbnail_url}
                alt="Thumbnail preview"
                width={192}
                height={96}
                className="h-24 w-auto rounded-md border border-slate-200 object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="flex-1 rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste URL or upload"
            />
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload"
              ref={videoInputRef}
            />
            <label
              htmlFor="video-upload"
              className="px-4 py-2 text-sm bg-slate-100 rounded-md cursor-pointer hover:bg-slate-200"
            >
              {uploading === "video" ? "Uploading..." : "Upload"}
            </label>
          </div>
          {formData.video_url && (
            <div className="mt-2">
              <video src={formData.video_url} className="h-24 w-auto rounded-md border border-slate-200" controls muted />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gallery (images & videos) — select one as thumbnail</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*,video/*"
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
              {uploading === "gallery" ? "Uploading..." : "Upload Gallery Items"}
            </label>
          </div>
          {formData.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.gallery.map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl p-2 border ${
                    selectedThumbnail === item.url
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  {item.type === "video" ? (
                    <video src={item.url} className="h-24 w-full object-cover rounded-md border border-slate-200" muted />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.altText || `Gallery item ${index + 1}`}
                      width={192}
                      height={128}
                      className="h-24 w-full object-cover rounded-md border border-slate-200"
                      unoptimized
                    />
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex items-center gap-1 text-xs text-slate-600">
                      <input
                        type="radio"
                        name="thumbnail-select"
                        checked={selectedThumbnail === item.url}
                        onChange={() => {
                          if (item.type === "image") setSelectedThumbnail(item.url);
                        }}
                        disabled={item.type === "video"}
                        className="h-3 w-3"
                      />
                      {item.type === "video" ? "Image only" : "Thumbnail"}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                      aria-label="Remove gallery item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Links */}
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">External Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input
              type="text"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Live URL</label>
            <input
              type="text"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Publishing</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="glass-button-primary px-6 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : project ? "Update Project" : "Create Project"}
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