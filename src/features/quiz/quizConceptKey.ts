import type { McqQuestion } from '@/lib/contentTypes'

/** Strip markdown/LaTeX for a short readable label. */
function plainSnippet(text: string, maxLen = 72): string {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$]+\$/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[#*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

/** Label shown in battle log — prefers Common mistake line, else question snippet. */
export function getConceptLabel(question: McqQuestion): string {
  const expl = question.explanation ?? ''
  const commonMatch = expl.match(/\*\*Common mistake:\*\*\s*([^\n]+)/i)
  if (commonMatch?.[1]) {
    const label = plainSnippet(commonMatch[1], 80)
    if (label) return label
  }
  return plainSnippet(question.question, 80) || question.id
}

export function getConceptKey(scopeId: string, question: McqQuestion): string {
  return `${scopeId}:${question.id}`
}
