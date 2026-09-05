"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import WritingForm from "./WritingForm";
import type { WritingPostRow } from "@/types/admin";
import { adminMutation, adminQuery } from "@/lib/admin-api";

export default function WritingManager() {
  const [posts, setPosts] = useState<WritingPostRow[]>([]);
  const [editingPost, setEditingPost] = useState<WritingPostRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      setPosts(await adminQuery<WritingPostRow>("writing_posts"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load posts");
    }
    setLoading(false);
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    const newActive = !currentActive;
    try {
      await adminMutation("update", "writing_posts", { active: newActive }, id);
      toast.success(newActive ? "Post enabled" : "Post disabled");
      fetchPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update post");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await adminMutation("delete", "writing_posts", undefined, id);
      toast.success("Post deleted");
      fetchPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete post");
    }

  }

  async function handleToggleVisibility(id: string, currentVisibility: string) {
    const newVisibility = currentVisibility === "published" ? "draft" : "published";
    try {
      await adminMutation("update", "writing_posts", { visibility: newVisibility }, id);
      toast.success(newVisibility === "published" ? "Post published" : "Post moved to draft");
      fetchPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update post visibility");
    }
  }

  function getStatusBadge(post: WritingPostRow) {
    if (!post.active) return <span className="text-xs text-red-600 font-medium">Disabled</span>;
    if (post.visibility === "draft") return <span className="text-xs text-yellow-600 font-medium">Draft</span>;
    return <span className="text-xs text-green-600 font-medium">Published</span>;
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Writing Manager</h2>
        <p className="text-sm text-slate-500 mt-1">Add, edit, disable, or remove your writing posts.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-slate-500">
          {posts.length} {posts.length === 1 ? "post" : "posts"} total
        </span>
        <button
          onClick={() => {
            setEditingPost(null);
            setShowForm(true);
          }}
          className="glass-button-primary px-4 py-2 text-sm font-medium text-white rounded-lg"
        >
          + Add New Post
        </button>
      </div>

      {showForm && (
        <WritingForm
          post={editingPost}
          onSaved={() => {
            setShowForm(false);
            setEditingPost(null);
            fetchPosts();
            toast.success("Post saved!");
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}

      {loading && <div className="text-center py-8 text-slate-500">Loading posts...</div>}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-slate-500">No writing posts yet.</p>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowForm(true);
            }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Create your first post
          </button>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center gap-4 ${
                post.active ? "border-slate-200 bg-white/40" : "border-red-300 bg-red-50/40"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900">{post.title}</h3>
                  {getStatusBadge(post)}
                </div>
                <p className="text-sm text-slate-500">{post.slug}</p>
                {post.category && (
                  <p className="text-xs text-slate-500 mt-1">Category: {post.category}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingPost(post);
                    setShowForm(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(post.id, post.active)}
                  className={`text-sm hover:underline ${
                    post.active ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {post.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleToggleVisibility(post.id, post.visibility)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  {post.visibility === "published" ? "Make Draft" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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