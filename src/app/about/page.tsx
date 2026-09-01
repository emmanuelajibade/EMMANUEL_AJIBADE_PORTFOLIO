import { getProfile } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/home/Reveal";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About – Emmanuel Ajibade",
  description: "Learn more about Emmanuel Ajibade, his skills, background, and what he does.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About – Emmanuel Ajibade",
    description: "Learn more about Emmanuel Ajibade, his skills, background, and what he does.",
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
    jobTitle: profile.title,
    email: profile.contactEmail,
    telephone: profile.phone,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: profile.socialLinks.map((link) => link.url),
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Container>
        <section className="py-16 sm:py-20 lg:py-24">
          {/* Hero Card */}
          <Reveal>
            <div className="glass-panel-strong rounded-[32px] p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 mb-3">
                    About Me
                  </p>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    {profile.name}
                  </h1>
                  <p className="mt-4 text-lg text-slate-700">
                    {profile.shortIntro}
                  </p>
                </div>
                <div className="flex justify-center">
                  {profile.profileImage?.url ? (
                    <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-full overflow-hidden border-4 border-white/50 shadow-xl">
                      <Image
                        src={profile.profileImage.url}
                        alt={profile.profileImage.altText || profile.name}
                        fill
                        className="object-cover"
                        sizes="256px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-48 md:h-64 md:w-64 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <span className="text-6xl font-bold text-slate-500">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio Section */}
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-[28px] p-6 sm:p-8 mt-8">
              <h2 className="text-2xl font-semibold text-slate-900">Biography</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                {profile.bio}
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