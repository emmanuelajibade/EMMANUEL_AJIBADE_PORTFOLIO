import { getDesignBySlug, getDesigns } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MediaCarousel from "@/components/home/MediaCarousel";
import Reveal from "@/components/home/Reveal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const designs = await getDesigns();
    return designs.map((d) => ({ slug: d.slug }));
  } catch (error) {
    console.error("Error fetching designs for static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = await getDesignBySlug(slug);
  if (!work) return { title: "Design Not Found – Emmanuel Ajibade" };
  return {
    title: work.title,
    description: work.description || work.title,
    alternates: { canonical: `${siteUrl}/design/${work.slug}` },
    openGraph: {
      title: `${work.title} – Emmanuel Ajibade`,
      description: work.description || work.title,
      url: `${siteUrl}/design/${work.slug}`,
      type: "article",
      images: work.image?.url?.startsWith("http") ? [{ url: work.image.url }] : undefined,
    },
  };
}

export default async function DesignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("Design slug:", slug);

  let work = await getDesignBySlug(slug);
  console.log("Design from getDesignBySlug:", work);

  // Fallback: if not found, try fetching all and find by slug
  if (!work) {
    const allDesigns = await getDesigns();
    work = allDesigns.find((d) => d.slug === slug) || null;
    console.log("Design from fallback:", work);
  }

  if (!work) {
    notFound();
  }

  const mediaItems = [
    ...(work.image?.url ? [{ url: work.image.url, type: "image" as const, altText: work.image.altText || work.title }] : []),
    ...(work.gallery?.map((item) => ({
      url: item.url,
      type: "image" as const,
      altText: item.altText || work.title,
    })) || []),
  ];

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.description || work.title,
    dateCreated: work.date,
    image: mediaItems[0]?.url,
    author: { "@type": "Person", name: "Emmanuel Ajibade" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <Container>
        <article className="py-16 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-slate-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/design" className="hover:text-slate-900">Design</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-900">{work.title}</li>
            </ol>
          </nav>

          <Reveal>
            <div className="glass-panel-strong rounded-[32px] p-6 sm:p-8 lg:p-12 mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{work.title}</h1>
              <p className="mt-2 text-muted-foreground">{work.category}</p>
            </div>
          </Reveal>

          {mediaItems.length > 0 && (
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-[28px] p-4 mb-8">
                <MediaCarousel mediaItems={mediaItems} title={work.title} />
              </div>
            </Reveal>
          )}

          {work.description && (
            <Reveal delay={0.15}>
              <div className="glass-panel rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">About this work</h2>
                <p className="mt-4 text-slate-700 leading-relaxed">{work.description}</p>
              </div>
            </Reveal>
          )}

          {work.tags && work.tags.length > 0 && (
            <Reveal delay={0.2}>
              <div className="glass-panel rounded-2xl p-6 mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tags</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-white/60 border border-white/40 px-3 py-1 text-sm text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {work.externalLink && (
            <Reveal delay={0.25}>
              <div className="glass-panel rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">External Link</h2>
                <div className="mt-4">
                  <a
                    href={work.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-5 py-3 text-sm font-medium text-slate-800 rounded-full"
                  >
                    View External Link
                  </a>
                </div>
              </div>
            </Reveal>
          )}

          <div className="mt-8">
            <Link href="/design" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              ← Back to all design work
            </Link>
          </div>
        </article>
      </Container>
    </main>
  );
}