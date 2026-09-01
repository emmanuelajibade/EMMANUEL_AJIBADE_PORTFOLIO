import { getProfile } from "@/lib/data";
import Container from "@/components/layout/Container";
import Reveal from "@/components/home/Reveal";
import ContactForm from "./ContactForm";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact – Emmanuel Ajibade",
  description: "Get in touch with Emmanuel Ajibade for project inquiries or collaborations.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Contact – Emmanuel Ajibade",
    description: "Get in touch with Emmanuel Ajibade for project inquiries or collaborations.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

export default async function ContactPage() {
  const profile = await getProfile();

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Emmanuel Ajibade",
    description: "Get in touch with Emmanuel Ajibade for project inquiries or collaborations.",
    url: `${siteUrl}/contact`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Container>
        <section className="py-16 sm:py-20 lg:py-24">
          <Reveal>
            <header className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 mb-3">
                Contact
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Let&apos;s work together
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                I&apos;m open to new opportunities, collaborations, and ideas.
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct Contact */}
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-[28px] p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Direct Contact
                </h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </h3>
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="mt-2 block text-lg text-slate-800 hover:text-orange-600 transition-colors"
                    >
                      {profile.contactEmail}
                    </a>
                  </div>
                  {profile.phone && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Phone / WhatsApp
                      </h3>
                      <a
                        href={`tel:${profile.phone.replace(/\s/g, "")}`}
                        className="mt-2 block text-lg text-slate-800 hover:text-orange-600 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </h3>
                    <p className="mt-2 text-slate-800">{profile.location}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-slate-900">Social</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {profile.socialLinks.map((link: any) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button px-5 py-2 text-sm font-medium text-slate-800 rounded-full"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal delay={0.2}>
              <ContactForm profile={profile} />
            </Reveal>
          </div>
        </section>
      </Container>
    </main>
  );
}