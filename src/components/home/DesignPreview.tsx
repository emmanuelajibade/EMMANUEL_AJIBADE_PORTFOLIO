import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/home/Reveal";
import type { DesignWork } from "@/types/content";

export default function DesignPreview({ designs }: { designs: DesignWork[] }) {
  // Show at least 3 designs (featured first, then fallback)
  const activeDesigns = designs.filter((d) => d.active !== false);
  const featured = activeDesigns.filter((d) => d.featured);
  const displayDesigns = featured.length >= 3 ? featured.slice(0, 3) : activeDesigns.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <header className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Design Work
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A selection of visual design that complements my engineering work.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDesigns.map((work, index) => {
            const imgUrl =
              work.image?.url && work.image.url.startsWith("http")
                ? work.image.url
                : "https://placehold.co/600x400";
            const altText = work.image?.altText || work.title;

            return (
              <Reveal key={work.id} delay={index * 0.1}>
                <Link
                  href="/design"
                  className="group block glass-panel rounded-[26px] p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Image container – fixed aspect ratio, image inside */}
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

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{work.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{work.category}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              href="/design"
              className="glass-button px-8 py-4 text-base font-semibold text-slate-800 rounded-full"
            >
              View All Design Work
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}