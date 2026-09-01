import { getWritingPosts } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/home/Reveal";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing – Emmanuel Ajibade",
  description: "Technical articles, notes, and thoughts by Emmanuel Ajibade.",
  alternates: { canonical: `${siteUrl}/writing` },
  openGraph: {
    title: "Writing – Emmanuel Ajibade",
    description: "Technical articles, notes, and thoughts by Emmanuel Ajibade.",
    url: `${siteUrl}/writing`,
    type: "website",
  },
};

function calculateReadingTime(text: string): string {
  const words = text.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export default async function WritingPage() {
  const posts = await getWritingPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Emmanuel Ajibade's Writing",
    url: `${siteUrl}/writing`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Container>
        <section className="py-16 sm:py-20 lg:py-24">
          <Reveal>
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Writing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Articles, notes, and thoughts about development and design.
              </p>
            </header>
          </Reveal>

          <div className="space-y-8">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.1}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="group block glass-panel rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {post.coverImage?.url?.startsWith("http") && (
                      <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden rounded-2xl bg-slate-100">
                        <Image
                          src={post.coverImage.url}
                          alt={post.coverImage.altText || post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 192px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-slate-700">{post.summary}</p>
                      <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                        <span>{post.category}</span>
                        <span>·</span>
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                        <span>·</span>
                        <span>{calculateReadingTime(post.body)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}