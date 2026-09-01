"use client";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: "projects", label: "Projects" },
    { id: "designs", label: "Designs" },
    { id: "writing", label: "Writing" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="flex gap-2 rounded-2xl p-1 glass-panel mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-700 hover:bg-white/40"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}