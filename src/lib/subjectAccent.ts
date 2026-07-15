export type SubjectAccentKind = 'gold' | 'blue' | 'green'

const SUBJECT_ACCENT_MAP: Record<string, SubjectAccentKind> = {
  'add-maths-0606': 'gold',
  'maths-0580': 'blue',
  physics: 'green',
}

export function subjectAccentSlug(subjectId: string): string {
  return subjectId.replace(/[^a-z0-9-]/gi, '')
}

export function subjectAccentKind(subjectId: string): SubjectAccentKind {
  return SUBJECT_ACCENT_MAP[subjectId] ?? 'blue'
}

export function subjectAccentClasses(subjectId: string): {
  rowClass: string
  subjectClass: string
  accentKind: SubjectAccentKind
} {
  const slug = subjectAccentSlug(subjectId)
  const accentKind = subjectAccentKind(subjectId)
  if (!slug) return { rowClass: '', subjectClass: '', accentKind }
  return {
    rowClass: `ace-insights-row--${slug}`,
    subjectClass: `ace-insights-row__subject--${slug}`,
    accentKind,
  }
}
