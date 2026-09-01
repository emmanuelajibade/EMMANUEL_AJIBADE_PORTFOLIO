"use client";

import { useState } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import ProjectsManager from "@/components/admin/ProjectsManager";
import DesignsManager from "@/components/admin/DesignsManager";
import WritingManager from "@/components/admin/WritingManager";
import ProfileManager from "@/components/admin/ProfileManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");

  const sectionTitle: Record<string, string> = {
    projects: "Projects Management",
    designs: "Design Management",
    writing: "Writing Management",
    profile: "Profile Settings",
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary">
          {sectionTitle[activeTab]}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          You are currently managing: {sectionTitle[activeTab]}
        </p>
      </div>

      {activeTab === "projects" && <ProjectsManager />}
      {activeTab === "designs" && <DesignsManager />}
      {activeTab === "writing" && <WritingManager />}
      {activeTab === "profile" && <ProfileManager />}
    </div>
  );
}