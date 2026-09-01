export type Provider = "cloudinary" | "imagekit" | "external";

export interface MediaAsset {
  url: string;
  provider: Provider;
  publicId?: string;
  width: number;
  height: number;
  format?: string;
  altText?: string;
  caption?: string;
  duration?: number;
}

export interface GalleryItem {
  url: string;
  type: "image" | "video";
  altText?: string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: MediaAsset;
  noIndex?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  shortIntro: string;
  bio: string;
  skills: string[];
  interests?: string[];
  profileImage: MediaAsset;
  location?: string;
  phone?: string;
  socialLinks: SocialLink[];
  contactEmail: string;
  seo?: SeoMetadata;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  type: string;
  role: string;
  technologies: string[];
  projectStatus: "in-progress" | "completed" | "archived";
  visibility: "draft" | "published";
  date: string;
  thumbnail: MediaAsset;
  video?: MediaAsset;
  screenshots?: MediaAsset[];
  features?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  tags: string[];
  seo?: SeoMetadata;
  active: boolean;
  gallery?: GalleryItem[];   // NEW: gallery items (images/videos)
}

export interface DesignWork {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: MediaAsset;
  description?: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
  date: string;
  externalLink?: string;
  seo?: SeoMetadata;
  active?: boolean;
  gallery?: GalleryItem[];
}

export interface WritingPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category?: string;
  tags: string[];
  date: string;
  updatedAt?: string;
  coverImage?: MediaAsset;
  visibility: "draft" | "published";
  author: string;
  seo?: SeoMetadata;
  active?: boolean;
}