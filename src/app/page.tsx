import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import DesignPreview from "@/components/home/DesignPreview";
import FinalCTA from "@/components/home/FinalCTA";
import { getProfile, getPublishedProjects, getDesigns } from "@/lib/data";
import type { Metadata } from "next";
import { publicFacebookUrl, publicGithubUrl } from "@/lib/profile-identity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmanuel-ajibade-portfolio.vercel.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
  description:
    "Emmanuel Ajibade is a tech specialist and software developer creating modern digital products, thoughtful design, and practical software experiences.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Emmanuel Ajibade Portfolio",
    title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    description:
      "Portfolio of Emmanuel Ajibade, a tech specialist and software developer focused on software, design, and modern web experiences.",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: "Emmanuel Ajibade Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    description:
      "Portfolio of Emmanuel Ajibade, a tech specialist and software developer focused on software, design, and modern web experiences.",
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
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Emmanuel Ajibade Portfolio",
        url: siteUrl,
        description: "Personal portfolio of Emmanuel Ajibade, a tech specialist and software developer.",
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        givenName: "Emmanuel",
        familyName: "Ajibade",
        alternateName: "Emmanuel Aduragbemi Ajibade",
        jobTitle: profile.title,
        description: profile.shortIntro,
        url: siteUrl,
        image: profile.profileImage?.url,
        address: profile.location
          ? { "@type": "PostalAddress", addressLocality: profile.location }
          : undefined,
        sameAs: [publicFacebookUrl, publicGithubUrl],
        knowsAbout: profile.skills,
      },
    ],
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