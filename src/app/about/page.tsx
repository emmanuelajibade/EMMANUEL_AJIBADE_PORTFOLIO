import { getProfile } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Reveal from "@/components/home/Reveal";
import ProfileMediaOrb from "@/components/about/ProfileMediaOrb";
import type { Metadata } from "next";
import {
  publicTelegramUrl,
  publicWhatsappUrl,
  publicProfileAlt,
} from "@/lib/profile-identity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmanuel-ajibade-portfolio.vercel.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Emmanuel Ajibade",
  description:
    "Learn more about Emmanuel Ajibade, a tech specialist and software developer building modern software, design-led experiences, and thoughtful digital products.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About Emmanuel Ajibade",
    description:
      "Profile of Emmanuel Ajibade, a tech specialist and software developer creating projects, design work, and practical digital experiences.",
    url: `${siteUrl}/about`,
    type: "website",
  },
};

export default async function AboutPage() {
  const profile = await getProfile();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    givenName: "Emmanuel",
    familyName: "Ajibade",
    alternateName: ["Emmanuel Aduragbemi Ajibade", "Ajibade Emmanuel", "E. A. Ajibade"],
    jobTitle: profile.title,
    description:
      "Emmanuel Ajibade is a tech specialist and software developer focused on modern software, design-led experiences, and meaningful digital products.",
    email: profile.contactEmail,
    telephone: profile.phone,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
    sameAs: profile.socialLinks.map((link) => link.url),
    knowsAbout: [...(profile.skills || []), ...(profile.interests || [])],
    image: profile.profileImage?.url,
    "@id": `${siteUrl}/#person`,
    url: siteUrl,
  };

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `About ${profile.name}`,
    description:
      "Professional profile of Emmanuel Ajibade, a tech specialist and software developer working across software, design, and digital product experiences.",
    url: `${siteUrl}/about`,
    mainEntityOfPage: `${siteUrl}/about`,
    mainEntity: {
      "@id": `${siteUrl}/#person`,
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
    },
  };

  const profileSchema = [personJsonLd, profilePageJsonLd];

  const profileMedia = [
    { type: "image" as const, src: "/assets/img/emma1.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma10.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma11.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma2.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma3.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma4.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma5.jpg", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma6.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma7.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emma8.png", alt: publicProfileAlt },
    { type: "image" as const, src: "/assets/img/emmanuel.png", alt: publicProfileAlt },
    { type: "video" as const, src: "/assets/video/Code_displaying_on_futuristic_te…_202609021237.mp4" },
    { type: "video" as const, src: "/assets/video/Holographic_programming_tags_rot…_202609021244.mp4" },
    { type: "video" as const, src: "/assets/video/Technology_logos_morphing_202609021251.mp4" },
  ];

  // Categorize skills (adjust as needed)
  const skillCategories = {
    Development: ["TypeScript", "React", "Node.js", "Next.js", "Tailwind CSS", "Python", "JavaScript", "HTML", "CSS", "Git"],
    Design: ["UI Design", "Visual Design", "Prototyping"],
    Other: ["Open Source", "Creative Coding"],
  };
  const categorizedSkills = Object.entries(skillCategories)
    .map(([category, skills]) => ({
      category,
      skills: skills.filter((skill) => profile.skills.includes(skill)),
    }))
    .filter((group) => group.skills.length > 0);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <Container>
        <section className="py-16 sm:py-20 lg:py-24">
          {/* Hero Card */}
          <Reveal>
            <div className="glass-panel-strong rounded-[32px] p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 mb-3">
                    Tech Specialist & Software Developer
                  </p>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    About Emmanuel Ajibade
                  </h1>
                  <p className="mt-4 text-lg text-slate-700">
                    Emmanuel Aduragbemi Ajibade is a Tech Specialist &amp; Software Developer based in
                    Lagos, Nigeria, working across software development and design.
                  </p>
                </div>
                <div className="flex justify-center">
                  <ProfileMediaOrb items={profileMedia} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio Section */}
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-[28px] p-6 sm:p-8 mt-8">
              <h2 className="text-2xl font-semibold text-slate-900">Professional profile</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Emmanuel Ajibade builds practical digital experiences with technologies including
                TypeScript, React, Next.js, Node.js, and Tailwind CSS. His work includes
                web applications, developer tools, and portfolio experiences, with projects such as
                Collabe, a collaboration platform, and Cloud Backup, an in-progress tool for managing
                cloud file backups.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Alongside software, he creates posters, brand identity work, social media kits, dashboard
                interfaces, print pieces, and motion graphics. This website brings those projects together
                with design work and writing about learning Next.js and connecting design decisions with
                practical development.
              </p>
            </div>
          </Reveal>

          {/* Skills Section */}
          <Reveal delay={0.15}>
            <div className="glass-panel rounded-[28px] p-6 sm:p-8 mt-8">
              <h2 className="text-2xl font-semibold text-slate-900">Skills & Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {categorizedSkills.map((group) => (
                  <div key={group.category} className="bg-white/50 rounded-2xl p-4">
                    <h3 className="text-lg font-semibold text-slate-800">{group.category}</h3>
                    <ul className="mt-3 space-y-1">
                      {group.skills.map((skill) => (
                        <li key={skill} className="text-sm text-slate-600 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Interests & Location */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="glass-panel rounded-[28px] p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-slate-900">Interests</h2>
                <ul className="mt-4 space-y-2">
                  {profile.interests?.map((interest) => (
                    <li key={interest} className="text-slate-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-panel rounded-[28px] p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-slate-900">Location</h2>
                <p className="mt-4 text-slate-700">{profile.location}</p>
                <p className="mt-2 text-sm text-slate-500">Open to remote work and collaboration.</p>
                <div className="mt-6 space-y-2 text-sm text-slate-700">
                  <a href={`tel:${profile.phone?.replace(/\s/g, "")}`} className="block hover:text-orange-600">
                    Phone: {profile.phone}
                  </a>
                  <a href={publicWhatsappUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-orange-600">
                    WhatsApp: {profile.phone}
                  </a>
                  <a href={publicTelegramUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-orange-600">
                    Telegram: {profile.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Social Links & CTA */}
          <Reveal delay={0.25}>
            <div className="glass-panel rounded-[28px] p-6 sm:p-8 mt-8 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">Connect with me</h2>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-5 py-3 text-sm font-medium text-slate-800 rounded-full"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="glass-button-primary px-8 py-4 text-base font-semibold text-white rounded-full"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </Container>
    </main>
  );
}