import { getTopic } from '@/lib/contentLoader'

/** Easier topic — linear graphs with line-formula explorer. */
export const SHOWCASE_TOPIC_ID = '9-1-linear-graphs'

const SHOWCASE_HEADINGS = new Set([
  'core idea',
  'key formulas',
  'steps / method',
  'examiner tip',
])

/** Trim note markdown for the walkthrough preview. */
export function trimNoteForShowcase(raw: string): string {
  const chunks = raw.split(/\r?\n(?=## )/)
  const kept: string[] = []

  for (const chunk of chunks) {
    const match = chunk.match(/^##\s+(.+?)(?:\r?\n|$)/)
    if (!match) continue
    const heading = match[1].trim()
    if (SHOWCASE_HEADINGS.has(heading.toLowerCase())) {
      kept.push(chunk.trim())
    }
  }

  return kept.join('\n\n')
}

export function getShowcaseTopic() {
  return getTopic(SHOWCASE_TOPIC_ID)
}
