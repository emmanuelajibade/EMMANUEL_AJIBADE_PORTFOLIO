import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/providers/MotionProvider";
import PageTransition from "@/components/providers/PageTransition";
import ScrollProgress from "@/components/layout/ScrollProgress";
import CursorGlow from "@/components/layout/CursorGlow";
import PageBackground from "@/components/layout/PageBackground";
import AIChatWidget from "@/components/ai/AIChatWidget";
import { getProfile, getPublishedProjects } from "@/lib/data";
import { publicFacebookUrl, publicGithubUrl } from "@/lib/profile-identity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    template: "%s | Emmanuel Ajibade",
  },
  description:
    "Emmanuel Ajibade is a tech specialist and software developer creating modern digital products, design-led experiences, and thoughtful web applications.",
  alternates: { canonical: siteUrl },
  authors: [{ name: "Emmanuel Ajibade", url: siteUrl }],
  creator: "Emmanuel Ajibade",
  publisher: "Emmanuel Ajibade",
  other: {
    "profile:facebook": publicFacebookUrl,
    "profile:github": publicGithubUrl,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    description:
      "Portfolio of Emmanuel Ajibade, a tech specialist and software developer focused on software, design, and meaningful digital experiences.",
    url: siteUrl,
    type: "website",
    siteName: "Emmanuel Ajibade Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Ajibade – Tech Specialist & Software Developer",
    description:
      "Portfolio of Emmanuel Ajibade, a tech specialist and software developer focused on software, design, and meaningful digital experiences.",
  },
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
          <PageBackground />
          <ScrollProgress />
          <CursorGlow />
          <Navbar projects={projects} />
          <main className="relative z-10 min-h-screen pt-24">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer profile={profile} />
          <AIChatWidget />
        </MotionProvider>
      </body>
    </html>
  );
}