import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/home/Reveal";

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <div className="glass-panel-strong mx-auto max-w-3xl rounded-[32px] px-6 py-12 text-center sm:px-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Let&apos;s work together
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              I&apos;m always open to discussing new projects, collaborations, or ideas.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="glass-button-primary px-8 py-4 text-base font-semibold text-white"
              >
                Contact Emmanuel
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}