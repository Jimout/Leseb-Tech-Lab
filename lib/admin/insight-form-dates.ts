/** Display line on insight hero + cards, e.g. "March 14, 2026". */
export function formatInsightDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function insightDateIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function defaultInsightDates(): { date: string; dateIso: string } {
  const now = new Date()
  return { date: formatInsightDisplayDate(now), dateIso: insightDateIso(now) }
}

export const INSIGHT_MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const

export function parseInsightDateIso(iso: string): { year: number; month: string; day: number } {
  const now = new Date()
  const [y, m, d] = iso.split('-')
  const year = Number(y)
  const monthNum = Number(m)
  const day = Number(d)
  return {
    year: Number.isFinite(year) && year > 0 ? year : now.getFullYear(),
    month:
      Number.isFinite(monthNum) && monthNum >= 1 && monthNum <= 12
        ? String(monthNum).padStart(2, '0')
        : String(now.getMonth() + 1).padStart(2, '0'),
    day: Number.isFinite(day) && day >= 1 && day <= 31 ? day : now.getDate(),
  }
}

export function buildInsightDateIso(parts: {
  year: number
  month: string
  day: number
}): string {
  const year = Number.isFinite(parts.year) ? Math.round(parts.year) : new Date().getFullYear()
  const monthNum = Math.min(12, Math.max(1, Number.parseInt(parts.month, 10) || 1))
  const month = String(monthNum).padStart(2, '0')
  const maxDay = new Date(year, monthNum, 0).getDate()
  const day = Math.min(maxDay, Math.max(1, Math.round(parts.day) || 1))
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}
