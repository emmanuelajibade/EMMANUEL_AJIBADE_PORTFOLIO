"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "react-hot-toast";
import ProjectForm from "./ProjectForm";
import type { ProjectRow } from "@/types/admin";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else if (active) {
        setProjects(data as ProjectRow[]);
        setLoading(false);
      }
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  async function reloadProjects() {
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setProjects(data as ProjectRow[]);
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    const newActive = !currentActive;
    const { error } = await supabaseClient
      .from("projects")
      .update({ active: newActive })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(newActive ? "Project enabled" : "Project disabled");
      reloadProjects();
    }
  }

  async function handleToggleVisibility(id: string, currentVisibility: string) {
    const newVisibility = currentVisibility === "published" ? "draft" : "published";
    const { error } = await supabaseClient
      .from("projects")
      .update({ visibility: newVisibility })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(newVisibility === "published" ? "Project published" : "Project moved to draft");
      reloadProjects();
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const { error } = await supabaseClient.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted");
      reloadProjects();
    }
    setDeletingId(null);
  }

  function getStatusBadge(project: ProjectRow) {
    if (!project.active) return <span className="text-xs text-red-600 font-medium">Disabled</span>;
    if (project.visibility === "draft") return <span className="text-xs text-yellow-600 font-medium">Draft</span>;
    return <span className="text-xs text-green-600 font-medium">Published</span>;
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Projects Manager</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add, edit, disable, publish, or remove your projects.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? "project" : "projects"} total
        </span>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="glass-button-primary px-4 py-2 text-sm font-medium text-white rounded-lg"
        >
          + Add New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSaved={() => {
            setShowForm(false);
            setEditingProject(null);
            reloadProjects();
            toast.success("Project saved!");
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {loading && <div className="text-center py-8 text-muted-foreground">Loading projects...</div>}

      {!loading && projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-muted-foreground">No projects yet.</p>
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Create your first project
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center gap-4 ${
                project.active ? "border-slate-200 bg-white/40" : "border-red-300 bg-red-50/40"
              }`}
            >
              {project.thumbnail?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail.url}
                  alt={project.title}
                  className="w-24 h-16 object-cover rounded-md border border-slate-200"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900">{project.title}</h3>
                  {getStatusBadge(project)}
                  {project.featured && <span className="text-xs text-blue-600 font-medium">Featured</span>}
                </div>
                <p className="text-sm text-muted-foreground">{project.slug}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {project.project_status} · Order: {project.sort_order}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setEditingProject(project);
                    setShowForm(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(project.id, project.active)}
                  className={`text-sm hover:underline ${
                    project.active ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {project.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleToggleVisibility(project.id, project.visibility)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  {project.visibility === "published" ? "Make Draft" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={deletingId === project.id}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === project.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}