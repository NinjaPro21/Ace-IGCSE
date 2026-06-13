/** Decode HTML entities introduced during JSON / import authoring. */
export function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

/** Strip invisible Unicode characters that break KaTeX parsing. */
function stripInvisibleChars(str: string): string {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '')
}

/**
 * Prepare markdown for remark-math / rehype-katex:
 * 1. decode HTML entities (must run first so &gt; → > before LaTeX sees it)
 * 2. strip invisible chars
 * 3. fix literal double-backslashes (\\) from docx JSON → single backslash for KaTeX
 * 4. trim whitespace inside $...$ delimiters
 * 5. normalise $$...$$ display blocks onto clean lines
 * 6. collapse stray newlines inside inline math
 */
export function normalizeMathMarkdown(raw: string): string {
  // Step 1: entity decode must happen before any LaTeX processing
  let text = decodeHTMLEntities(raw)
  // Step 2: remove zero-width chars
  text = stripInvisibleChars(text).trim()
  // Step 3: literal double-backslash from JSON string escaping → real single backslash
  text = text.replace(/\\\\/g, '\\')

  // Convert \[...\] display math and \(...\) inline math into standard Markdown math delimiters.
  text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, inner: string) => {
    return `$$\n${inner.trim()}\n$$`
  })
  text = text.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, inner: string) => {
    return `$${inner.trim()}$`
  })

  // Normalise display math blocks
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner: string) => {
    return `$$\n${inner.trim()}\n$$`
  })

  // Trim whitespace inside inline math without touching display blocks
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  text = parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part.replace(/\$([^$\n]+?)\$/g, (_, inner: string) => `$${inner.trim()}$`)
    })
    .join('')

  return text
}

/** Split a section body into discrete cards (formulas, method types, etc.). */
export function parseContentCards(body: string): string[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  const displayBlocks = trimmed.match(/\$\$[\s\S]*?\$\$/g)
  if (displayBlocks && displayBlocks.length > 1) {
    const cards: string[] = []
    let rest = trimmed
    for (const block of displayBlocks) {
      const idx = rest.indexOf(block)
      const before = rest.slice(0, idx).trim()
      if (before) cards.push(before)
      cards.push(block.trim())
      rest = rest.slice(idx + block.length)
    }
    const after = rest.trim()
    if (after) cards.push(after)
    return cards.filter(Boolean)
  }

  const paragraphs = trimmed.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean)
  if (paragraphs.length > 1) return paragraphs

  const lines = trimmed.split(/\n/).map((s) => s.trim()).filter(Boolean)
  if (lines.length > 1) return lines

  return [trimmed]
}

export interface InlineCallout {
  label: string
  body: string
}

/** Split a steps/method body into numbered steps and trailing ### callouts. */
export function parseStepsWithCallouts(body: string): {
  steps: string[]
  callouts: InlineCallout[]
} {
  const trimmed = body.trim()
  if (!trimmed) return { steps: [], callouts: [] }

  const parts = trimmed.split(/\n(?=###\s+)/)
  const main = parts[0] ?? ''
  const steps = main
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)

  const callouts = parts.slice(1).map((part) => {
    const match = part.match(/^###\s+(.+?)\s*\n([\s\S]*)/)
    return {
      label: match?.[1]?.trim() ?? 'Note',
      body: match?.[2]?.trim() ?? '',
    }
  })

  return { steps, callouts }
}

/** Map inline callout headings to visual variants. */
export function calloutVariant(label: string): 'pink' | 'teal' | 'gold' | 'green' {
  const key = label.toLowerCase()
  if (key.includes('key rule') || key.includes('watch') || key.includes('trap')) return 'pink'
  if (key.includes('tip') || key.includes('smart')) return 'green'
  if (key.includes('add') || key.includes('subtract') || key.includes('when')) return 'teal'
  if (key.includes('geometric') || key.includes('interpret')) return 'gold'
  return 'pink'
}

/** Split worked-example body into sequential steps. */
export function parseWorkedExampleSteps(body: string): string[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  const numbered = trimmed
    .split(/\n(?=\d+\.\s)/)
    .map((s) => s.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)

  if (numbered.length > 1) return numbered

  return trimmed
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}
