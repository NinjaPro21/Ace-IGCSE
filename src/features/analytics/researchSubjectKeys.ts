/** Canonical research subject keys used in platform / personal analytics. */
export type ResearchSubjectKey = 'math' | 'addMath' | 'physics'

const APP_TO_RESEARCH: Record<string, ResearchSubjectKey> = {
  'maths-0580': 'math',
  'add-maths-0606': 'addMath',
  physics: 'physics',
  // Tolerate research keys if already passed through
  math: 'math',
  addMath: 'addMath',
}

export function toResearchSubjectKey(subjectId: string | undefined | null): ResearchSubjectKey | null {
  if (!subjectId) return null
  return APP_TO_RESEARCH[subjectId] ?? null
}

export function emptySubjectSeconds(): Record<ResearchSubjectKey, number> {
  return { math: 0, addMath: 0, physics: 0 }
}

export function emptySubjectPercents(): Record<ResearchSubjectKey, number> {
  return { math: 0, addMath: 0, physics: 0 }
}
