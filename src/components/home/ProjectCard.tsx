import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/content";

export default function ProjectCard({ project }: { project: Project }) {
  const imgUrl =
    project.thumbnail?.url && project.thumbnail.url.startsWith("http")
      ? project.thumbnail.url
      : "https://placehold.co/600x400";
  const altText = project.thumbnail?.altText || project.title;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block glass-panel rounded-[26px] p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Image container with fixed aspect ratio */}
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

      <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-700">
        {project.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-full bg-white/60 border border-white/40 px-2.5 py-0.5 text-xs font-medium text-slate-700"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="inline-flex items-center rounded-full bg-white/60 border border-white/40 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm font-semibold">
        <span className="text-orange-600">
          {project.projectStatus === "completed"
            ? "Completed"
            : project.projectStatus === "in-progress"
              ? "In Progress"
              : "Archived"}
        </span>
        <span className="inline-flex items-center gap-1 text-slate-700 transition-transform group-hover:translate-x-1">
          View
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}