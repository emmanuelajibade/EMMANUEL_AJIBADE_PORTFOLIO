import { getWritingPostBySlug, getWritingPosts } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JSX } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmanuel-ajibade-portfolio.vercel.app";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const posts = await getWritingPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingPostBySlug(slug);
  if (!post) return { title: "Post Not Found – Emmanuel Ajibade" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `${siteUrl}/writing/${post.slug}` },
    openGraph: {
      title: `${post.title} – Emmanuel Ajibade`,
      description: post.summary,
      url: `${siteUrl}/writing/${post.slug}`,
      type: "article",
      images: post.coverImage?.url?.startsWith("http") ? [{ url: post.coverImage.url }] : undefined,
    },
  };
}

function calculateReadingTime(text: string): string {
  return `${Math.ceil(text.split(/\s+/).length / 200)} min read`;
}

function renderMarkdown(body: string): JSX.Element[] {
  const lines = body.split("\n");
  const blocks: JSX.Element[] = [];
  let codeBlock: string[] = [];
  let inCode = false;

  lines.forEach((line, idx) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        blocks.push(
          <pre key={idx} className="bg-muted/30 p-4 rounded-md overflow-x-auto my-4">
            <code>{codeBlock.join("\n")}</code>
          </pre>
        );
        codeBlock = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }
    if (inCode) {
      codeBlock.push(line);
      return;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={idx} className="text-2xl font-semibold mt-8 mb-4">{line.slice(3)}</h2>
      );
    } else if (line.startsWith("- ")) {
      blocks.push(
        <ul key={idx} className="list-disc pl-6 mb-4"><li>{line.slice(2)}</li></ul>
      );
    } else if (line.trim() === "") {
      return;
    } else {
      blocks.push(
        <p key={idx} className="mb-4">{line}</p>
      );
    }
  });

  if (inCode) {
    blocks.push(
      <pre key="code-end" className="bg-muted/30 p-4 rounded-md overflow-x-auto my-4">
        <code>{codeBlock.join("\n")}</code>
      </pre>
    );
  }
  return blocks;
}

export default async function WritingDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getWritingPostBySlug(slug);
  if (!post) notFound();

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    url: `${siteUrl}/writing/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/writing/${post.slug}`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { "@type": "Person", name: post.author, url: siteUrl },
    publisher: { "@type": "Person", name: "Emmanuel Ajibade", url: siteUrl },
    image: post.coverImage?.url?.startsWith("http") ? post.coverImage.url : undefined,
  };

  const coverImageUrl = post.coverImage?.url?.startsWith("http") ? post.coverImage.url : null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <Container>
        <article className="py-16 sm:py-20 lg:py-24 max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/writing" className="hover:underline">Writing</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-foreground">{post.title}</li>
            </ol>
          </nav>

          <header className="mb-12">
            <p className="text-sm font-medium text-primary">{post.category}</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mt-2">{post.title}</h1>
            <p className="mt-4 text-muted-foreground">{post.summary}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span>Written by {post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              <span>·</span>
              <span>{calculateReadingTime(post.body)}</span>
            </div>
          </header>

          {coverImageUrl && (
            <div className="relative mb-12 overflow-hidden rounded-xl border border-border">
              <Image
                src={coverImageUrl}
                alt={post.coverImage?.altText || post.title}
                width={post.coverImage?.width || 1200}
                height={post.coverImage?.height || 600}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
              />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {renderMarkdown(post.body)}
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm">{tag}</span>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/writing" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              ← Back to all writing
            </Link>
          </div>
        </article>
      </Container>
    </main>
  );
}