import { getPublishedProjects } from "@/lib/data";
import Container from "@/components/layout/Container";
import ProjectCard from "@/components/home/ProjectCard";
import Reveal from "@/components/home/Reveal";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmanuel-ajibade-portfolio.vercel.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of software and technology projects by Emmanuel Ajibade.",
  alternates: { canonical: `${siteUrl}/projects` },
  openGraph: {
    title: "Projects – Emmanuel Ajibade",
    description: "A collection of software and technology projects by Emmanuel Ajibade.",
    url: `${siteUrl}/projects`,
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main>
      <Container>
        <section className="py-16 sm:py-20 lg:py-24">
          <Reveal>
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Projects
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Software projects Emmanuel Ajibade has built or is developing, including web applications,
                developer tools, and experiments with modern technologies.
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.1}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}