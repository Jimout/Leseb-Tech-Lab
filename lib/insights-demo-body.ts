import type { InsightArticle } from '@/lib/insight-types'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'

/** Slugs that receive long demo body copy when the CMS has no article/HTML yet (local QA). */
const DEMO_BODY_SLUGS = new Set([
  'sample-intent-to-interface',
  'biomimicry-architecture',
  'sample-metrics-that-move-teams',
])

function p(html: string) {
  return { type: 'p' as const, html }
}

const SAMPLE_INTENT_ARTICLE: InsightArticle = {
  sections: [
    {
      id: 'why-three-sketches',
      heading: 'Why we stop at three sketches',
      blocks: [
        p(
          'Three is enough to show a happy path, an edge case, and a recovery moment. More than that and reviewers treat the wall like a menu instead of a decision. We timebox each sketch to twenty minutes so the team stays in divergent mode long enough to surprise itself, but not so long that polish sneaks in early.',
        ),
        p(
          'The first sketch is always the obvious flow—the one everyone already has in their head. The second challenges a constraint: what if the user has no network, or only one hand free, or is onboarding mid-task? The third sketch is where we borrow from another domain: a calendar pattern, a messaging thread, or a physical kiosk queue.',
        ),
      ],
    },
    {
      id: 'shared-vocabulary',
      heading: 'Building a shared vocabulary',
      blocks: [
        p(
          'Before we label anything in Figma, we name objects on the whiteboard: actor, intent, surface, handoff. That language shows up in tickets, standups, and client readouts. When a stakeholder says “screen,” we gently translate to “step” so we do not lock ourselves into one layout too early.',
        ),
        p(
          'Arrows carry meaning: solid for primary flow, dashed for optional branches, red for errors we must design explicitly. We photograph the board and drop it into the insight archive so remote teammates can comment asynchronously without losing the spatial context.',
        ),
      ],
    },
    {
      id: 'from-sketch-to-story',
      heading: 'From sketch to testable story',
      blocks: [
        p(
          'Each sketch becomes a one-sentence story: “As a field operator, I can pause a job and resume it on another device without losing context.” If we cannot write that sentence, the sketch is decorative. Stories feed straight into acceptance criteria—no duplicate rewrite pass later.',
        ),
        p(
          'We rank stories by risk, not by excitement. Regulatory exposure, data loss, and accessibility blockers float to the top even when they are visually boring. Exciting visuals come after the scary flows are credible.',
        ),
      ],
    },
    {
      id: 'review-ritual',
      heading: 'The review ritual',
      blocks: [
        p(
          'Reviews are silent for the first five minutes: everyone reads stickers, adds questions on orange notes, only then do we talk. Facilitators watch for solution-jumping and park feature ideas in a “later” column so the room does not debate roadmap during flow work.',
        ),
        p(
          'We end every review with a decision log: what we learned, what we will prototype next, and what we explicitly will not pursue. That log is what clients sign—not the prettiest frame on the wall.',
        ),
      ],
    },
    {
      id: 'handoff-to-build',
      heading: 'Handoff without hero shots',
      blocks: [
        p(
          'Engineers receive numbered flows, edge-case callouts, and empty states—not just the golden path mockup. We include copy deck stubs and telemetry hooks so implementation teams know what to measure on day one.',
        ),
        p(
          'When something is uncertain, we ship a spike behind a feature flag rather than delaying the whole slice. The sketch workshop makes those uncertainties visible early instead of hiding them in polish.',
        ),
      ],
    },
    {
      id: 'measuring-after-launch',
      heading: 'Measuring after launch',
      blocks: [
        p(
          'We pair qualitative interviews with three quantitative signals: time-to-complete, abandonment before confirmation, and repeat use within seven days. If sketches predicted a bottleneck, we should see it move after release—not surprise us in support tickets.',
        ),
        p(
          'Insights from production feed the next workshop. The loop is intentionally short: six weeks from sketch to learnings readout, so teams trust the process and do not treat discovery as a one-off theater exercise.',
        ),
      ],
    },
    {
      id: 'when-to-skip',
      heading: 'When we skip the workshop',
      blocks: [
        p(
          'We skip only when the change is purely visual and cannot alter behavior—typography refresh, icon swap, color contrast fix. Everything that moves data, permissions, or notifications goes through at least one three-sketch cycle, even if the timeline is tight.',
        ),
        p(
          'Skipping is a conscious risk accepted by product and engineering leads in writing. That single paragraph has saved more evenings than any fancy template we have shipped.',
        ),
      ],
    },
  ],
}

