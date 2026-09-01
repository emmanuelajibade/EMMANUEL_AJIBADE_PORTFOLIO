"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import type { Project } from "@/types/content";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { supabaseClient } from "@/lib/supabase-client";

interface NavbarProps {
  projects: Project[];
}

export default function Navbar({ projects }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading } = useAdminCheck();

  const publishedProjects = projects
    .filter((p) => p.visibility === "published" && p.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Close menus on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setProjectsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    setMobileOpen(false);
    setProjectsOpen(false);
    router.push("/");
  }

  // Determine if a link is active
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/design", label: "Design" },
    { href: "/writing", label: "Writing" },
    { href: "/contact", label: "Contact" },
  ];

  // Only show Admin link if user is an admin (isAdmin === true)
  if (!loading && isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
      <nav className="glass-panel relative mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-black tracking-tight text-slate-900 transition-transform hover:scale-105"
        >
          Emmanuel
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.label === "Projects" ? (
              <div key={link.href} className="relative">
                <button
                  onClick={() => setProjectsOpen(!projectsOpen)}
                  className={`relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive("/projects")
                      ? "text-orange-600"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  aria-expanded={projectsOpen}
                  aria-haspopup="true"
                >
                  {link.label}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {isActive("/projects") && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </button>
                <AnimatePresence>
                  {projectsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full z-[60] mt-2 w-64 rounded-2xl glass-panel p-2"
                    >
                      <Link
                        href="/projects"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-800 transition-colors hover:bg-white/60"
                        onClick={() => setProjectsOpen(false)}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                          All
                        </span>
                        All Projects
                      </Link>
                      {publishedProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.slug}`}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-800 transition-colors hover:bg-white/60"
                          onClick={() => setProjectsOpen(false)}
                        >
                          {project.thumbnail?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.thumbnail.url}
                              alt={project.title}
                              className="h-8 w-8 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                              {project.title.charAt(0)}
                            </span>
                          )}
                          <span className="truncate">{project.title}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-orange-600"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  />
                )}
              </Link>
            )
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="ml-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-slate-800 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel mx-auto mt-3 max-w-7xl overflow-hidden rounded-2xl md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) =>
                link.label === "Projects" ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setProjectsOpen(!projectsOpen)}
                      className={`flex w-full items-center justify-between py-2 text-sm font-medium ${
                        isActive("/projects") ? "text-orange-600" : "text-slate-800"
                      }`}
                      aria-expanded={projectsOpen}
                    >
                      {link.label}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {projectsOpen && (
                      <div className="space-y-1 pl-4">
                        <Link
                          href="/projects"
                          className="flex items-center gap-3 py-2 text-sm text-slate-700 hover:text-slate-900"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                            All
                          </span>
                          All Projects
                        </Link>
                        {publishedProjects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.slug}`}
                            className="flex items-center gap-3 py-2 text-sm text-slate-700 hover:text-slate-900"
                            onClick={() => setMobileOpen(false)}
                          >
                            {project.thumbnail?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={project.thumbnail.url}
                                alt={project.title}
                                className="h-8 w-8 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                                {project.title.charAt(0)}
                              </span>
                            )}
                            <span className="truncate">{project.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2 text-sm font-medium ${
                      isActive(link.href) ? "text-orange-600" : "text-slate-700 hover:text-slate-900"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="block py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}