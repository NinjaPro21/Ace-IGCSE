/**
 * Shared math/LaTeX pipeline for content scripts.
 * Mirrors src/lib/mathMarkdown.ts — keep in sync when changing rules.
 */

export function decodeHTMLEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

function stripInvisibleChars(str) {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '')
}

export function fixMarkdownTables(text) {
  return text.replace(/(\|[^\n]*\|)\n\n+(?=\|)/g, '$1\n')
}

export function fixLonelyOpeningDollarDisplay(text) {
  return text.replace(/(^|\n)\$\s*\r?\n([\s\S]*?)\r?\n\s*\$\$(?!\$)/g, (_, lead, inner) => {
    const body = inner.trim()
    return body ? `${lead}$$\n${body}\n$$` : `${lead}$$`
  })
}

export function fixSplitDisplayMath(text) {
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  return parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part.replace(/\$([^$]+?)\.\s+\$(?=[A-Za-z\\])/g, '$1$. $2')
    })
    .join('')
}

export function fixThousandsCommasInMath(text) {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/)
  return parts
    .map((part) => (part.startsWith('$') ? part.replace(/(\d),(\d{3})/g, '$1$2') : part))
    .join('')
}

function wrapBareMath(text) {
  const segments = text.split(/(\$[^$]+\$|\$\$[\s\S]*?\$\$)/)
  return segments
    .map((seg) => {
      if (seg.startsWith('$')) return seg
      return seg
        .replace(/(\d+)\^\(([^)]+)\)/g, (_, base, exp) => `$${base}^{${exp}}$`)
        .replace(/(\d+)\^\{([^}]+)\}/g, (_, base, exp) => `$${base}^{${exp}}$`)
        .replace(/\(([a-zA-Z0-9+x\- ]+)\)(\d+)/g, (_, inner, exp) => `$(${inner})^{${exp}}$`)
        .replace(/\b([a-zA-Z])\^(\d+)\b/g, (_, v, exp) => `$${v}^{${exp}}$`)
        .replace(/\bdy\/dx\b/g, '$\\frac{dy}{dx}$')
        .replace(/\bdu\/dx\b/g, '$\\frac{du}{dx}$')
        .replace(/\bdv\/dx\b/g, '$\\frac{dv}{dx}$')
        .replace(/\bd²y\/dx²\b/g, '$\\frac{d^2y}{dx^2}$')
        .replace(/δy/g, '$\\delta y$')
        .replace(/δx/g, '$\\delta x$')
    })
    .join('')
}

function wrapBareDisplayLatexLines(text) {
  return text.replace(
    /(^|\n\n)(\\(?:frac|text|int|begin|left|Rightarrow)[^\n]+)(\n\n)(?=<!--|\\|\*\*|##|\n\n\\|$)/g,
    (_, lead, line, gap) => `${lead}$$\n${line.trim()}\n$$${gap}`,
  )
}

export function normalizeMathMarkdown(raw) {
  if (!raw || typeof raw !== 'string') return raw
  let text = decodeHTMLEntities(raw)
  text = stripInvisibleChars(text).trim()
  text = text.replace(/\\\\/g, '\\')

  text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, inner) => `$$\n${inner.trim()}\n$$`)
  text = text.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, inner) => `$${inner.trim()}$`)

  text = fixLonelyOpeningDollarDisplay(text)
  text = wrapBareDisplayLatexLines(text)
  text = text.replace(/<!-- k-variant -->\n\n(\\[^\n]+)/g, '<!-- k-variant -->\n\n$$\n$1\n$$')

  text = text.replace(/([^\n\s$])(\$\$)/g, '$1\n\n$2')
  text = text.replace(/\$([^$\n]+?)\$\$(?=\S)/g, (_, inner) => `$${inner}$\n\n$$`)

  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => `$$\n${inner.trim()}\n$$`)

  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  text = parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part.replace(/\$([^$\n]+?)\$/g, (_, inner) => `$${inner.trim()}$`)
    })
    .join('')

  text = fixMarkdownTables(text)
  text = fixSplitDisplayMath(text)
  text = fixThousandsCommasInMath(text)
  text = wrapBareMath(text)
  return repairMathMarkdown(text)
}

