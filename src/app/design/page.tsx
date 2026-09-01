import { getDesigns } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/home/Reveal";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Work – Emmanuel Ajibade",
  description: "A collection of visual design work by Emmanuel Ajibade.",
  alternates: { canonical: `${siteUrl}/design` },
  openGraph: {
    title: "Design Work – Emmanuel Ajibade",
    description: "A collection of visual design work by Emmanuel Ajibade.",
    url: `${siteUrl}/design`,
    type: "website",
  },
};

export default async function DesignPage() {
  const designs = await getDesigns();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Design Work",
    itemListElement: designs.map((work, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: work.title,
      url: `${siteUrl}/design/${work.slug}`,
      image: work.image?.url?.startsWith("http") ? work.image.url : undefined,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Container>
        <section className="py-16 sm:py-20 lg:py-24">
          <Reveal>
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Design Work
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A collection of visual design work that complements my engineering.
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((work, index) => {
              const imgUrl =
                work.image?.url && work.image.url.startsWith("http")
                  ? work.image.url
                  : "https://placehold.co/600x400";
              const altText = work.image?.altText || work.title;

              return (
                <Reveal key={work.id} delay={index * 0.1}>
                  <Link
                    href={`/design/${work.slug}`}
                    className="group block glass-panel rounded-[26px] p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={imgUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{work.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{work.category}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}