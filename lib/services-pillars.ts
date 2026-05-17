import type { LucideIcon } from 'lucide-react'
import { Brain, Globe2, LineChart, Users } from 'lucide-react'

export type ServiceOffering = {
  n: string
  label: string
}

export type ServiceCategory = {
  id: string
  n: string
  icon: LucideIcon
  /** Short word for the large editorial headline */
  categoryTitle: string
  title: string
  body: string
  description: string
  offerings: ServiceOffering[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'ai',
    n: '01',
    icon: Brain,
    categoryTitle: 'Intelligence',
    title: 'AI Solutions for Everyday Life',
    body: 'We design human centered AI tools that improve decision making, automate tasks, and empower people.',
    description:
      'We build AI that respects language, culture, and context: assistants and automations your users can trust, not tools that add noise.',
    offerings: [
      { n: '01', label: 'Conversational Assistants' },
      { n: '02', label: 'Workflow Automation' },
      { n: '03', label: 'Decision Support Tools' },
      { n: '04', label: 'Multilingual & Local Models' },
    ],
  },
  {
    id: 'software',
    n: '02',
    icon: Globe2,
    categoryTitle: 'Software',
    title: 'Web & Software Development',
    body: 'We build intuitive web and software solutions that simplify daily life.',
    description:
      'Product minded engineers and designers ship web apps and internal tools that stay fast, accessible, and easy for your team to own.',
    offerings: [
      { n: '01', label: 'Web Applications' },
      { n: '02', label: 'Internal Tools & Dashboards' },
      { n: '03', label: 'Design Systems & UI' },
      { n: '04', label: 'Maintenance & Handoff' },
    ],
  },
  {
    id: 'data',
    n: '03',
    icon: LineChart,
    categoryTitle: 'Data',
    title: 'Data Driven Platforms',
    body: 'Our systems transform raw data into clarity, insight, and better social outcomes.',
    description:
      'From pipelines to public facing insight, we turn messy data into systems people can read, act on, and improve over time.',
    offerings: [
      { n: '01', label: 'Analytics Dashboards' },
      { n: '02', label: 'Data Pipelines' },
      { n: '03', label: 'Civic & Social Reporting' },
      { n: '04', label: 'Knowledge & Retrieval' },
    ],
  },
  {
    id: 'community',
    n: '04',
    icon: Users,
    categoryTitle: 'Community',
    title: 'Community Driven Innovation',
    body: 'We stay close to people, communities, and real challenges, ensuring our solutions create real impact.',
    description:
      'We work beside the communities you serve, listening first, prototyping in the open, and leaving teams stronger than we found them.',
    offerings: [
      { n: '01', label: 'Co Design Workshops' },
      { n: '02', label: 'Field Research' },
      { n: '03', label: 'Pilot & Rollout Programs' },
      { n: '04', label: 'Training & Capacity Building' },
    ],
  },
]

/** Landing grid cards — same four practices, lighter shape */
export type ServicePillar = Pick<ServiceCategory, 'n' | 'icon' | 'title' | 'body'>

export const SERVICE_PILLARS: ServicePillar[] = SERVICE_CATEGORIES.map(
  ({ n, icon, title, body }) => ({ n, icon, title, body }),
)
