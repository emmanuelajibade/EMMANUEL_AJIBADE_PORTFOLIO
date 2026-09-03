import { getProjectBySlug, getPublishedProjects } from "@/lib/data";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MediaCarousel from "@/components/home/MediaCarousel";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found – Emmanuel Ajibade" };
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `${siteUrl}/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} – Emmanuel Ajibade`,
      description: project.shortDescription,
      url: `${siteUrl}/projects/${project.slug}`,
      type: "article",
      images: project.thumbnail?.url?.startsWith("http") ? [{ url: project.thumbnail.url }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const mediaItems = [
    ...(project.thumbnail?.url ? [{ url: project.thumbnail.url, type: "image" as const, altText: project.thumbnail.altText || project.title }] : []),
    ...(project.video?.url ? [{ url: project.video.url, type: "video" as const, altText: project.video.altText || project.title }] : []),
    ...(project.gallery || []).map((item) => ({
      url: item.url,
      type: item.type,
      altText: item.altText || project.title,
    })),
  ];

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: `${siteUrl}/projects/${project.slug}`,
    mainEntityOfPage: `${siteUrl}/projects/${project.slug}`,
    creator: { "@type": "Person", name: "Emmanuel Ajibade", url: siteUrl },
    author: { "@type": "Person", name: "Emmanuel Ajibade", url: siteUrl },
    datePublished: project.date,
    image: mediaItems[0]?.url,
    keywords: project.tags.join(", "),
    inLanguage: "en",
  };

  const features = project.features || [];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <Container>
        <article className="py-16 sm:py-20 lg:py-24">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-slate-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/projects" className="hover:text-slate-900">Projects</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-900">{project.title}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="glass-panel-strong rounded-[32px] p-6 sm:p-8 lg:p-12 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-slate-700 max-w-2xl">
              {project.shortDescription}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              A project by Emmanuel Ajibade, built as part of his software development work.
            </p>
          </div>

          {/* Carousel / Main Image */}
          {mediaItems.length > 0 && (
            <div className="glass-panel rounded-[28px] p-4 mb-8">
              <MediaCarousel mediaItems={mediaItems} title={project.title} />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Emmanuel&apos;s role</h2>
              <p className="mt-2 text-slate-800">{project.role}</p>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status</h2>
              <p className="mt-2 text-slate-800">
                {project.projectStatus === "completed"
                  ? "Completed"
                  : project.projectStatus === "in-progress"
                    ? "In Progress"
                    : "Archived"}
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Date</h2>
              <p className="mt-2 text-slate-800">{new Date(project.date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900">Technologies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full bg-white/60 border border-white/40 px-3 py-1 text-sm text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="glass-panel rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900">About this project</h2>
            <div className="mt-4 text-slate-700 leading-relaxed">
              {project.description.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900">Key Features</h2>
              <ul className="mt-4 space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {project.githubUrl || project.liveUrl ? (
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900">Links</h2>
              <div className="mt-4 flex flex-wrap gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-5 py-3 text-sm font-medium text-slate-800 rounded-full"
                  >
                    GitHub Repository
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-5 py-3 text-sm font-medium text-slate-800 rounded-full"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ) : null}

          {/* Back link */}
          <div className="mt-8">
            <Link
              href="/projects"
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to all projects
            </Link>
          </div>
        </article>
      </Container>
    </main>
  );
}