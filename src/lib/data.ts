import { supabasePublic } from "./supabase-public";
import type { Profile, Project, DesignWork, WritingPost } from "@/types/content";

// Define raw row types (matching Supabase columns)
interface ProfileRow {
  id: string;
  name: string;
  title: string;
  short_intro: string;
  bio: string;
  skills: string[];
  interests: string[];
  profile_image: Profile["profileImage"];
  location: string;
  phone: string;
  social_links: Profile["socialLinks"];
  contact_email: string;
}

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  type: string;
  role: string;
  technologies: string[];
  project_status: Project["projectStatus"];
  visibility: Project["visibility"];
  date: string;
  thumbnail: Project["thumbnail"];
  video: Project["video"];
  screenshots: Project["screenshots"];
  features: Project["features"];
  github_url: string;
  live_url: string;
  featured: boolean;
  sort_order: number;
  tags: string[];
  active: boolean;
  gallery?: Project["gallery"];
}

interface DesignRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: DesignWork["image"];
  description: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
  date: string;
  external_link: string;
  active: boolean;
  gallery?: DesignWork["gallery"];
}

interface WritingPostRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  tags: string[];
  date: string;
  updated_at: string;
  cover_image: WritingPost["coverImage"];
  visibility: WritingPost["visibility"];
  author: string;
  active: boolean;
}

// Mapping functions
function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    shortIntro: row.short_intro,
    bio: row.bio,
    skills: row.skills || [],
    interests: row.interests || [],
    profileImage: row.profile_image,
    location: row.location || undefined,
    phone: row.phone || undefined,
    socialLinks: row.social_links || [],
    contactEmail: row.contact_email,
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    type: row.type,
    role: row.role,
    technologies: row.technologies || [],
    projectStatus: row.project_status,
    visibility: row.visibility,
    date: row.date,
    thumbnail: row.thumbnail,
    video: row.video || undefined,
    screenshots: row.screenshots || [],
    features: row.features || [],
    githubUrl: row.github_url || undefined,
    liveUrl: row.live_url || undefined,
    featured: row.featured,
    order: row.sort_order ?? 0,
    tags: row.tags || [],
    active: row.active ?? true,
    gallery: row.gallery || [],
  };
}

function mapDesign(row: DesignRow): DesignWork {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    image: row.image,
    description: row.description || undefined,
    tags: row.tags || [],
    featured: row.featured ?? false,
    order: row.sort_order ?? 0,
    date: row.date,
    externalLink: row.external_link || undefined,
    active: row.active ?? true,
    gallery: row.gallery || [],
  };
}

function mapWritingPost(row: WritingPostRow): WritingPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    category: row.category || undefined,
    tags: row.tags || [],
    date: row.date,
    updatedAt: row.updated_at || undefined,
    coverImage: row.cover_image || undefined,
    visibility: row.visibility,
    author: row.author,
    active: row.active ?? true,
  };
}

// Data fetching functions (public reads only)
export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabasePublic
    .from("profile")
    .select("*")
    .eq("id", "main")
    .single();
  if (error) throw new Error(error.message);
  return mapProfile(data as ProfileRow);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select("*")
    .eq("visibility", "published")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as ProjectRow[]).map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabasePublic
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("visibility", "published")
    .eq("active", true)
    .maybeSingle();
  if (error) return null;
  if (!data) return null;
  return mapProject(data as ProjectRow);
}

export async function getDesigns(): Promise<DesignWork[]> {
  const { data, error } = await supabasePublic
    .from("designs")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DesignRow[]).map(mapDesign);
}

export async function getDesignBySlug(slug: string): Promise<DesignWork | null> {
  const { data, error } = await supabasePublic
    .from("designs")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) return null;
  if (!data) return null;
  return mapDesign(data as DesignRow);
}

export async function getWritingPosts(): Promise<WritingPost[]> {
  const { data, error } = await supabasePublic
    .from("writing_posts")
    .select("*")
    .eq("visibility", "published")
    .eq("active", true)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as WritingPostRow[]).map(mapWritingPost);
}

export async function getWritingPostBySlug(slug: string): Promise<WritingPost | null> {
  const { data, error } = await supabasePublic
    .from("writing_posts")
    .select("*")
    .eq("slug", slug)
    .eq("visibility", "published")
    .eq("active", true)
    .maybeSingle();
  if (error) return null;
  if (!data) return null;
  return mapWritingPost(data as WritingPostRow);
}