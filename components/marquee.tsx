const items = [
  'Leseb',
  'ለሰው',
  'Namaaf',
  'For human',
  'ንሰብ',
  'للإنسان',
  'አሳስ',
  'Numuk',
  "Pour l'humain",
  '为人',
  'Aadanaha',
  '人間のために',
  'Asas',
  'Für den Menschen',
  'Manchihira',
  'Для человека',
  'Para el humano',
  'Mannimane',
  'इंसान के लिए',
  "Per l'umano",
  '인간을 위해',
]

export const Marquee = () => (
  <div
    data-nav-surface="dark"
    className="flex w-full min-w-0 items-center overflow-x-clip border-y border-border bg-background py-4 md:py-5"
  >
    <div className="marquee flex w-max shrink-0 items-center gap-16 whitespace-nowrap font-display text-3xl leading-none tracking-tight md:text-5xl">
      {[...items, ...items].map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center gap-16 text-foreground/90">
          <span
            className={
              i % 3 === 1
                ? 'inline-flex items-center font-light text-signal italic'
                : 'inline-flex items-center'
            }
          >
            {t}
          </span>
          <span className="inline-flex items-center justify-center text-signal">✦</span>
        </span>
      ))}
    </div>
  </div>
)