function longSimpleHtml(): string {
  return `
<h2>Introduction</h2>
<p>Biomimicry in product and architecture is not about copying shapes for novelty. It is about importing operating principles—how a leaf manages water, how a colony distributes load, how a forest edge handles wind—then translating those logics into materials, software flows, and governance models teams can ship.</p>
<p>This article walks through how we use nature as a reference library during early discovery. We treat each metaphor as a hypothesis to test, not a slogan for a pitch deck. When a metaphor survives contact with users and constraints, it earns a place in the specification.</p>

<h2>Structure without excess material</h2>
<p>Natural structures follow stress paths. In buildings, that means shells and ribs that carry load where it actually travels. In software, it means services and data models that align with how teams make decisions—not how org charts were drawn five years ago.</p>
<p>We sketch structural diagrams beside user journeys so engineers and designers share one picture. Redundant paths are intentional when they add resilience; ornamental duplication is cut early.</p>

<h2>Passive regulation</h2>
<p>Leaves modulate light and temperature without motors. Facades can do the same with depth, orientation, and material phase change. Dashboards can do the same with defaults, quiet notifications, and batching instead of constant polling.</p>
<p>We document which behaviors should be automatic versus explicit. Users should not have to manage thermostats in software that could observe context ethically and adjust defaults on their behalf.</p>

<h2>Water and feedback loops</h2>
<p>Water systems in nature store, slow, and release. Product teams need similar buffers: queues, draft states, and reconciliation windows that absorb spikes without drowning operators.</p>
<p>When we design analytics pipelines, we look for places to slow water down—sampling, aggregation, and human review slots—so alerts mean something and teams trust the signal.</p>

<h2>Adaptation over time</h2>
<p>Ecosystems adapt without a central project manager. Distributed agents respond to local signals. We borrow that pattern for feature flags, regional configuration, and policy toggles that let teams learn in one market before scaling globally.</p>
<p>Adaptation requires telemetry and humility. We ship small, measure, and allow rollback paths that are boringly reliable rather than heroically manual.</p>

<h2>Visualization as evidence</h2>
<p>Renderings and simulations are not marketing wallpaper. They are evidence in review: thermal maps, airflow clips, and accessibility contrast checks sit next to pretty hero images so stakeholders see performance alongside form.</p>
<p>We keep visualization lightweight until decisions harden—gray boxes and diagrammatic overlays before final entourage. That discipline keeps feedback focused on behavior, not furniture selection.</p>

<h2>Closing the loop</h2>
<p>Every biomimicry reference we use ends with a plain-language claim and a metric: comfort hours without mechanical cooling, task completion time, energy per active user. Metaphors that cannot be measured are archived, not deleted—they may return when tooling catches up.</p>
<p>Nature remains the reference library. Design is how we translate it into built reality that teams can maintain after launch day.</p>
`.trim()
}

const METRICS_SIMPLE_HTML = `
<h2>Start with three signals</h2>
<p>Teams drown when dashboards show everything. We pick three signals that connect to a decision: latency for trust, completion for value, satisfaction for retention. Everything else is diagnostic—useful when investigating, not for weekly standups.</p>
<p>Those three sit in the same slide every week so trends are comparable. We change the definitions rarely; when we do, we rewrite history notes so nobody compares apples to orchards.</p>

<h2>Same slot, same agenda</h2>
<p>Metrics reviews happen in a fixed slot with a fixed agenda: five minutes context, ten minutes on deltas, ten minutes on actions. No feature demos sneak in. Product and engineering leads share facilitation so neither side treats the meeting as optional.</p>

<h2>Thresholds before trends</h2>
<p>We define thresholds that trigger conversation before charts look pretty. A spike in errors matters even if the weekly average looks fine. A flat satisfaction score matters when we just shipped a major improvement—we expected movement.</p>

<h2>Human stories beside numbers</h2>
<p>Every review includes one qualitative story from support or research. Numbers explain scale; stories explain texture. Together they prevent optimizing for a metric that users do not actually feel.</p>

<h2>When to retire a metric</h2>
<p>Metrics expire. When a signal no longer changes decisions for two quarters, we retire it publicly and document why. That keeps the dashboard honest and respects the team's attention.</p>
`.trim()

const DEMO_BY_SLUG: Record<
  string,
  Pick<ShowcaseInsight, 'bodyMode' | 'simpleBodyHtml' | 'article'>
> = {
  'sample-intent-to-interface': {
    bodyMode: 'structured',
    article: SAMPLE_INTENT_ARTICLE,
  },
  'biomimicry-architecture': {
    bodyMode: 'simple',
    simpleBodyHtml: longSimpleHtml(),
  },
  'sample-metrics-that-move-teams': {
    bodyMode: 'simple',
    simpleBodyHtml: METRICS_SIMPLE_HTML,
  },
}

function insightHasCmsBody(row: ShowcaseInsight): boolean {
  if (row.article?.sections?.length) return true
  if (row.simpleBodyHtml && !isInsightHtmlEmpty(row.simpleBodyHtml)) return true
  return false
}

/** Attach scrollable demo copy for QA slugs when CMS body is empty. */
export function applyInsightDemoBody(row: ShowcaseInsight): ShowcaseInsight {
  if (!DEMO_BODY_SLUGS.has(row.slug) && !DEMO_BODY_SLUGS.has(row.id)) return row
  if (insightHasCmsBody(row)) return row
  const demo = DEMO_BY_SLUG[row.slug] ?? DEMO_BY_SLUG[row.id]
  if (!demo) return row
  return { ...row, ...demo }
}
