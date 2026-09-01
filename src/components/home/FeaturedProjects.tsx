import Container from "@/components/layout/Container";
import ProjectCard from "@/components/home/ProjectCard";
import Reveal from "@/components/home/Reveal";
import type { Project } from "@/types/content";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  // Get all published & active projects
  const publishedProjects = projects
    .filter((p) => p.visibility === "published" && p.active !== false)
    .sort((a, b) => a.order - b.order);

  // Get featured ones
  const featuredProjects = publishedProjects.filter((p) => p.featured);

  // If we have fewer than 3 featured, fallback to showing the first 3 published
  const displayProjects = featuredProjects.length >= 3 
    ? featuredProjects.slice(0, 3) 
    : publishedProjects.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <header className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              A selection of work that highlights my technical skills and problem‑solving.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.1}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}