import type { InsightArticle } from '@/lib/insight-types'

/** Full article body for biomimicry insight — TOC is derived from section order. */
export const BIOMIMICRY_ARTICLE: InsightArticle = {
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction',
      blocks: [
        {
          type: 'p',
          html: 'Architecture has always borrowed from nature—span, rhythm, light. Biomimicry pushes that borrowing further: not only form, but performance. Organisms solve problems of structure, cooling, and adaptation with constraints we recognize in buildings: material limits, climate stress, and the need to endure over time.',
        },
        {
          type: 'p',
          html: 'This article outlines how biomimicry shows up in contemporary practice—from passive cooling logics to structural efficiency—and why visualization is part of making those ideas legible to clients and collaborators.',
        },
      ],
    },
    {
      id: 'what-is-biomimicry',
      heading: 'What is biomimicry in architecture?',
      blocks: [
        {
          type: 'p',
          html: 'Biomimicry in architecture means learning from biological strategies and translating them into built systems—envelopes, structure, and environmental response—without copying organic shapes for decoration alone. The emphasis is on function: how a surface sheds heat, how a structure carries load, how a skin mediates air and light.',
        },
        {
          type: 'p',
          html: 'It is distinct from biomorphism (organic styling). A biomimetic facade might look minimal while behaving like a leaf or a shell in how it responds to sun and wind.',
        },
      ],
    },
    {
      id: 'nature-mentor',
      heading: 'Nature as a design mentor',
      blocks: [
        {
          type: 'p',
          html: 'Nature offers a catalog of strategies that are tested by evolution—distributed structures, redundant load paths, and adaptive skins. Designers can abstract those strategies into diagrams, rules, and performance targets before they ever become geometry.',
        },
        {
          type: 'ul',
          items: [
            'Termite mounds — passive cooling systems',
            'Bone and shell — material efficiency under load',
            'Plant surfaces — water shedding and self-cleaning behavior',
            'Forest canopies — layered light and ventilation',
          ],
        },
        {
          type: 'p',
          html: 'The mentor relationship is iterative: observe, abstract, simulate, and prototype—then return to the reference when the design drifts from performance intent.',
        },
      ],
    },
    {
      id: 'built-examples',
      heading: 'Built examples that redefine Architecture',
      blocks: [
        {
          type: 'p',
          html: 'Across scales, projects demonstrate how biomimetic logics enter the built environment: responsive shading, shell-like enclosures, and landscape systems that behave like ecosystems rather than decoration. The common thread is measurable performance tied to a clear biological analogy.',
        },
        {
          type: 'p',
          html: 'Renderings and environmental graphics help teams align on what is metaphor and what is metric—daylight, thermal comfort, and airflow become part of the story early.',
        },
      ],
    },
    {
      id: 'why-now',
      heading: 'Why it matters now',
      blocks: [
        {
          type: 'p',
          html: 'As energy codes tighten and clients ask for resilience, biomimicry offers a bridge between ambition and operation: strategies that are legible in models, testable in simulation, and communicable in review.',
        },
      ],
    },
    {
      id: 'conclusion',
      heading: 'Conclusion',
      blocks: [
        {
          type: 'p',
          html: 'Biomimicry does not replace craft or judgment—it sharpens the questions. The studio continues to pair physical models with iterative visualization so ideas stay accountable to climate, structure, and experience. Nature remains the reference library; architecture is how we translate it into built reality.',
        },
      ],
    },
  ],
}
