import { getTopic } from '@/lib/contentLoader'

/** Showcase — trig graphs with sin/cos/tan explorer. */
export const SHOWCASE_TOPIC_ID = '9-4-9-5-graphs-of-trig-and-modulus-functions-harder-topi'

const SHOWCASE_HEADINGS = new Set([
  'core idea',
  'key formulas',
  'steps / method',
  'examiner tip',
])

function keepShowcaseHeading(heading: string): boolean {
  const normalized = heading.trim().toLowerCase()
  if (SHOWCASE_HEADINGS.has(normalized)) return true
  return normalized.startsWith('worked example')
}

/** Trim note markdown for the walkthrough / demo preview. */
export function trimNoteForShowcase(raw: string): string {
  const chunks = raw.split(/\r?\n(?=## )/)
  const kept: string[] = []

  for (const chunk of chunks) {
    const match = chunk.match(/^##\s+(.+?)(?:\r?\n|$)/)
    if (!match) continue
    if (keepShowcaseHeading(match[1])) {
      kept.push(chunk.trim())
    }
  }

  return kept.join('\n\n')
}

export function getShowcaseTopic() {
  return getTopic(SHOWCASE_TOPIC_ID)
}
