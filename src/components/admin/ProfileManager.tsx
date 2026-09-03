"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "react-hot-toast";
import type { SocialLink } from "@/types/content";

interface ProfileData {
  name: string;
  title: string;
  short_intro: string;
  bio: string;
  skills: string[];
  interests: string[];
  phone: string;
  location: string;
  contact_email: string;
  social_links: SocialLink[];
}

export default function ProfileManager() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    short_intro: "",
    bio: "",
    skills: "",
    interests: "",
    phone: "",
    location: "",
    contact_email: "",
    social_links: "",
  });

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      const { data, error } = await supabaseClient
        .from("profile")
        .select("*")
        .eq("id", "main")
        .single();

      if (error) {
        toast.error(error.message);
      } else if (active && data) {
        setProfile(data as ProfileData);
        setFormData({
          name: data.name || "",
          title: data.title || "",
          short_intro: data.short_intro || "",
          bio: data.bio || "",
          skills: data.skills?.join(", ") || "",
          interests: data.interests?.join(", ") || "",
          phone: data.phone || "",
          location: data.location || "",
          contact_email: data.contact_email || "",
          social_links: JSON.stringify(data.social_links || []),
        });
      }
    }

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = {
      name: formData.name,
      title: formData.title,
      short_intro: formData.short_intro,
      bio: formData.bio,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(",").map((s) => s.trim()).filter(Boolean),
      phone: formData.phone,
      location: formData.location,
      contact_email: formData.contact_email,
      social_links: JSON.parse(formData.social_links || "[]"),
    };

    const { error } = await supabaseClient.from("profile").update(profileData).eq("id", "main");
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  };

  if (!profile) return <div className="glass-panel rounded-2xl p-6">Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Profile Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Short Intro</label>
        <textarea
          name="short_intro"
          value={formData.short_intro}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={5}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Interests (comma separated)</label>
        <input
          type="text"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contact Email</label>
        <input
          type="email"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Social Links (JSON array)</label>
        <textarea
          name="social_links"
          value={formData.social_links}
          onChange={handleChange}
          rows={5}
          className="w-full rounded-md border border-slate-200 bg-white/60 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Format: {`[{"platform":"Facebook","url":"https://web.facebook.com/profile.php?id=61573178008542"},{"platform":"GitHub Pages","url":"https://emmanuelajibade.github.io"}]`}. LinkedIn is currently unavailable.
        </p>
      </div>

      <button
        type="submit"
        className="glass-button-primary px-6 py-2 text-sm font-medium text-white rounded-lg"
      >
        Save Profile
      </button>
    </form>
  );
}