import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/providers/MotionProvider";
import PageTransition from "@/components/providers/PageTransition";
import ScrollProgress from "@/components/layout/ScrollProgress";
import CursorGlow from "@/components/layout/CursorGlow";
import { getProfile, getPublishedProjects } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    template: "%s | Emmanuel Ajibade",
  },
  description: "Portfolio of Emmanuel Ajibade, a tech specialist and software developer with a passion for design.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [projects, profile] = await Promise.all([
    getPublishedProjects(),
    getProfile(),
  ]);

  return (
    <html lang="en">
      <body className="antialiased">
        <MotionProvider>
          <ScrollProgress />
          <CursorGlow />
          <Navbar projects={projects} />
          <main className="min-h-screen pt-24">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer profile={profile} />
        </MotionProvider>
      </body>
    </html>
  );
}