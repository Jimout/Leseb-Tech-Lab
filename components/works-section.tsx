import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const projects = [
  {
    title: 'Selam OS',
    tag: 'Conversational AI',
    desc: 'An assistant that speaks your language — literally and culturally.',
    imgSrc: '/images/Natty Hero.png',
    year: '2026',
  },
  {
    title: 'Mesob',
    tag: 'Civic Tech',
    desc: 'Tools that help communities organize, decide, and act together.',
    imgSrc: '/images/biom.jpg',
    year: '2026',
  },
] as const

export function WorksSection() {
  return (
    <section
      id="work"
      className="relative bg-black text-white px-4 sm:px-5 md:px-7 lg:px-9 xl:px-10 py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 2xl:py-40 3xl:py-44 4xl:py-48"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 sm:mb-14 md:mb-16 lg:mb-18 xl:mb-20">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#DFE222] flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFE222]" /> In the Lab
            </div>
            <h2 className="font-display tracking-[-0.03em] leading-[0.95] text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl 3xl:text-9xl">
              What we&apos;re <span className="italic font-light text-[#DFE222]">building.</span>
            </h2>
          </div>
          <a
            href="/work"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
          >
            All projects <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((p, i) => (
            <a
              href="/work"
              key={p.title}
              className={[
                'group relative block rounded-3xl overflow-hidden bg-[#0b0b0b] aspect-2/1 md:aspect-video',
                i === 1 ? 'md:translate-y-16' : '',
              ].join(' ')}
            >
              <Image
                src={p.imgSrc}
                alt={p.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur border border-white/10">
                  {p.tag}
                </span>
                <span>{p.year}</span>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-7 md:p-9">
                <h3 className="font-display text-3xl md:text-5xl tracking-tight mb-3 flex items-center gap-3">
                  {p.title}
                  <ArrowUpRight className="w-6 h-6 text-[#DFE222] group-hover:rotate-45 transition-transform" />
                </h3>
                <p className="text-white/70 max-w-md text-balance">{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