function sanitizeMathInner(inner) {
  return inner
    .trim()
    .replace(/\\+\s*$/g, '')
    .replace(/√(\d+)/g, '\\sqrt{$1}')
    .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/([0-9a-zA-Z])\²/g, '$1^2')
    .replace(/([0-9a-zA-Z])\³/g, '$1^3')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/−/g, '-')
    .replace(/(\d+(?:\.\d+)?)\s*%/g, '$1\\%')
    .replace(/([^\\])%([^%\n])/g, '$1\\%$2')
    .replace(/\\text\{([^}]*)\^(\d+)\}/g, '\\text{$1}^{$2}')
    .replace(/10\^(\d)/g, '10^{$1}')
    .replace(/\$\s*10\^\$\s*(\d)/g, '10^{$1}')
    .replace(/\\begin\{aligned\}([\s\S]*)/g, (match, body) => {
      if (/\\end\{aligned\}/.test(match)) return match
      return `\\begin{aligned}${body}\\end{aligned}`
    })
}

function fixProseMathGlue(text) {
  const englishAfter = new Set(['is', 'are', 'was', 'per', 'and', 'or', 'the', 'for', 'to', 'in', 'of', 'at', 'by', 'where', 'when', 'that', 'with', 'from', 'as', 'an', 'a', 'since', 'this', 'causes', 'excludes'])
  const englishBefore = new Set(['at', 'since', 'the', 'when', 'if', 'so', 'this', 'that', 'find', 'show', 'write'])
  return text
    .replace(new RegExp(`\\b(${[...englishBefore].join('|')})\\$`, 'gi'), (_, w) => `${w} $`)
    .replace(/\$([^$\n]{1,80}?)\$([a-zA-Z]{2,})/g, (match, inner, word) =>
      englishAfter.has(word.toLowerCase()) ? `$${inner}$ ${word}` : match,
    )
    .replace(/([a-zA-Z]{2,})\$([^$\n]{1,80}?)\$/g, (match, word, inner) =>
      englishAfter.has(word.toLowerCase()) ? `${word} $${inner}$` : match,
    )
    .replace(/f⁻¹/g, '$f^{-1}$')
}

function fixBrokenPartialDisplayMath(text) {
  return text
    .replace(/\$\$\s*\n(\\[^\n$]+?)\$([a-zA-Z])/g, (_, expr, ch) => `$${expr.trim()}$ ${ch}`)
    .replace(/\$\$\s*\n(\d+(?:\.\d+)?)\$/g, (_, n) => `$${n}$`)
}

