import Container from "@/components/layout/Container";
import Link from "next/link";
import type { Profile } from "@/types/content";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="px-4 pb-6 sm:px-6 lg:px-8">
      <Container>
        <div className="glass-panel rounded-[28px] px-6 py-8 sm:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
              <p className="mt-2 text-sm text-slate-700">{profile.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Links</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">About</Link></li>
                <li><Link href="/projects" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Projects</Link></li>
                <li><Link href="/design" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Design</Link></li>
                <li><Link href="/contact" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Social</h4>
              <ul className="mt-4 space-y-2">
                {profile.socialLinks.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.url}
                      className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200/50 pt-6 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}