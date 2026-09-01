import type { Project, DesignWork, WritingPost } from "./content";

export interface ProjectRow {
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
  gallery: { url: string; type: "image" | "video"; altText?: string }[];
  screenshots: Project["screenshots"];
  features: Project["features"];
  github_url: string;
  live_url: string;
  featured: boolean;
  sort_order: number;
  tags: string[];
  active: boolean;
}

// ... rest unchanged

export interface DesignRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: DesignWork["image"];
  gallery: { url: string; altText?: string }[];
  description: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
  date: string;
  external_link: string;
  active: boolean;
}

export interface WritingPostRow {
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