export function repairMathMarkdown(text) {
  if (!text || typeof text !== 'string') return text
  let t = text

  t = fixBrokenPartialDisplayMath(t)
  t = fixProseMathGlue(t)
  t = t.replace(/\$\$\s*\n([\s\S]*?)\n\$(?=\s*## )/g, '$$\n$1\n$$\n')
  t = t.replace(/\$\$\s*\n([^\n]+)\n\$(?=\*\*|##|[A-Z])/g, '$$\n$1\n$$')
  t = t.replace(/\*\*([^*]+)\*\*\s+\$\$/g, (_, title) => `**${title}**\n\n$$`)
  t = t.replace(/([.!?])\s+\$\s+\$\$/g, (_, p) => `${p}\n\n$$`)
  t = t.replace(/(?<!\$)\$\s+\$\$/g, () => '\n\n$$')
  t = t.replace(/\$\$\s*\n\s*\$\$/g, '')
  t = t.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const cleaned = sanitizeMathInner(inner)
    return cleaned ? `$$\n${cleaned}\n$$` : ''
  })
  t = t.replace(/\$([^$\n]+?)\$/g, (_, inner) => `$${sanitizeMathInner(inner)}$`)
  t = t.replace(/(\d+\.\s+\*\*[^*]+\*\*[^\n]*?)(?=\s+\d+\.\s+\*\*)/g, '$1\n\n')
  return t
}

export function fixQuizLatexText(raw) {
  if (!raw || typeof raw !== 'string') return raw
  let text = decodeHTMLEntities(stripInvisibleChars(raw))
  text = text.replace(/\\{2,}(?=[a-zA-Z{[(])/g, '\\')
  text = text.replace(/\\int\{([^}]+)\}\^\{/g, '\\int_{$1}^{')
  text = text.replace(/√(\d+)/g, '\\sqrt{$1}')
  text = text.replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
  text = text.replace(/\$\$\$/g, () => '$$')
  text = text.replace(/\\+\s*$/g, '')
  text = text.replace(/\\text\{([^}]*)\^(\d+)\}/g, '\\text{$1}^{$2}')
  return normalizeMathMarkdown(text)
}

export function normalizeTitleMath(raw) {
  if (!raw || typeof raw !== 'string') return raw
  let t = decodeHTMLEntities(stripInvisibleChars(raw.trim()))
  t = t.replace(/∣/g, '|').replace(/−/g, '-')
  if (/\$[^$]+\$/.test(t)) return fixQuizLatexText(t)
  t = t.replace(/\b1\s*\/\s*\(([^)]+)\)/g, (_, inner) => `$\\frac{1}{${inner.trim()}}$`)
  t = t.replace(/\b1\s*\/\s*([a-zA-Z0-9]+)\b/g, (_, d) => `$\\frac{1}{${d}}$`)
  t = t.replace(/\by\s*=\s*\|f\s*\(\s*x\s*\)\|/gi, '$y = |f(x)|$')
  t = t.replace(/\|f\s*\(\s*x\s*\)\|\s*=\s*g\s*\(\s*x\s*\)/gi, '$|f(x)| = g(x)$')
  t = t.replace(/\bf\s*\(\s*x\s*\)\s+is\s+(Linear|Quadratic)/gi, (_, word) => `$f(x)$ is ${word}`)
  return fixQuizLatexText(t)
}

/** @param {'note'|'quiz'|'title'} context */
export function prepareMathContent(raw, context = 'note') {
  if (!raw || typeof raw !== 'string') return raw
  switch (context) {
    case 'title':
      return normalizeTitleMath(raw)
    case 'quiz':
      return fixQuizLatexText(raw)
    default:
      return normalizeMathMarkdown(raw)
  }
}

/** Extract math segments for KaTeX validation. */
export function extractMathSegments(text) {
  if (!text || typeof text !== 'string') return []
  const segments = []
  const display = [...text.matchAll(/\$\$([\s\S]*?)\$\$/g)]
  for (const m of display) segments.push({ kind: 'display', math: m[1].trim(), raw: m[0] })
  const stripped = text.replace(/\$\$[\s\S]*?\$\$/g, '')
  const inline = [...stripped.matchAll(/\$([^$\n]+?)\$/g)]
  for (const m of inline) segments.push({ kind: 'inline', math: m[1].trim(), raw: m[0] })
  return segments
}

/** Structural checks that do not need KaTeX. */
export function findMathStructureIssues(text, { file = '', field = '' } = {}) {
  const issues = []
  if (!text || typeof text !== 'string') return issues
  const prefix = file ? `${file}${field ? ` (${field})` : ''}: ` : ''

  const strippedForOrphan = text
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$\n]+\$/g, '')
    .replace(/\$\d[\d,]*(?:\.\d+)?/g, '')
  const orphan = (strippedForOrphan.match(/(?<!\\)\$/g) || []).length
  if (orphan > 0) {
    issues.push({ level: 'warn', message: `${prefix}${orphan} stray $ outside math delimiters` })
  } else {
    const dollars = (text.match(/(?<!\\)\$/g) || []).length
    if (dollars % 2 !== 0) {
      issues.push({ level: 'warn', message: `${prefix}Unclosed $ delimiter (${dollars} dollar signs)` })
    }
  }

  if (/\$\$[\s\S]*?\$\$[\s\S]*?\$\$/.test(text.replace(/\$\$[\s\S]*?\$\$/g, (m, i, s) => {
    return ''
  }))) {
    // adjacent $$ without newline — soft warning
  }

  if (/(?<![\d$])\(([a-zA-Z0-9+x\- ]+)\)(\d+)(?![\d$])/.test(text.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^$\n]+\$/g, ''))) {
    issues.push({ level: 'warn', message: `${prefix}Possible broken power e.g. (x+1)2 outside math delimiters` })
  }

  if (/(?<!\$)\bdy\/dx\b(?!\$)/.test(text)) {
    issues.push({ level: 'warn', message: `${prefix}Bare dy/dx outside math delimiters` })
  }

  if (/## Key formulas[\s\S]*?(?<!\$)\$[^$\n]{3,}\$(?!\$)/m.test(text) && !/\*\*[^*]+\*\*/m.test(text.split('## Key formulas')[1]?.slice(0, 500) ?? '')) {
    issues.push({ level: 'warn', message: `${prefix}Key formulas section uses inline $ only — prefer **Title** + $$ display blocks` })
  }

  return issues
}
