import { supabasePublic } from "@/lib/supabase-public";
import type { Profile, Project, DesignWork, WritingPost } from "@/types/content";
import type { AIKnowledge } from "@/types/ai";
import { normalizePublicSocialLinks, publicPhone } from "@/lib/profile-identity";

export async function getPublicAIKnowledge(): Promise<AIKnowledge[]> {
  const { data, error } = await supabasePublic
    .from("ai_knowledge")
    .select("*")
    .eq("visibility", "public")
    .eq("active", true)
    .order("importance", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPublicProfile(): Promise<Profile | null> {
  const { data, error } = await supabasePublic
    .from("profile")
    .select("*")
    .eq("id", "main")
    .single();
  if (error) return null;
  const profile = data as Record<string, unknown>;

  return {
    id: String(profile.id || "main"),
    name: String(profile.name || "Emmanuel Ajibade"),
    title: String(profile.title || "Tech Specialist & Software Developer"),
    shortIntro: String(profile.short_intro || ""),
    bio: String(profile.bio || ""),
    skills: Array.isArray(profile.skills) ? (profile.skills as string[]) : [],
    interests: Array.isArray(profile.interests) ? (profile.interests as string[]) : [],
    profileImage: (profile.profile_image as Profile["profileImage"]) || null,
    location: (profile.location as string) || undefined,
    phone: publicPhone,
    socialLinks: normalizePublicSocialLinks(
      Array.isArray(profile.social_links) ? (profile.social_links as Profile["socialLinks"]) : []
    ),
    contactEmail: String(profile.contact_email || ""),
  };
}

export async function getPublicProjects(): Promise<Project[]> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select("*")
    .eq("visibility", "published")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPublicDesigns(): Promise<DesignWork[]> {
  const { data, error } = await supabasePublic
    .from("designs")
    .select("*")
    .eq("active", true);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPublicWriting(): Promise<WritingPost[]> {
  const { data, error } = await supabasePublic
    .from("writing_posts")
    .select("*")
    .eq("visibility", "published")
    .eq("active", true);
  if (error) throw new Error(error.message);
  return data || [];
}

// Simple relevance filter based on keywords (null-safe)
export function filterRelevantKnowledge(knowledge: AIKnowledge[], query: string): AIKnowledge[] {
  const lower = query.toLowerCase();
  return knowledge.filter(k =>
    (k.title || "").toLowerCase().includes(lower) ||
    (k.content || "").toLowerCase().includes(lower) ||
    (Array.isArray(k.tags) ? k.tags : []).some((t: string) => lower.includes((t || "").toLowerCase()))
  );
}