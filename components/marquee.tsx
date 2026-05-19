import type { CSSProperties } from 'react'

import {
  landingMarqueeBandClass,
  landingMarqueeFadeClass,
  landingMarqueeFadeRightClass,
  landingMarqueeSepClass,
  landingMarqueeTrackClass,
  landingMarqueeUnitClass,
  landingMarqueeWordAccentClass,
  landingMarqueeWordMidClass,
  landingMarqueeWordMutedClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

const phrases = [
  'Leseb',
  'ለሰብ',
  'For human',
  'Namaaf',
  'ንሰብ',
  'للإنسان',
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
] as const

const MARQUEE_WORD_CLASSES = [
  landingMarqueeWordAccentClass,
  landingMarqueeWordMidClass,
  landingMarqueeWordMutedClass,
] as const

function marqueeWordClass(index: number) {
  return MARQUEE_WORD_CLASSES[index % MARQUEE_WORD_CLASSES.length]
}

const MARQUEE_DURATION_SEC = 100

type MarqueeProps = {
  className?: string
}

export const Marquee = ({ className }: MarqueeProps) => {
  const track = [...phrases, ...phrases]

  return (
    <div data-nav-surface="dark" className={cn(landingMarqueeBandClass, className)}>
      <div className={landingMarqueeFadeClass} aria-hidden />
      <div className={landingMarqueeFadeRightClass} aria-hidden />

      <div
        className={landingMarqueeTrackClass}
        style={{ '--marquee-line-duration': `${MARQUEE_DURATION_SEC}s` } as CSSProperties}
      >
        {track.map((phrase, index) => (
          <span key={`${phrase}-${index}`} className={landingMarqueeUnitClass}>
            <span className={marqueeWordClass(index)}>{phrase}</span>
            <span className={landingMarqueeSepClass} aria-hidden>
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
