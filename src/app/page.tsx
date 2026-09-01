import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import DesignPreview from "@/components/home/DesignPreview";
import FinalCTA from "@/components/home/FinalCTA";
import { getProfile, getPublishedProjects, getDesigns } from "@/lib/data";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
  description: "Portfolio of Emmanuel Ajibade, a tech specialist and software developer with a passion for design.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Emmanuel Ajibade Portfolio",
    title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    description: "Portfolio of Emmanuel Ajibade, a tech specialist and software developer with a passion for design.",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: "Emmanuel Ajibade Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    description: "Portfolio of Emmanuel Ajibade, a tech specialist and software developer with a passion for design.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default async function Home() {
  const [profile, projects, designs] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
    getDesigns(),
  ]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Emmanuel Ajibade Portfolio",
    url: siteUrl,
    description: "Personal portfolio of Emmanuel Ajibade, a tech specialist and software developer.",
    author: { "@type": "Person", name: "Emmanuel Ajibade" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero profile={profile} />
      <FeaturedProjects projects={projects} />
      <DesignPreview designs={designs} />
      <FinalCTA />
    </main>
  );
}