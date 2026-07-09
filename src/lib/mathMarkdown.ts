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
/** Wrap orphan LaTeX lines (e.g. \\frac{...}) that lost $$ delimiters during import. */
function wrapBareDisplayLatexLines(text: string): string {
  return text.replace(
    /(^|\n\n)(\\(?:frac|text|int|begin|left|Rightarrow)[^\n]+)(\n\n)(?=<!--|\\|\*\*|##|\n\n\\|$)/g,
    (_, lead, line, gap) => `${lead}$$\n${line.trim()}\n$$${gap}`,
  )
}

export function normalizeMathMarkdown(raw: string): string {
  // Step 1: entity decode must happen before any LaTeX processing
  let text = decodeHTMLEntities(raw)
  // Step 2: remove zero-width chars
  text = stripInvisibleChars(text).trim()
  text = closeUnclosedDisplayMath(text)
  // Step 3: literal double-backslash from JSON string escaping → real single backslash
  text = text.replace(/\\\\/g, '\\')
  text = repairImportedNoteMath(text)

  // Convert \[...\] display math
  text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, inner: string) => {
    return `$$\n${inner.trim()}\n$$`
  })
  text = text.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, inner: string) => {
    return `$${inner.trim()}$`
  })

  text = fixLonelyOpeningDollarDisplay(text)
  text = wrapBareDisplayLatexLines(text)
  text = text.replace(/<!-- k-variant -->\n\n(\\[^\n]+)/g, '<!-- k-variant -->\n\n$$\n$1\n$$')

  // Ensure display math is not glued to prose on the same line
  text = text.replace(/([^\n\s$])(\$\$)/g, '$1\n\n$2')
  // Inline math immediately followed by display math on the same line
  text = text.replace(/\$([^$\n]+?)\$\$(?=\S)/g, (_, inner: string) => `$${inner}$\n\n$$`)

  // Normalise display math blocks (before any adjacent-block handling)
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

  text = fixMarkdownTables(text)
  text = fixInlinePipeTables(text)
  text = fixSplitDisplayMath(text)
  text = fixThousandsCommasInMath(text)
  text = fixDocxPhysicsLatex(text)
  text = splitMultiFormulaDisplayBlocks(text)
  text = wrapOrphanLatexLines(text)
  text = fixInlineMathLines(text)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner: string) => {
    const cleaned = inner
      .split('\n')
      .map((l) => l.trim().replace(/^\$+/, '').replace(/\$+$/, ''))
      .filter(Boolean)
      .join('\n')
    return cleaned ? `$$\n${cleaned}\n$$` : ''
  })

  text = wrapBareMath(text)
  text = closeUnclosedDisplayMath(text)
  return repairMathMarkdown(text)
}

/** Clean inner LaTeX before KaTeX render. */
function sanitizeMathInner(inner: string): string {
  return inner
    .trim()
    .replace(/^\$+/, '')
    .replace(/\$+$/, '')
    .replace(/\$([^$]+)\$/g, '$1')
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
    .replace(/\\text\{([^}]*)\s\^(\d+)\}/g, '\\text{$1}^{$2}')
    .replace(/_\$(\d+)\^\{([^}]+)\}\$/g, '_$1^{$2}')
    .replace(/_\$(\d+)\^\{/g, '_$1^{')
    .replace(/_\$(\d+)\$/g, '_$1')
    .replace(/p_\$(\d+)/g, 'p_$1')
    .replace(/\\d\\frac/g, '\\frac')
    .replace(/10\^(\d)/g, '10^{$1}')
    .replace(/\$\s*10\^\$\s*(\d)/g, '10^{$1}')
    .replace(/\\begin\{aligned\}([\s\S]*)/g, (match, body) => {
      if (/\\end\{aligned\}/.test(match)) return match
      return `\\begin{aligned}${body}\\end{aligned}`
    })
}

/** Prose glued to $ delimiters — only common English words (where$v$is). */
function fixProseMathGlue(text: string): string {
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

/** Broken partial display blocks from import: $$\nexpr$word (expr must look like LaTeX) */
function fixBrokenPartialDisplayMath(text: string): string {
  let t = text
  t = t.replace(/\$\$\s*\n(\\[^\n$]+?)\$([a-zA-Z])/g, (_, expr, ch) => `$${expr.trim()}$ ${ch}`)
  t = t.replace(/\$\$\s*\n(\d+(?:\.\d+)?)\$/g, (_, n) => `$${n}$`)
  // Unclosed display block at end of quiz option: $$\n\frac{…}\n
  t = t.replace(/\$\$\s*\n([\s\S]+?)\s*\n$/g, (_, expr) => {
    const trimmed = expr.trim()
    if (!trimmed || trimmed.includes('$$')) return `$$\n${expr}\n`
    return `$${trimmed}$`
  })
  return t
}

/** Fix common markdown/LaTeX glue issues from import or batch normalizers. */
export function repairMathMarkdown(text: string): string {
  let t = text

  t = moveSentencePunctuationOutsideInlineMath(t)
  t = fixBrokenPartialDisplayMath(t)
  t = fixProseMathGlue(t)
  t = t.replace(/\$\$\s*\n([\s\S]*?)\n\$(?=\s*## )/g, '$$\n$1\n$$\n')
  t = t.replace(/\$\$\s*\n([^\n]+)\n\$(?=\*\*|##|[A-Z])/g, '$$\n$1\n$$')

  t = t.replace(/\*\*([^*]+)\*\*\s+\$\$/g, (_, title) => `**${title}**\n\n$$`)
  t = t.replace(/([.!?])\s+\$\s+\$\$/g, (_, p) => `${p}\n\n$$`)
  t = t.replace(/(?<!\$)\$\s+\$\$/g, () => '\n\n$$')
  t = t.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner: string) => (inner.trim() ? match : ''))

  t = t.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const cleaned = sanitizeMathInner(inner)
    return cleaned ? `$$\n${cleaned}\n$$` : ''
  })

  t = t.replace(/\$([^$\n]+?)\$/g, (_, inner) => `$${sanitizeMathInner(inner)}$`)

  t = t.replace(/(\d+\.\s+\*\*[^*]+\*\*[^\n]*?)(?=\s+\d+\.\s+\*\*)/g, '$1\n\n')

  return t
}

/** Merge a display-math block with a trailing inline result (common import artefact). */
/** Merge k-toggle / import artefact: lone `$` line + content + closing `$$` → full display block. */
export function fixLonelyOpeningDollarDisplay(text: string): string {
  return text.replace(/(^|\n)\$\s*\r?\n([\s\S]*?)\r?\n\s*\$\$(?!\$)/g, (_, lead, inner) => {
    const body = inner.trim()
    return body ? `${lead}$$\n${body}\n$$` : `${lead}$$`
  })
}

export function fixSplitDisplayMath(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  return parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part.replace(/\$([^$]+?)\.\s+\$(?=[A-Za-z\\])/g, '$1$. $2')
    })
    .join('')
}

/** Commas in large numbers break KaTeX — remove grouping commas inside math delimiters. */
export function fixThousandsCommasInMath(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/)
  return parts
    .map((part) => (part.startsWith('$') ? part.replace(/(\d),(\d{3})/g, '$1$2') : part))
    .join('')
}

/** Remove blank lines inside markdown tables so GFM can parse them. */
export function fixMarkdownTables(text: string): string {
  return text.replace(/(\|[^\n]*\|)\n\n+(?=\|)/g, '$1\n')
}

/** Turn inline pipe tables (common in worked examples) into proper markdown tables. */
export function fixInlinePipeTables(text: string): string {
  return text.replace(
    /([:.!?])\s*(\|(?:[^|\n]+\|)+(?:[ \t]+\|(?:[-:\s|]+|\$[^|]+\|[^|]*)+\|)+)/g,
    (_, punct, table) => {
      const rows = table
        .trim()
        .replace(/[ \t]*\|[ \t]*\|/g, '\n|')
        .replace(/^\|?\s*/, '| ')
      return `${punct}\n\n${rows}\n\n`
    },
  )
}

/** Fix LaTeX commands stripped by Word/docx JSON export (physics quizzes). */
function fixDocxPhysicsLatex(text: string): string {
  let t = text
  t = t.replace(/\^circtext\{([^}]+)\}/g, '^\\circ\\text{$1}')
  t = t.replace(/([^\\])text\{/g, '$1\\text{')
  t = t.replace(/(\d+(?:\.\d+)?)text\{/g, '$1 \\text{')
  t = t.replace(/([^\\])frac\{/g, '$1\\frac{')
  t = t.replace(/(\d+(?:\.\d+)?)\s+times\s+(\d+(?:\.\d+)?)/g, '$1 \\times $2')
  t = t.replace(/(\d+(?:\.\d+)?)\s+times\s+10/g, '$1 \\times 10')
  t = t.replace(/=\s+(\d+(?:\.\d+)?)\s+times\s+/g, '= $1 \\times ')
  t = t.replace(/([^\\])approx(\s)/g, '$1\\approx$2')
  t = t.replace(/([^\\])lambda(\b)/g, '$1\\lambda')
  t = t.replace(/([^\\])propto(\b)/g, '$1\\propto')
  t = t.replace(/(\d)\s+pi\s/g, '$1\\pi ')
  t = t.replace(/\b2\s+pi\b/g, '2\\pi')
  return t
}

/** Word docx JSON often splits exponents onto their own lines: x\\n2\\n → x^2 */
function fixDocxExponentNewlines(text: string): string {
  return text
    .replace(/\(([a-zA-Z0-9+\-− ]+)\)\r?\n(\d+)\r?\n/g, (_, inner, exp) => `$(${inner.replace(/−/g, '-')})^{${exp}}$`)
    .replace(/([a-zA-Z0-9)])(\r?\n)(\d+)(\r?\n)/g, (_, base, _nl1, exp) => `$${base}^{${exp}}$`)
    .replace(/\(([a-zA-Z0-9+\-− ]+)\)\r?\n(\d+)/g, (_, inner, exp) => `$(${inner.replace(/−/g, '-')}^{${exp}}$`)
}

/** True when text still has raw docx fraction artefacts (safe to run frac repair). */
function hasRawDocxFractionArtifacts(text: string): boolean {
  return (
    /\r?\nfrac/.test(text) ||
    /(?<![\\a-zA-Z{])frac\d/.test(text) ||
    /(?<![\\a-zA-Z{])frac\d+\(/.test(text)
  )
}

/** Close `$$` display blocks left open before headings or at EOF (common import artefact). */
export function closeUnclosedDisplayMath(text: string): string {
  const lines = text.split('\n')
  let open = false
  const out: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '$$') {
      if (open) {
        open = false
        out.push('$$')
      } else {
        open = true
        out.push('$$')
      }
    } else if (open && /^##\s/.test(line)) {
      out.push('$$')
      out.push('')
      open = false
      out.push(line)
    } else {
      out.push(line)
    }
  }
  if (open) out.push('$$')
  return out.join('\n')
}

/** Remove nested $…$ inside an outer $…$ block (common docx import artefact). */
export function stripNestedInlineDollars(text: string): string {
  let t = text
  for (let i = 0; i < 6; i++) {
    const next = t.replace(/\$([^$]+)\$/g, (_, inner: string) => {
      if (!inner.includes('$')) return `$${inner}$`
      return `$${inner.replace(/\$([^$]+)\$/g, '$1')}$`
    })
    if (next === t) break
    t = next
  }
  return t
}

/** Repair newline-split commands and other quiz import artefacts. */
export function repairQuizImportArtifacts(text: string): string {
  let t = text

  t = t.replace(/\\sqrt\{\$([^$]+)\$([^}]*)\}/g, '\\sqrt{$1$2}')
  t = t.replace(/\\frac\{\$([^$]+)\$\(([^)]*)\)\}/g, '\\frac{$1}{$2}')
  t = t.replace(/\\frac\{\$([^$]+)\$\}/g, '\\frac{$1}{')
  t = t.replace(/=\$([^$]+)\$/g, '= $1')
  t = t.replace(/\\implies\$([^$]+)\$/g, '\\implies $1')
  t = t.replace(/\$\\frac\{1\}\{3\(\$\s*e\^\{([^}]+)\}\$-?\s*1\)\}\$/g, '$\\frac{1}{3}(e^{$1}-1)$')
  t = t.replace(/Evaluate\s*\n\s*in\s+_\{?0\}?\^1/gi, 'Evaluate $\\int_0^1')
  t = t.replace(/Evaluate\s*\n\s*in\s+\$t\^\{0\}\$/gi, 'Evaluate $\\int')
  t = t.replace(/\$t\^\{0\}\$(\d+)/g, '_$1')
  t = t.replace(/\\sec\^\{2\}\$x/g, '\\sec^{2} x')
  t = t.replace(/,\s*dx\./g, '\\,dx.')
  t = t.replace(/,\s*dx\b/g, '\\,dx')
  t = t.replace(/\\n,\s*dx/g, '\\,dx')
  t = t.replace(/\\frac\{1\}\{\s*\}/g, '')
  t = t.replace(/\\frac\{(-?\d+)\}\{\s*\}/g, '$1')
  t = t.replace(/\\frac\{([^}]+)\}\{\s*\}/g, '$1')

  t = t.replace(/\\t\\frac/g, '\\frac')
  t = t.replace(/\t\\frac/g, '\\frac')
  t = t.replace(/\\n(sin|cos|tan|sec|csc|cot|log|ln)\b/gi, (_, c) => `\\${c.toLowerCase()}`)
  t = t.replace(/(?<![a-zA-Z])\\n(sin|cos|tan|sec|csc|cot)\b/gi, (_, c) => `\\${c.toLowerCase()}`)
  t = t.replace(/si\$n/gi, '\\sin')
  t = t.replace(/co\$s/gi, '\\cos')
  t = t.replace(/ta\$n/gi, '\\tan')
  t = t.replace(/se\$c/gi, '\\sec')
  t = t.replace(/\$fractional\$/gi, '\\frac{1}{a}')
  t = t.replace(/\$\\frac\{1\}\{3\(\$e\^\{([^}]+)\}\$-?\s*1\)\}\$/g, '$\\frac{1}{3}(e^{$1}-1)$')
  t = t.replace(/(?<![a-zA-Z])([a-z)\}])\s+\$(\d+)\$/g, (_, base, exp) => `${base}^${exp}`)
  t = t.replace(/\be\s+\$(\d+)\$/g, (_, exp) => `e^${exp}`)
  t = t.replace(/\$t\^\{0\}\$1/g, '_0^1')
  t = t.replace(/\\frac\{dydx=\$([^$]+)\$\(-\}\{\}/g, '\\frac{dy}{dx}=$1(-\\sin x)')
  t = t.replace(/\\frac\{dydx=\}\{\}/g, '\\frac{dy}{dx} = ')
  t = t.replace(/\(-\}\{\}/g, '(-\\sin x)')
  t = t.replace(/\\frac\{sinxco\}\{\}/g, '\\frac{\\sin x \\cos x}{x^2}')
  t = t.replace(/\\frac\{pi(\d+)<x<\}\{\}/g, (_, n) => `$\\frac{\\pi}{${n}} < x < \\pi$`)
  t = t.replace(/\\frac\{of\}\{\}/g, '\\frac{dy}{dx} \\text{ of } ')
  t = t.replace(/=\s*2\}\{\}/g, '= 2')
  t = t.replace(/x=\}\{\}/g, 'x^2')
  t = t.replace(/\$d\^\{2\}\$y\$d\$x\^\{2\}\$/g, 'd^2y/dx^2')
  t = t.replace(/\\frac\{\$d\^\{2\}\$y\$d\$x\^\{2\}\$([^}]*)\}\{\}/g, '\\frac{d^2y}{dx^2}')
  t = t.replace(/\\frac\{x\^\{2\}\$-1\}\{2\+3\}\$/g, '\\frac{x^2-1}{2+3}')
  t = t.replace(/\\frac\{1\}\{3\(\$\s*/g, '\\frac{1}{3}(')
  t = t.replace(/\\frac\{1\}\{3\$\s*e\^\{([^}]+)\}\$-?\s*\}/g, '\\frac{1}{3}(e^{$1}-1)')
  t = t.replace(/Evaluate\s*\\int_0\^1\s*\n+\s*e\^\{3x\}/g, 'Evaluate $\\int_0^1 e^{3x}')
  t = t.replace(/Evaluate\s*\\intpi\/(\d+)/g, 'Evaluate $\\int_0^{\\pi/$1}')
  t = t.replace(/\\intpi\/(\d+)/g, '\\int_0^{\\pi/$1}')
  t = t.replace(/in _(\d+)\s*\\sqrt/g, ' of $\\int_0^{$1} \\sqrt')
  t = t.replace(/f\n−1\n/g, '$f^{-1}$')
  t = t.replace(/\\frac\{x\+\}\{/g, '\\frac{x+7}{')
  t = t.replace(/\\frac\{3x\+\}\{/g, '\\frac{3x+7}{')
  t = t.replace(/\\frac\{x-\}\{/g, '\\frac{x-3}{')
  t = t.replace(/\\frac\{7x\+\}\{/g, '\\frac{7x+1}{')

  // Corrupted definite integral: "in $t^{2}$5" → $\int_2^5$
  t = t.replace(/\bin\s+\$t\^\{([^}]+)\}\$(\d+|e)\b/gi, (_, lo, hi) => `$\\int_{${lo}}^{${hi}}$`)
  t = t.replace(/\bin\s+_\{?(\d+)\}?\^\{?(\d+|e)\}?/gi, (_, lo, hi) => `$\\int_${lo}^{${hi}}$`)
  t = t.replace(/(?:Calculate the value of|Find the value of|Evaluate|If)\s*\n+\s*in\s+\$t/gi, (m) =>
    m.replace(/\bin\s+\$t/gi, '$\\int'),
  )

  // Nested frac in one delimiter: $\frac{1}{$x^{2}$}$ → $\frac{1}{x^2}$
  t = t.replace(/\$\\frac\{([^}]*)\}\{\$([^$]+)\$\}\$/g, '$\\frac{$1}{$2}$')
  t = t.replace(/\$\\frac\{\$([^$]+)\$\}\{\}\$/g, '$\\frac{$1}{}$')
  t = t.replace(/\$\\frac\{\$x\^\{2\}\$-52≤x\+5\}\{\}\$/g, '$\\frac{x^2-5}{2} \\le x+5$')
  t = t.replace(/\$\\frac\{\$d\^\{2\}\$y\$d\$x\^\{2\}\$\}\{\}\$/g, '$\\frac{d^2y}{dx^2}$')
  t = t.replace(/second derivative\$\\frac\{\$d\^\{2\}\$y\$d\$x\^\{2\}\$\}\{\}\$/g, 'second derivative $\\frac{d^2y}{dx^2}$')

  // pi interval options: $\frac{pi2<x<$\frac{3}{pi2}$}{}$
  t = t.replace(
    /\$\\frac\{pi(\d+)<x<\$\\frac\{(\d+)\}\{pi(\d+)\}\$\}\{\}\$/g,
    (_, n1, num, n2) => `$\\frac{\\pi}{${n1}} < x < \\frac{${num}\\pi}{${n2}}$`,
  )
  t = t.replace(/\\frac\{pi(\d+)<x</g, '\\frac{\\pi}{$1} < x < ')

  t = t.replace(/\\frac\{du\}\{dx\}\$/g, '\\frac{du}{dx}')
  t = t.replace(/sin\(\$\\frac\{\\pi\}\{(\d+)\}\$\)/g, '\\sin(\\frac{\\pi}{$1})')
  t = t.replace(/\}\{\}/g, '')
  t = t.replace(/(\d+)\\sqrt([a-zA-Z])(?![{a-zA-Z])/g, '$1\\sqrt{$2}')
  t = t.replace(/\\\\+,\s*dx/g, '\\,dx')
  t = t.replace(/\$\\frac\{(\d+)\$\(\}\{([^}]+)\}\$\)\^\{(\d+)\}/g, '$\\frac{$1}{($2)^{$3}}')
  t = t.replace(/\$\\frac\{(\d+)\$\(\}\{([^}]+)\}\$\)\^(\d+)/g, '$\\frac{$1}{($2)^{$3}}')
  t = t.replace(/f\^{-1}\$\(/g, 'f^{-1}(')
  t = t.replace(/f\^{-1}\$\)/g, 'f^{-1})')
  t = t.replace(/\bis\^(\d+)\b/g, 'is $$1$')
  t = t.replace(/gradient is\^0/g, 'gradient is $0$')
  t = t.replace(/\(x-\$\\frac\{\\pi\}\{(\d+)\}\$\)/g, '(x-\\frac{\\pi}{$1})')
  t = t.replace(/2\\aligned\\sec/g, '2\\sec')
  t = t.replace(/\\sqrt(?!\{)([a-zA-Z][a-zA-Z0-9+\-]*)/g, '\\sqrt{$1}')
  t = t.replace(/([A-Za-z])\$(x|[A-Za-z])/g, '$1 $2')
  t = t.replace(/domain\$/g, 'domain $')
  t = t.replace(/If\$/g, 'If $')
  t = t.replace(/and\$/g, 'and $')
  t = t.replace(/\\2\.(\d+)/g, '2.$1')
  t = t.replace(/\\text\{\s*\\approx/g, '\\text{ (approx')
  t = t.replace(/\$z = \\frac\{x\^2 - y\^2\}\{x\^\{-1\}\$\s*\+\s*y\^\{-1\}\$\}/g, '$z = \\frac{x^2 - y^2}{x^{-1} + y^{-1}}$')
  t = t.replace(/\$\$\s*\n(f\^{-1}\([^$]+)\$/g, '$$$1$$')

  return stripNestedInlineDollars(t)
}

/** Fix common docx import issues in note markdown before normalisation. */
export function repairImportedNoteMath(text: string): string {
  let t = text

  t = t.replace(/\$\$\$\$/g, '$$\n\n$$')
  t = t.replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, (_, inner) => {
    const fixed = String(inner)
      .replace(/\s\\(?:\s\\)+/g, ' \\\\ ')
      .replace(/\s\\\s+/g, ' \\\\ ')
    return `\\begin{pmatrix}${fixed}\\end{pmatrix}`
  })
  t = t.replace(
    /\\begin\{pmatrix\}\s*([^\\]+?)\s*(?:\\[\s\\]+)+([^\\]+?)\s*\\end\{pmatrix\}/g,
    (_, a, b) => `\\begin{pmatrix} ${String(a).trim()} \\\\ ${String(b).trim()} \\end{pmatrix}`,
  )
  t = t.replace(/\\begin\{pmatrix\}([^]*?)\\ ([^\\]+?)\\end\{pmatrix\}/g, (_, a, b) =>
    `\\begin{pmatrix} ${String(a).trim()} \\\\ ${String(b).trim()} \\end{pmatrix}`,
  )
  t = t.replace(/\\t\\frac/g, '\\frac')
  t = t.replace(/\t\\frac/g, '\\frac')
  t = t.replace(/([^\n])\.[ \t]+\$\$/g, '$1.\n\n$$')
  t = t.replace(/([=\\implies])\$([^$]+)\$/g, '$1 $2')
  t = t.replace(/\\sqrt\{\$([^$]+)\$([^}]*)\}/g, '\\sqrt{$1$2}')
  t = t.replace(/([a-zA-Z0-9])\s\.\s(?=[a-zA-Z0-9])/g, '$1^2 ')
  t = t.replace(/([a-zA-Z0-9])\s\.\s\+/g, '$1^2 +')
  t = t.replace(/\$\sin\\theta=\$-1\$/g, '$\\sin\\theta = -1$')
  t = t.replace(/,\$(\d+)\^\\circ\)\s*,/g, ', $1^\\circ, ')
  t = t.replace(/\$([0-9]+)\^\\circ\)\s*,/g, '$1^\\circ, ')
  t = t.replace(/(\d|\)|\})\s*,\s*dx\b/g, '$1\\,dx')
  t = t.replace(/\^(\d+),dx\b/g, '^$1\\,dx')

  return closeUnclosedDisplayMath(t)
}

/** Undo batch-normalizer damage: English "fraction" words, 10/(x+1) splits, pi/dy/dx tokens. */
export function repairCorruptedQuizMath(text: string): string {
  let t = text

  t = t.replace(/\\frac\{tion\.\}\{\}/g, 'fraction.')
  t = t.replace(/\\frac\{tion:\}\{\}/g, 'fraction:')
  t = t.replace(/\\frac\{tion\}\{\}/g, 'fraction')
  t = t.replace(/\\frac\{tions\.\}\{\}/g, 'fractions.')
  t = t.replace(/\\frac\{tions\}\{\}/g, 'fractions')
  t = t.replace(/\\frac\{tional\}\{\}/g, 'fractional')

  t = t.replace(/\\frac\{1\}\{0x\+1\}/g, '\\frac{10}{x+1}')
  t = t.replace(/\\frac\{1\}\{0x\+5\}/g, '\\frac{10}{x+5}')
  t = t.replace(/\\frac\{5\}\{0x-2\}/g, '\\frac{10}{x-2}')
  t = t.replace(/\\frac\{10\}\{0x-2\}/g, '\\frac{10}{x-2}')

  t = t.replace(/\\frac\{pi(\d+)\}\{\}/g, (_, n) => `\\frac{\\pi}{${n}}`)
  t = t.replace(/\\frac\{pi(\d+)\+\}\{\}/g, (_, n) => `\\frac{\\pi}{${n}} + `)
  t = t.replace(/\\frac\{pi(\d+)\?\}\{\}/g, (_, n) => `\\frac{\\pi}{${n}}?`)

  t = t.replace(/\\frac\{dydx=\}\{\}/g, '\\frac{dy}{dx} = ')
  t = t.replace(/\\frac\{dydx>0\}\{\}/g, '\\frac{dy}{dx} > 0')
  t = t.replace(/\\frac\{dydx([^}]*)\}\{\}/g, (_, rest) => `\\frac{dy}{dx}${rest}`)
  t = t.replace(/\\frac\{dydx\}\{\}/g, '\\frac{dy}{dx}')
  t = t.replace(/\\frac\{ddx\(\}\{\}/g, '\\frac{d}{dx}(')
  t = t.replace(/\\frac\{ddx\[2\}\{\}/g, '\\frac{d}{dx}[2')
  t = t.replace(/\\frac\{dudx\}\{\}/g, '\\frac{du}{dx}')
  t = t.replace(/\\frac\{dudx=1\}\{\}/g, '\\frac{du}{dx} = 1')
  t = t.replace(/\\frac\{dvdx\+v\}\{\}/g, '\\frac{dv}{dx} + v')
  t = t.replace(/\\frac\{dsdt=-8\}\{\}/g, '\\frac{ds}{dt} = -8')
  t = t.replace(/\\frac\{dxdt\}\{\}/g, '\\frac{dx}{dt}')
  t = t.replace(/\\frac\{drdt\}\{\}/g, '\\frac{dr}{dt}')
  t = t.replace(/\\frac\{dsdt\}\{\}/g, '\\frac{ds}{dt}')
  t = t.replace(/\\frac\{dvdt\}\{\}/g, '\\frac{dv}{dt}')

  t = t.replace(/\\frac\{xx\+1\}\{\}/g, '\\frac{x}{x+1}')
  t = t.replace(/\\frac\{xx\+2\}\{\}/g, '\\frac{x}{x+2}')
  t = t.replace(/\\frac\{x\+\}\{2x-1\}/g, '\\frac{x+2}{2x-1}')
  t = t.replace(/\\frac\{x-12\}\{\}/g, '\\frac{x-1}{2}')
  t = t.replace(/\\frac\{4\}\{\$\(x-\$1\^\{2\}\$\$\}\$/g, '\\frac{4}{(x-1)^{2}}')
  t = t.replace(/\\frac\{4\}\{\$\(x-\$1\^\{2\}\$\$\}/g, '\\frac{4}{(x-1)^{2}}')

  t = t.replace(/\\nsqrt/g, '\\sqrt')
  t = t.replace(/(?<![\\a-zA-Z])\nsqrt/g, '\\sqrt')
  t = t.replace(/\nge(?=\d)/g, ' \\ge ')
  t = t.replace(/\$\(x\+3\^\{2\}\$/g, '$(x+3)^{2}$')

  t = t.replace(/\\frac\{x\+25\}\{\}/g, '\\frac{x+2}{5}')
  t = t.replace(/\\frac\{x-25\}\{\}/g, '\\frac{x-2}{5}')
  t = t.replace(/\\frac\{x-208\}\{\}/g, '\\frac{x-2}{8}')
  t = t.replace(/\\frac\{2\}\{0x\+2\}/g, '\\frac{2}{x+2}')
  t = t.replace(/\\frac\{sinxx\}\{\}/g, '\\frac{\\sin x}{x}')
  t = t.replace(/\\frac\{xcosx-sinxx\}\{\}/g, '\\frac{x\\cos x - \\sin x}{x^2}')
  t = t.replace(/\\frac\{xcosx\+sinxx\}\{\}/g, '\\frac{x\\cos x + \\sin x}{x^2}')
  t = t.replace(/\\frac\{sinx-xcosxx\}\{\}/g, '\\frac{\\sin x - x\\cos x}{x^2}')
  t = t.replace(/\\frac\{cosx1\}\{\}/g, '\\cos x')
  t = t.replace(/\\frac\{pi6=\}\{\}/g, '\\frac{\\pi}{6} = ')
  t = t.replace(/\\frac\{pi48\}\{\}/g, '\\frac{\\pi}{48}')

  return t
}

/** Repair docx-broken \\frac (newline split, missing braces, bare "frac" prefix). */
function fixBrokenDocxFractions(text: string): string {
  if (!hasRawDocxFractionArtifacts(text)) return text

  let t = text
  t = t.replace(/\r?\nfrac/g, '\\frac')
  t = t.replace(/([a-zA-Z0-9\)\}])\r?\n\s*=\s*(?=[0-9−\-/]|\\)/g, '$1 \\neq ')
  t = t.replace(/\r?\nimplies/g, ' \\implies ')
  t = t.replace(/↦/g, '$\\mapsto$')

  const toFrac = (num: string, den: string) => `$\\frac{${num.replace(/−/g, '-')}}{${den.replace(/−/g, '-')}}$`

  // frac4(x−1)2 or frac4(x−1)^2
  t = t.replace(/(?:\\)?frac(\d+)\(([^)]+)\)\^?(\d+)/g, (_, n, inner, exp) =>
    toFrac(n, `(${inner})^{${exp}}`),
  )

  const bracedFrac = (body: string): string | null => {
    const s = body.replace(/−/g, '-').trim()
    if (/^tion|^tional|^tions/.test(s)) return null

    const parenSq = s.match(/^(\d+)\(([^)]+)\)\^?(\d+)$/)
    if (parenSq) return `\\frac{${parenSq[1]}}{(${parenSq[2]})^{${parenSq[3]}}}`

    const digitX = s.match(/^(\d+)(x[+\-][\w+\-]+)$/)
    if (digitX) return `\\frac{${digitX[1]}}{${digitX[2]}}`

    const varX = s.match(/^([a-z])(x[+\-][\w+\-]+)$/)
    if (varX) return `\\frac{${varX[1]}}{${varX[2]}}`

    const simple = s.match(/^(\d)([a-z].+)$/)
    if (simple && simple[2].length > 0) return `\\frac{${simple[1]}}{${simple[2]}}`

    return null
  }

  const fixFracToken = (body: string): string => {
    const braced = bracedFrac(body)
    if (braced) return `$${braced}$`
    return body
  }

  const englishFracGuard = '(?!tion|tions|tional)'

  // \frac without braces — only docx tokens, never English "fraction"
  t = t.replace(
    new RegExp(`\\\\frac(?!\\{)${englishFracGuard}([^\\s,;]+?)(?=(?:\\\\frac(?!\\{)|(?<![\\\\$\\w])frac(?!\\{)|$|\\s|for|\\.|,|\\)|\\]))`, 'g'),
    (_, body) => fixFracToken(body),
  )

  // bare frac (quiz options)
  t = t.replace(
    new RegExp(`(?<![\\\\$\\w])frac(?!\\{)${englishFracGuard}([^\\s,;]+)`, 'g'),
    (_, body) => fixFracToken(body),
  )

  return t
}

/** True when a paragraph is prose with inline $...$ math, not a standalone formula line. */
function isProseWithInlineMath(text: string): boolean {
  if (!/\$[^$]+\$/.test(text)) return false
  const outside = text.replace(/\$[^$]+\$/g, ' ').replace(/\s+/g, ' ').trim()
  return /[A-Za-z]{3,}/.test(outside)
}

/** Wrap plain-text formula lines (no $ delimiters) for key-formula sections. */
function wrapPlainFormulaLines(text: string): string {
  return text
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed || trimmed.startsWith('$') || trimmed.startsWith('**') || trimmed.startsWith('#')) {
        return block
      }
      if (/^-\s/m.test(trimmed)) return block
      if (isProseWithInlineMath(trimmed)) return block
      if (/\\(frac|text|deg|begin)/.test(trimmed)) {
        return `$$\n${trimmed}\n$$`
      }
      if (/[±×≤≥∈]|deg\s|Degree of|\bmax\s*\(/i.test(trimmed)) {
        let line = trimmed
          .replace(/±/g, '\\pm ')
          .replace(/×/g, '\\times ')
          .replace(/≤/g, '\\le ')
          .replace(/≥/g, '\\ge ')
          .replace(/Degree of \[f\(x\)/gi, '\\deg[f(x)')
          .replace(/Degree of \[f\(x\)\×g\(x\)\]/gi, '\\deg[f(x) \\times g(x)]')
          .replace(/\[f\(x\)±g\(x\)\]/g, '[f(x) \\pm g(x)]')
          .replace(/\[f\(x\)×g\(x\)\]/g, '[f(x) \\times g(x)]')
          .replace(/max\(deg f,deg g\)/g, '\\max(\\deg f,\\ \\deg g)')
          .replace(/deg f\+deg g/g, '\\deg f + \\deg g')
          .replace(/(\d)(x\d)/g, '$1x^{$2}') // x2 → x^{2} in plain text
        return `$$\n${line}\n$$`
      }
      return block
    })
    .join('\n\n')
}

/** Repair docx-import mapping notation (x$\\mapsto$$x^{2}$, f:x$\\mapsto$, etc.). */
export function fixBrokenMappingNotation(text: string): string {
  let t = text.replace(/−/g, '-')

  // Known docx-import templates (fix before generic rules)
  t = t.replace(
    /relation x\$\\mapsto\s*\n+\s*\$\$x\^\{2\}\$\s*where the domain is\$\s*\n?([-0-9, ]+)\?/g,
    (_, domain) => {
      const vals = domain.split(',').map((v: string) => v.trim()).join(', ')
      return `relation $x \\mapsto x^{2}$ where the domain is $\\{${vals}\\}$?`
    },
  )
  t = t.replace(
    /mapping x\$\\mapsto\s*\n+\s*\$\$\\frac\{([^}]+)\}\$\s*,/g,
    'mapping $x \\mapsto \\frac{$1}$,',
  )
  t = t.replace(
    /mapping x\$\\mapsto\s*\n+\s*\$\$x\^\{2\}\$\s*([−\-])/g,
    'mapping $x \\mapsto x^{2}$ $1',
  )
  t = t.replace(
    /mapping f:x\$\\mapsto\s*\n+\s*\$\$x\^\{2\}\$\s*\+/g,
    'mapping $f: x \\mapsto x^{2}$ +',
  )
  t = t.replace(
    /function g is defined by g:x\$\\mapsto\s*\n+\s*\$\$\\frac\{([^}]+)\}\$\s*for/g,
    'function $g$ is defined by $g: x \\mapsto \\frac{$1}$ for',
  )

  // $x \mapsto 5-\n\n$$x^{2} for the domain$\{-1, 0, 1, 2\}$
  t = t.replace(
    /\$([a-zA-Z])\s*\\mapsto\s*(\d+)\s*([-+])\s*\n+\s*\$\$\s*([^$]+)\$\s*for the domain\s*\$\\{([^}]+)\\}\$/g,
    (_, v, n, op, expr, domain) => {
      const core = expr.trim().split(/\s+for\s/i)[0].trim()
      return `$${v} \\mapsto ${n} ${op} ${core}$ for the domain $\\{${domain}\\}$`
    },
  )

  // $x \mapsto 5+\n\n$$\frac{2}{x}2
  t = t.replace(
    /\$([a-zA-Z])\s*\\mapsto\s*(\d+)\s*\+\s*\n+\s*\$\$\\frac\{([^}]+)\}\{([^}]+)\}(\d+)/g,
    '$$$1 \\mapsto $2 + \\frac{$3}{$4}$',
  )

  // Generic inline broken by orphan $$ block (single-line quiz strings)
  t = t.replace(
    /(\$[^$\n]{1,160})\n+\s*\$\$\s*([^$\n]{1,160})\$\s*/g,
    (match, left, inner) => {
      if (/\\frac\{[^}]*\}\{y=/.test(inner)) return match
      const l = left.replace(/^\$/, '').trimEnd()
      const i = inner.replace(/\s+for the domain.*/i, '').trim()
      if (/\\mapsto\s*\d+\s*[-+]$/.test(l)) return `$${l}${i}$ `
      return `$${l} ${i}$ `
    },
  )

  // $x \mapsto 5 - x^{2} for the domain$\{-1, 0, 1, 2\}$ (must run before generic domain glue)
  t = t.replace(
    /\$([a-zA-Z])\s*\\mapsto\s*([^$]+?)\s+for the domain\s*\$\\{([^}]+)\\}\$/g,
    '$$$1 \\mapsto $2$ for the domain $\\{$3\\}$',
  )
  t = t.replace(
    /\$([a-zA-Z])\s*\\mapsto\s*([^$]+?)\s+where the domain is\s*\$\\{([^}]+)\\}\$/g,
    '$$$1 \\mapsto $2$ where the domain is $\\{$3\\}$',
  )

  t = t.replace(/for the domain\$\\{([^}]+)\\}\$/g, 'for the domain $\\{$1\\}$')

  // when the domain is\n2,4,6. (no braces)
  t = t.replace(/when the domain is\s*\n([0-9,.\-]+)\./g, (_, vals) => {
    const list = vals.split(',').map((v: string) => v.trim()).join(', ')
    return `when the domain is $\\{${list}\\}$.`
  })

  t = t.replace(/for x\s*\n+\s*\$\$\s*\\neq\s*(\d+)/g, 'for $x \\neq $1$')
  t = t.replace(/where x\s*\n+\s*\$\$\s*\\neq\s*(\d+)/g, 'where $x \\neq $1$')

  const trimMappingExpr = (expr: string): string => {
    const m = expr.match(
      /^(.+?)(?=\s+(?:has the domain|for the domain|when the domain|with the domain|has domain|for x|find|state|determine|given|explain|which|when|with)\b|[.,?]|$)/i,
    )
    return (m?.[1] ?? expr).replace(/\s+where the domain is$/i, '').trim()
  }

  // f:x$\mapsto\n\n$$expr$ or g:x$\mapsto\n\n$$\frac{...}$
  t = t.replace(
    /([a-zA-Z]):([a-zA-Z])\$\\mapsto\s*(?:\n+\s*)?\$\$\s*([^$]+)\$\s*/g,
    (_, fn, variable, expr) => `$${fn}: ${variable} \\mapsto ${trimMappingExpr(expr)}$ `,
  )
  // x$\mapsto\n\n$$expr$
  t = t.replace(
    /(?<![a-zA-Z]:)([a-zA-Z])\$\\mapsto\s*(?:\n+\s*)?\$\$\s*([^$]+)\$\s*/g,
    (_, variable, expr) => `$${variable} \\mapsto ${trimMappingExpr(expr)}$ `,
  )

  // f:x$\mapsto$expr
  t = t.replace(
    /([a-zA-Z]):([a-zA-Z])\$\\mapsto\$([^$\n]+)/g,
    (_, fn, variable, rest) => {
      const expr = trimMappingExpr(rest)
      const tail = rest.slice(expr.length)
      return `$${fn}: ${variable} \\mapsto ${expr}$${tail}`
    },
  )
  // x$\mapsto$expr
  t = t.replace(
    /(?<![a-zA-Z:])([a-zA-Z])\$\\mapsto\$([^$\n]+)/g,
    (_, variable, rest) => {
      const expr = trimMappingExpr(rest)
      const tail = rest.slice(expr.length)
      return `$${variable} \\mapsto ${expr}$${tail}`
    },
  )

  // $x \mapsto x^{2} where the domain is$ → $x \mapsto x^{2}$ where the domain is
  t = t.replace(
    /\$([a-zA-Z]:?\s?[a-zA-Z]?\\mapsto[^$]+?)\s+where the domain is\$/g,
    '$$$1$ where the domain is',
  )

  // (−1)$\mapsto$4 in explanations
  t = t.replace(/\(([^)]+)\)\$\\mapsto\$([^,\s.]+)/g, '$$($1) \\mapsto $2$$')

  // where the domain is$\n−2,2? or where the domain is$\{-2, 2\}$?
  t = t.replace(/where the domain is\$\s*\n?(\{?[-0-9, ]+\}?)\??/g, (_, domain) => {
    const cleaned = domain.replace(/^\{|\}$/g, '').replace(/\?$/,'').trim()
    if (cleaned.includes(',')) {
      const vals = cleaned.split(',').map((v: string) => v.trim()).join(', ')
      return `where the domain is $\\{${vals}\\}$?`
    }
    return `where the domain is $${cleaned}$?`
  })

  // "domain\n−3,0,3,6" — preserve "has the domain" wording
  t = t.replace(/domain\s*\n([-0-9,≤≥<> ]+)/g, (_, vals) => {
    const list = vals.trim().split(',').map((v: string) => v.trim()).join(', ')
    return `domain $\\{${list}\\}$`
  })
  // domain still glued inside math: "...domain$-3,0,3,6"
  t = t.replace(/domain\$([-\d,]+)/g, (_, vals) => {
    const list = vals.split(',').map((v: string) => v.trim()).join(', ')
    return `domain $\\{${list}\\}$`
  })

  // 5−$x^{2}$ → $5 - x^{2}$
  t = t.replace(/(\d+)−\$(x\^\{[^}]+\})\$/g, '$$$1 - $2$$')

  // Corrupted import fractions
  t = t.replace(/\\frac\{2x-\}\{1x\+3\}/g, '\\frac{2x-1}{x+3}')

  // Trailing $ from broken display blocks — not when $ closes inline math before "where"
  t = t.replace(/(?<![\d})\]\\])\$ where/g, ' where')
  // Orphan $ glued after a bare number+period at line end (docx), not inline-math close-before-period
  t = t.replace(/(?<!\$[^$\n]{0,120})(\d)\.\$(\s*)$/gm, '$1.$2')
  t = t.replace(/\$ for \$x\$/g, ' for $x$')
  // Final pass: mapping + domain must not share one $...$ block
  t = t.replace(
    /\$([a-zA-Z]:?\s?[a-zA-Z]?\\mapsto[^$]+)\$\s+where the domain is\s+\$(\{[^}]+\})\$/g,
    '$$1$ where the domain is $$2$',
  )
  t = t.replace(
    /\$([a-zA-Z]:?\s?[a-zA-Z]?\\mapsto[^$]+)\s+where the domain is\s+\$(\{[^}]+\})\$/g,
    '$$1$ where the domain is $$2$',
  )
  t = t.replace(/ for x∈R\.?/g, ' for $x \\in \\mathbb{R}$.')

  // Trailing orphan $$ from import/repair
  t = t.replace(/\?\$\$$/g, '?')
  t = t.replace(/\$\$$/g, '')

  // Fix half-repaired domain sets glued to prose (safety net)
  t = t.replace(
    /(\$[a-zA-Z]:?\s?[a-zA-Z]?\\mapsto[^$]+\$)\s+where the domain is\\{([^}]+)\\}\$/g,
    '$1 where the domain is $\\{$2\\}$',
  )

  return t
}

/** Close inline math before English prose glued after a mapping/fraction (docx import). */
function fixProseTrappedInInlineMath(text: string): string {
  let t = text

  // $x \mapsto \frac{a}{b} for the domain ... range.$
  t = t.replace(
    /\$((?:[a-zA-Z]:?\s?)?[a-zA-Z]?\s*\\mapsto\s*\\frac\{[^}]+\}\{[^}]+\})\s+(for the domain\s+[^.$]+)\.\s*(Find[^$]+)\.\$/gi,
    (_, map, domain, rest) => `$${map}$ ${domain.trim()}. ${rest.trim()}.`,
  )
  t = t.replace(
    /\$((?:[a-zA-Z]:?\s?)?[a-zA-Z]?\s*\\mapsto\s*\\frac\{[^}]+\}\{[^}]+\})\s+(for the domain\s+[^$]+)\$/gi,
    (_, map, domain) => `$${map}$ ${domain.trim()}`,
  )

  // Trailing orphan $ before ? or . — keep when it closes an open $...$ block
  t = t.replace(/\$([?.!])$/g, (match, _punct, offset, full) => {
    const dollarsBefore = (full.slice(0, offset).match(/(?<!\\)\$/g) ?? []).length
    return dollarsBefore % 2 === 1 ? match : _punct
  })
  t = t.replace(/(\?)\$$/g, '$1')

  return t
}

function isMathFragment(inner: string): boolean {
  return /[=^\\{}]|\d|\\frac|\\le|\\ge/.test(inner) || /x\^/.test(inner) || /[<>]/.test(inner)
}

/** Fix $$5 \\le f(x)≤12$ and mixed \\le / unicode ≤ in one expression. */
function fixMixedInequalityDelimiters(text: string): string {
  let t = text.replace(/\$\$([^$]+)≤([^$]+)\$/g, (_, a, b) => `$${a.trim()} \\le ${b.trim()}$`)
  t = t.replace(/([^$\\]*\\le[^$≤]*)≤([^$\n]*)\$/g, (_, a, b) => {
    const left = a.trim()
    return left.startsWith('$') ? `${left} \\le ${b.trim()}$` : `$${left} \\le ${b.trim()}$`
  })
  t = t.replace(/([^$\\]*\\le[^$≤]*)≤([^$\n]*)$/g, (_, a, b) => `$${a.trim()} \\le ${b.trim()}$`)
  return t
}

/** Close inline math before English prose glued after a comma (import artefact). */
function fixProseAfterMathComma(text: string): string {
  return text
    .replace(
      /\$([^$]+?),\s*((?:find|state|determine|calculate|identify|for which|if)\b[^$]*?)\$/gi,
      (match, math, prose, offset, full) => {
        const dollarsBefore = (full.slice(0, offset).match(/(?<!\\)\$/g) ?? []).length
        if (dollarsBefore % 2 === 0) return match
        const trimmed = math.trim()
        if (!isMathFragment(trimmed) && /[a-zA-Z]{2,}/.test(trimmed)) return match
        return `$${math}$, ${prose.replace(/\$$/, '')}`
      },
    )
    .replace(
      /\$([^$]+)\s+(has real roots[^$]*)\$/gi,
      (_, eq, rest) => `$${eq}$ ${rest.replace(/\$$/, '')}`,
    )
    .replace(/for which f\(x\) \\ge/g, 'for which $f(x) \\ge')
    .replace(/\| for the domain\$/g, '|$ for the domain $')
    .replace(/for the domain\$\\{/g, 'for the domain $\\{')
    .replace(/domain\$\\{([^}]+)\}\$\\le/g, 'domain $\\{$1 \\le')
    .replace(/\$([^$]+)\s+(positive|negative)\$/gi, (_, math, word) => `$${math}$ ${word}`)
    .replace(/\|\s*for\$(-?\d)/g, '|$ for $$1')
    .replace(/for\$(-?\d)/g, 'for $$1')
    .replace(
      /\bis (\d+)\$,\s*((?:find|given|state|determine|calculate|identify)\b)/gi,
      'is $1, $2',
    )
    .replace(
      /\b(values? of) ([a-zA-Z])\$/g,
      (_, phrase, v) => `${phrase} $${v}$`,
    )
}

/** Merge split inline math from docx import ($x^{2}$-9, 2$x^{2}$+7x, $x^{2}$≤9). */
function fixSplitInlineMath(text: string): string {
  let t = text
  t = t.replace(/\$([^$]+)\$(≤|≥)([^$.,?;\n]+)/g, (_, expr, ineq, rest) => {
    const op = ineq === '≤' ? '\\le' : '\\ge'
    return `$${expr} ${op} ${rest.trim()}$`
  })
  t = t.replace(/\$([^$]+)\$([+-][^$≤≥\n]+?)(≤|≥)([^$.,?;\n]*)/g, (_, expr, mid, ineq, rest) => {
    const op = ineq === '≤' ? '\\le' : '\\ge'
    return `$${expr}${mid} ${op} ${rest.trim()}$`
  })
  t = t.replace(
    /(\d)\$([^$\s]{1,30})\$([a-zA-Z0-9+\-=().|^\\]+)/g,
    (_, d, inner, tail) => `$${d}${inner}${tail}$`,
  )
  t = t.replace(/\$([^$]+)\$([+\-][^$|≤≥\n]+)/g, (_, inner, tail) => {
    if (!isMathFragment(inner)) return `$${inner}$${tail}`
    return `$${inner}${tail}$`
  })
  const parts = t.split(/(\$[^$\n]+\$)/)
  t = parts
    .map((part) => {
      if (/^\$[^$\n]+\$$/.test(part)) return part
      for (let i = 0; i < 8; i++) {
        const next = part
          .replace(/\$([^$]+)\$([a-zA-Z0-9+\-*/^()|{}\\]+(?:[<>≤≥=][a-zA-Z0-9+\-*/^()|{}.\\]+)?)/g, (_, inner, tail) => {
            if (!isMathFragment(inner)) return `$${inner}$${tail}`
            if (/^( or | and |,|\s|[-–]coordinates|[-–]axis|[-–]intercept)/i.test(tail)) return `$${inner}$${tail}`
            if (!/^[+\-*/=0-9(]/.test(tail)) return `$${inner}$${tail}`
            return `$${inner}${tail}$`
          })
        if (next === part) break
        part = next
      }
      return part
    })
    .join('')
  return t
}

/** Fix glued inequality ranges (-6≤$x \le 2$ → $-6 \le x \le 2$). */
function fixGluedInequalityRanges(text: string): string {
  return text
    .replace(/(-?\d+(?:\.\d+)?)\s*≤\s*\$([^$]+)\$/g, (_, lo, inner) => `$${lo} \\le ${inner}$`)
    .replace(/(-?\d+(?:\.\d+)?)\s*≥\s*\$([^$]+)\$/g, (_, lo, inner) => `$${lo} \\ge ${inner}$`)
    .replace(/(-?\d+(?:\.\d+)?)≤/g, (_, n) => `$${n} \\le `)
    .replace(/(-?\d+(?:\.\d+)?)≥/g, (_, n) => `$${n} \\ge `)
}

/** Repair newline-split formulas (a $x^{2}\n\n$$+bx+c=0). */
function fixNewlineSplitMathFormulas(text: string): string {
  return text
    .replace(
      /(\w)\s+\$x\^\{2\}\s*\n+\s*\$\$\s*\+bx\+c\s*=\s*0/gi,
      (_, coef) => `$${coef}x^2+bx+c=0$`,
    )
    .replace(/k\s+\$x\^\{2\}\s*\n+\s*\$\$\s*\+8x\+4\s*=\s*0/gi, '$kx^2+8x+4=0$')
    .replace(/\$f\(x\)=-\s*\n+\s*\$\$\s*\n?\(x-1\)\^\{2\}\s*\n?\$\$\./g, '$f(x)=-(x-1)^2$.')
    .replace(/\$f\(x\)=3\+12x-2\s*\n+\s*\$\$\s*x\^\{2\}/g, '$f(x)=3+12x-2x^2')
    .replace(/\$f\(x\)=\|\s*\n+\s*\$\$\s*x\^\{2\}-2x-8\|/g, '$f(x)=|x^2-2x-8|')
    .replace(/\$f\(x\)=12-\|\s*\n+\s*\$\$\s*x\^\{2\}-9\|/g, '$f(x)=12-|x^2-9|')
    .replace(/\ny\s*=\s*\|([^|\n]+)\|\s*\n\$\$\./g, (_, expr) => `$y=|${expr.trim()}|$.`)
    .replace(/y\s*=\s*(\d+)\$\(([^)]+)\)\$\s*([+-]\s*\d+)/g, (_, a, par, k) => `$y=${a}(${par})${k.replace(/\s/g, '')}$`)
}

/**
 * Docx ate "$. So" as "^2 So", duplicated closing $, or split variables across newlines.
 * Example: "$\\ln(x)=5$ $," + "e^2 So x=e^5" + "value of x\\n\\n$."
 */
function fixDocxSoGlueArtifacts(text: string): string {
  let t = text
  t = t.replace(/\$([^$\n]+)\$\s+\$([,.\s])/g, (_, math, punct) => `$${math}$${punct}`)
  t = t.replace(/\$([^$\n]+)\$\s+\$/g, (_, math) => `$${math}$`)
  t = t.replace(/\bvalue of ([a-zA-Z])\s*\n+\s*\$\./gi, (_, v) => `value of $${v}$.`)
  t = t.replace(/\bof ([a-zA-Z])\s*\n+\s*\$\./g, (_, v) => `of $${v}$.`)
  t = t.replace(
    /has a base of \$e\^2 So x = e\^5\$/gi,
    'has a base of $e$. So $x = e^5$',
  )
  t = t.replace(/\$e\^2 So x = e\^5\$/gi, '$e$. So $x = e^5$')
  t = t.replace(/\$([a-zA-Z])\^2 So ([^$]+)\$/g, (_, sym, rest) => `$${sym}$. So $${rest.trim()}$`)
  t = t.replace(/\\pi\^2 So /g, '\\pi$. So $')
  t = t.replace(/(?<=\s)([a-zA-Z0-9])\^2 So /g, (_, c) => `${c}$. So $`)
  t = t.replace(/values of \$m\^2 So \$?y =/gi, 'values of $m$ for which $y =')
  t = t.replace(/= p\^2 So \\lg b = q/gi, '= $p$ and $\\lg b = q$')
  t = t.replace(/= p\^2 So \\ln b = q/gi, '= $p$ and $\\ln b = q$')
  t = t.replace(/\$ \./g, '$.')
  return t
}

/** Docx ate "$N$" as "^N" after prepositions (rate of^12 → rate of $12$). */
function fixDocxCaretGlue(text: string): string {
  return text.replace(
    /\b(of|or|between|by|side|radius|and|at|height|length|ladder)\^(\d+)/gi,
    (_, word, n) => `${word} $${n}$`,
  )
}

/** Repair docx sentence splits ($x$. So $y = …). */
function fixDocxSoSentenceSplits(text: string): string {
  let t = text
  t = t.replace(
    /Find the \$(x|y)\$\. So \$(y = [^$]+)\$ and (?:the curve )?\$([^$]+)\$\./gi,
    (_, coord, line, curve) =>
      `Find the $${coord}$-coordinates where the line $${line}$ intersects the curve $${curve}$.`,
  )
  t = t.replace(
    /Find the \$(y)\$\. So \$([^$]+)\$ and \$([^$]+)\$\./gi,
    (_, coord, eq1, eq2) =>
      `Find the $${coord}$-coordinates of the points of intersection of $${eq1}$ and $${eq2}$.`,
  )
  t = t.replace(
    /A line \$(y = k)\$\. So \$(y = [^$]+)\$\.\s*State/gi,
    (_, line, curve) => `The horizontal line $${line}$ is a tangent to the curve $${curve}$. State`,
  )
  t = t.replace(
    /Given the line \$(y = [^$]+)\$\. So \$(y = [^$]+)\$/gi,
    (_, line, curve) => `Given the line $${line}$ and the curve $${curve}$`,
  )
  t = t.replace(
    /The graph of \$([^$]+)\$ lies entirely above the \$(x)\$\. So \$(y = [^$]+)\$\s*compare\?/gi,
    (_, graph, axis, mod) =>
      `The graph of $${graph}$ lies entirely above the $${axis}$-axis. How does the graph of $${mod}$ compare to the original?`,
  )
  t = t.replace(
    /State the \$(y)\$\. So \$(y = \|[^$]+\|)\./gi,
    (_, coord, graph) => `State the $${coord}$-intercept of the graph $${graph}$.`,
  )
  t = t.replace(
    /State the \$(y)\$\. So \$(y = [^$]+)\$\./gi,
    (_, coord, graph) => `State the $${coord}$-intercept of the graph $${graph}$.`,
  )
  t = t.replace(
    /How many \$(x)\$\. So \$(y = [^$]+)\$\s*have\?/gi,
    (_, coord, graph) => `How many $${coord}$-intercepts does the graph $${graph}$ have?`,
  )
  t = t.replace(
    /The line \$(y = c)\$\. So \$(y = [^$]+)\$\.\s*Find/gi,
    (_, line, graph) => `The line $${line}$ touches the graph of $${graph}$ at its minimum. Find`,
  )
  t = t.replace(
    /Find the set of values of \$(k)\$\. So \$y = ([^$]+)2y = ([^$]+)\$\./gi,
    (_, v, line, curve) =>
      `Find the set of values of $${v}$ for which the line $y = ${line}$ intersects the curve $y = ${curve}$.`,
  )
  t = t.replace(
    /Find the range of values of \$(c)\$\. So \$y = ([^$]+)2y = ([^$]+)\$/gi,
    (_, v, line, curve) =>
      `Find the range of values of $${v}$ for which the line $y = ${line}$ intersects the curve $y = ${curve}$`,
  )
  t = t.replace(
    /Determine the range of values of \$(k)\$\. So \$y = ([^$]+)2y = ([^$]+)\$\./gi,
    (_, v, line, curve) =>
      `Determine the range of values of $${v}$ for which the line $y = ${line}$ intersects the curve $y = ${curve}$.`,
  )
  t = t.replace(
    /The line \$(y = 2x \+ k)\$\. So \$x\^2 \+ y\^2 = ([^$]+)\$\.\s*Find/gi,
    (_, line, r) => `The line $${line}$ intersects the circle $x^2 + y^2 = ${r}$. Find`,
  )
  t = t.replace(/(\$y = \|[^$|]+\|)\?(?!\$)/g, '$1$?')
  t = t.replace(/(\$y = x\^2[^$]*)\?(?!\$)/g, '$1$?')
  return t
}

/** Strip English prose wrongly wrapped in $...$ ($Solve the inequality). */
function stripProseWrappedInMath(text: string): string {
  return text.replace(
    /^\$((?:Solve|Find|State|Determine|Identify|Given|Calculate)\s+(?:the\s+)?(?:inequality|equation|value|set|range|coordinates?)\s*)([^$\\]+?)\$/i,
    (_, prose, math) => {
      const converted = math.replace(/[≥≤]/g, (c) => (c === '≥' ? '\\ge ' : '\\le '))
      return `${prose.trim()} $${converted.trim()}$`
    },
  )
}

/** Wrap bare modulus graph labels (y=|x^2-9|, y=|$x^{2}$+4|). */
function wrapBareModulusGraphs(text: string): string {
  let t = text.replace(/\by\s*=\s*\|\$([^$]+)\$\|/g, (_, inner) => `$y=|${inner}|$`)
  const segments = t.split(/(\$[^$]+\$|\$\$[\s\S]*?\$\$)/)
  return segments
    .map((seg) => {
      if (seg.startsWith('$')) return seg
      return seg
        .replace(/\by\s*=\s*\|\$([^$]+)\$([^|]+)\|/g, (_, a, b) => `$y=|${a}${b}|$`)
        .replace(/\by\s*=\s*\|\$([^$]+)\$\|/g, (_, inner) => `$y=|${inner}|$`)
        .replace(/\by\s*=\s*\|([^|$][^|]*)\|/g, (_, inner) => `$y=|${inner.replace(/\$/g, '')}|$`)
        .replace(/\by=\|([^|]+)\|/g, (_, inner) => `$y=|${inner.replace(/\$/g, '')}|$`)
        .replace(/(?<!\$)\|f\(([^)]+)\)\|(?!\$)/g, (_, arg) => `$|f(${arg})|$`)
    })
    .join('')
}

/** Wrap bare unicode inequalities in short option strings (≥0., -3≤). */
function wrapBareUnicodeInequalities(text: string): string {
  const trimmed = text.trim()
  if (!trimmed || (trimmed.includes('$') && !/^[+\-]?\d*[≤≥]/.test(trimmed) && !/[≤≥]\d/.test(trimmed))) {
    return text
  }
  if (/[≤≥]/.test(trimmed) && !trimmed.startsWith('$')) {
    const converted = trimmed
      .replace(/≤/g, '\\le ')
      .replace(/≥/g, '\\ge ')
      .replace(/([^\\]|^)le\s/g, '$1\\le ')
      .replace(/([^\\]|^)ge\s/g, '$1\\ge ')
    return `$${converted.trim()}$`
  }
  return text
}

/** Wrap bare exponents / composite notation in quiz prose segments. */
function wrapBareQuizExpressions(text: string): string {
  const segments = text.split(/(\$[^$]+\$|\$\$[\s\S]*?\$\$)/)
  return segments
    .map((seg) => {
      if (seg.startsWith('$')) return seg
      return seg
        .replace(/\b(gf|fg|gh)\(([0-9a-zx]+)\)/gi, (_, fn, arg) => `$${fn.toLowerCase()}(${arg})$`)
        .replace(/([a-z])\(([xa-z0-9+\-]+)\)=\s*x\^\{([^}]+)\}/gi, (_, fn, arg, exp) => `$${fn}(${arg})=x^{${exp}}$`)
        .replace(/\bf\((x)\)=\s*([^$.,?]+?)(?=\s+for\b|[.,?]|$)/gi, (_, v, expr) => `$f(${v})=${expr.trim()}$`)
        .replace(/\bx\s*≥\s*(-?[\d.]+)/g, '$x \\ge $1$')
        .replace(/\bx\s*≤\s*(-?[\d.]+)/g, '$x \\le $1$')
        .replace(/\by\s*≥\s*(-?[\d.]+)/g, '$y \\ge $1$')
        .replace(/\by\s*≤\s*(-?[\d.]+)/g, '$y \\le $1$')
        .replace(/(?<![$\\])\b([a-zA-Z])\^\{([^}]+)\}/g, '$$$1^{$2}$')
        .replace(/(?<![$\\])\bx\^\{([^}]+)\}/g, '$x^{$1}$')
    })
    .join('')
}

/** Detect render-breaking patterns after quiz normalization (used by audit-quiz-content.mjs). */
export function findQuizMathRenderIssues(raw: string): string[] {
  if (!raw || typeof raw !== 'string') return []
  const prepared = fixQuizLatexText(raw)
  const issues: string[] = []

  const dollarCount = (prepared.match(/\$/g) ?? []).length
  if (dollarCount % 2 !== 0) {
    issues.push('unbalanced $ delimiters after normalization')
  }

  if (/\\\$/.test(prepared)) issues.push('visible \\\\\\$ escape in normalized text')
  if (/\\nle|\\nge|\\nneq/i.test(prepared)) issues.push('corrupted \\\\nle/\\\\nge (newline eaten backslash)')
  if (/∣/.test(prepared)) issues.push('unicode modulus ∣ (use | inside $...$)')

  const outside = prepared.split(/\$[^$]*\$/)
  for (const seg of outside) {
    if (/\\(neq|in|mathbb|le|ge|leq|geq|mapsto|frac)\b/.test(seg)) {
      issues.push(`bare LaTeX command outside $...$: "${seg.trim().slice(0, 48)}${seg.length > 48 ? '…' : ''}"`)
      break
    }
    if (/[≤≥]/.test(seg)) {
      issues.push('unicode inequality outside $...$')
      break
    }
    if (/\b[a-zA-Z]\^\{[^}]+\}/.test(seg)) {
      issues.push('bare ^{...} exponent outside $...$')
      break
    }
  }

  if (/\$[^$]*\\(le|ge|neq|frac|mapsto)[^$]*(?<!\d)[.?](?!\$)/.test(prepared)) {
    issues.push('unclosed inline math before . ? ! (\\le / \\ge visible)')
  }

  if (/\$[^$]*[\d})\]]\.\$/g.test(prepared)) {
    issues.push('sentence period trapped inside $...$ (e.g. $0 \\le x \\le 4.$)')
  }

  if (/\$\\\$/.test(prepared)) issues.push('escaped dollar visible in math ($\\$h(a)$)')
  if (/\$[^$\n]+\n[^$\n]*\\(le|ge|neq)/.test(prepared)) {
    issues.push('inline math split across lines (\\le / \\ge may render raw)')
  }

  return issues
}

/** Wrap quiz options that use LaTeX symbols but no $ delimiters. */
export function isBareQuizOptionMath(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed || trimmed.includes('$')) return false
  if (/^(Undefined|Yes|No|True|False)$/i.test(trimmed)) return false
  if (/^[0-9.]+$/.test(trimmed)) return false
  if (/\\(neq|in|mathbb|le|ge|leq|geq)|[≤≥]|y\s*[<>]|x\s*[<>]/i.test(trimmed)) return true
  if (/^\([-\d.,\s±]+\)$/.test(trimmed)) return true
  if (/^\d+(?:\.\d+)?\s*units\^2$/i.test(trimmed)) return true
  if (/^(y|x|Y|X)(\^[\dn{]+)?$/i.test(trimmed)) return true
  if (/^(lg|ln)\s+[a-z]/i.test(trimmed)) return true
  if (/^1\/x(\^[\dn]+)?$/i.test(trimmed)) return true
  if (/^[xy]\s*\/\s*[xy\d^]/i.test(trimmed)) return true
  if (/^[xy]\^[0-9{n]/i.test(trimmed)) return true
  if (/^e\^[\d.+-]+$/i.test(trimmed)) return true
  if (/^(y|Y)\s*=/.test(trimmed)) return true
  if (/\bY\s*=\s*.+\bX\s*=/i.test(trimmed)) return true
  if (/^(1\/a|a|b|1\/b|1\/a|n\/b|b\/n)$/i.test(trimmed)) return true
  return false
}

export function wrapBareQuizOption(text: string): string {
  const trimmed = text.trim()
  if (!isBareQuizOptionMath(trimmed)) return text
  const inner = trimmed
    .replace(/\blg\b/g, '\\lg')
    .replace(/\bln\b/g, '\\ln')
    .replace(/(\d+(?:\.\d+)?)\s*units\^2/gi, '$1\\ \\text{units}^2')
  return `$${inner}$`
}

function wrapBareQuizMathSymbols(text: string): string {
  return wrapBareQuizOption(text)
}

/** Fix LaTeX in quiz strings (double-escaped commands, unicode surds). */
export function fixQuizLatexText(raw: string): string {
  let text = decodeHTMLEntities(stripInvisibleChars(raw))
  text = text.replace(/∣/g, '|').replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3')
  text = moveSentencePunctuationOutsideInlineMath(text)
  text = fixNewlineSplitMathFormulas(text)
  text = fixSplitInlineMath(text)
  text = fixGluedInequalityRanges(text)
  text = fixMixedInequalityDelimiters(text)
  text = fixProseAfterMathComma(text)
  text = fixDocxSoGlueArtifacts(text)
  text = fixDocxCaretGlue(text)
  text = fixDocxSoSentenceSplits(text)
  text = stripProseWrappedInMath(text)
  text = fixProseTrappedInInlineMath(text)
  text = wrapBareModulusGraphs(text)
  text = wrapBareQuizExpressions(text)
  text = wrapBareUnicodeInequalities(text)
  text = wrapBareQuizMathSymbols(text)
  text = fixBrokenMappingNotation(text)
  text = fixDollarTwoPlaceholder(text)
  text = fixBrokenMappingNotation(text)
  text = repairQuizImportArtifacts(text)
  text = repairCorruptedQuizMath(text)
  text = fixDocxExponentNewlines(text)
  text = fixBrokenDocxFractions(text)
  text = fixDocxPhysicsLatex(text)
  text = text.replace(/\\{2,}(?=[a-zA-Z{[(])/g, '\\')
  text = text.replace(/\\int\{([^}]+)\}\^\{/g, '\\int_{$1}^{')
  text = text.replace(/√(\d+)/g, '\\sqrt{$1}')
  text = text.replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
  text = text.replace(/\$\$\$/g, () => '$$')
  text = text.replace(/\\+\s*$/g, '')
  text = text.replace(/\\text\{([^}]*)\^(\d+)\}/g, '\\text{$1}^{$2}')
  text = normalizeMathMarkdown(text)
  text = fixProseTrappedInInlineMath(text)
  text = fixBrokenMappingNotation(text)
  text = closeInlineMathBeforePunctuation(text)
  return repairMathMarkdown(text)
}

/** Move sentence punctuation wrongly trapped inside $...$ (e.g. $f^{-1}(x)?$ → $f^{-1}(x)$?). */
export function moveSentencePunctuationOutsideInlineMath(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  return parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part.replace(/\$([^$\n]+?)([.?!])\$/g, (_, inner: string, punct: string) => `$${inner}$${punct}`)
    })
    .join('')
}

/** Ensure $…expr. becomes $…expr$. when import dropped the closing delimiter. */
function closeInlineMathBeforePunctuation(text: string): string {
  const parts = text.split(/(\$[^$\n]+\$)/)
  return parts
    .map((part) => {
      if (/^\$[^$\n]+\$$/.test(part)) return part
      return part.replace(
        /(?<![\d})\]\\])\$([^$\n]+?)([\d})\]])([.?!])(?!\$)/g,
        (match, inner, end, punct, offset, full) => {
          const dollarsBefore = (full.slice(0, offset).match(/(?<!\\)\$/g) ?? []).length
          if (dollarsBefore % 2 !== 0) return match
          return `$${inner}${end}$${punct}`
        },
      )
    })
    .join('')
}

/** Wrap math notation in topic/quiz titles for KaTeX rendering. */
export function normalizeTitleMath(raw: string): string {
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

/** True when topic subtitle repeats the computed section label. */
export function isRedundantSectionSubtitle(subtitle: string): boolean {
  return /^section\s+\d+$/i.test(subtitle.trim())
}

export type MathContentContext = 'note' | 'quiz' | 'title' | 'generic'

/** Single entry point for all math string normalization (notes, quizzes, titles). */
export function prepareMathContent(raw: string, context: MathContentContext = 'generic'): string {
  if (!raw || typeof raw !== 'string') return raw
  switch (context) {
    case 'title':
      return normalizeTitleMath(raw)
    case 'quiz':
      return fixQuizLatexText(raw)
    case 'note':
      return normalizeMathMarkdown(repairImportedNoteArtifacts(raw))
    case 'generic':
    default:
      return normalizeMathMarkdown(raw)
  }
}

/** Wrap common math patterns that are not yet in $ delimiters. */
function wrapBareMath(text: string): string {
  const segments = text.split(/(\$[^$]+\$|\$\$[\s\S]*?\$\$)/)
  return segments
    .map((seg) => {
      if (seg.startsWith('$')) return seg
      return seg
        .replace(/(\d+)\^\(([^)]+)\)/g, (_, base, exp) => `$${base}^{${exp}}$`)
        .replace(/(\d+)\^\{([^}]+)\}/g, (_, base, exp) => `$${base}^{${exp}}$`)
        .replace(/\(([a-zA-Z0-9+\-*/ ]+)\)([2-9])(?![²³⁰-⁹0-9.])/g, (_, inner, exp) => `$(${inner})^{${exp}}$`)
        .replace(/\bdy\/dx\b/g, '$\\frac{dy}{dx}$')
        .replace(/\bd\/dx\b/g, '$\\frac{d}{dx}$')
        .replace(/\bδy\b/g, '$\\delta y$')
        .replace(/\bδx\b/g, '$\\delta x$')
    })
    .join('')
}

function mergeProseOnlyFormulaCards(cards: string[]): string[] {
  const merged: string[] = []
  for (const card of cards) {
    const hasMath = /\$\$[\s\S]*?\$\$/.test(card)
    if (!hasMath && merged.length > 0) {
      merged[merged.length - 1] += `\n\n${card}`
    } else {
      merged.push(card)
    }
  }
  return merged
}

/** Split key-formula sections into unified title + formula + description cards. */
export function parseFormulaCards(body: string): string[] {
  const trimmed = body
    .trim()
    .replace(/\.\s+(\*\*[^*\n]+\*\*)/g, '.\n\n$1')
  if (!trimmed) return []

  const blocks = trimmed
    .split(/\n\n(?=\*\*[^*\n]+\*\*)/)
    .map((b) => b.trim().replace(/^\.\s+/, ''))
    .filter(Boolean)

  if (blocks.length > 1) return mergeProseOnlyFormulaCards(blocks)

  const cards = parseContentCards(trimmed)
  if (cards.length >= 1) {
    return mergeProseOnlyFormulaCards(
      cards.map((card) => {
        const t = card.trim()
        const inlineOnly = t.match(/^\$([^$\n]+)\$$/)
        if (inlineOnly) return `$$\n${inlineOnly[1]}\n$$`
        return card
      }),
    )
  }

  return cards
}

export interface FormulaCardVariant {
  id: string
  label: string
  math: string
}

export interface ParsedFormulaCard {
  title: string
  titleMarkdown: string
  variants: FormulaCardVariant[]
  description: string
  fallbackMarkdown: string
}

const K_VARIANT_MARKER = /<!--\s*k-variant\s*-->/i

/** Parse a formula card; optional <!-- k-variant --> splits base vs constant-k forms. */
export function parseFormulaCardVariants(card: string): ParsedFormulaCard {
  const trimmed = card.trim()
  const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*/)
  let title = titleMatch?.[1]?.trim() ?? ''
  let titleMarkdown = titleMatch?.[0] ?? ''
  const mathBlocks = [...trimmed.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((m) => m[1].trim())
  let description = trimmed
    .replace(/^\*\*[^*]+\*\*\s*/, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(K_VARIANT_MARKER, '')
    .trim()

  if (!title && mathBlocks[0]) {
    const textTitle = mathBlocks[0].match(/^\\text\{([^}:]+)(?::)?\}/)
    if (textTitle) {
      title = textTitle[1].trim()
      titleMarkdown = `**${title}**`
      mathBlocks[0] = mathBlocks[0].replace(/^\\text\{[^}]+\}\s*(?:\\quad\s*)?/, '').trim()
    }
  }

  const variants: FormulaCardVariant[] = []
  if (K_VARIANT_MARKER.test(trimmed) && mathBlocks.length >= 2) {
    variants.push({ id: 'base', label: 'Standard', math: mathBlocks[0] })
    variants.push({ id: 'k', label: 'With constant $k$', math: mathBlocks[1] })
    for (let i = 2; i < mathBlocks.length; i++) {
      variants.push({ id: `form-${i + 1}`, label: `Form ${i + 1}`, math: mathBlocks[i] })
    }
  } else if (mathBlocks.length >= 1) {
    variants.push({ id: 'base', label: 'Formula', math: mathBlocks[0] })
  }

  return { title, titleMarkdown, variants, description, fallbackMarkdown: trimmed }
}

export function formulaCardHasKToggle(card: string): boolean {
  return K_VARIANT_MARKER.test(card) && (card.match(/\$\$/g) || []).length >= 4
}

export interface TopicCard {
  /** Intro text before the diagram (e.g. a **Subheading** block). */
  text?: string
  diagram?: string
  /** Description shown below the diagram (caption promoted out of the diagram div). */
  caption?: string
}

const DIAGRAM_DIV_RE =
  /<div class="[^"]*(?:enlight-physics-diagram|enlight-fleming-3d)[^"]*"[^>]*>[\s\S]*?<\/div>/g

function parseDiagramSequence(body: string): TopicCard[] {
  const matches = [...body.matchAll(DIAGRAM_DIV_RE)]
  if (matches.length === 0) return []

  const cards: TopicCard[] = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const idx = match.index ?? 0
    const prevEnd =
      i === 0 ? 0 : (matches[i - 1].index ?? 0) + matches[i - 1][0].length
    const nextStart = idx + match[0].length
    const nextIdx =
      i + 1 < matches.length ? (matches[i + 1].index ?? body.length) : body.length

    const card: TopicCard = { diagram: match[0] }
    const before = body.slice(prevEnd, idx).trim()
    const after = body.slice(nextStart, nextIdx).trim()

    if (i === 0 && before) card.text = before
    if (after) card.caption = after
    cards.push(card)
  }

  return cards
}

/** Split graphs/diagrams sections into topic cards with optional diagram HTML. */
export function parseTopicCards(body: string): TopicCard[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  const diagramCards = parseDiagramSequence(trimmed)
  if (diagramCards.length > 1) return diagramCards

  // Each **Subheading** block may include bullets + one trailing diagram div.
  const parts = trimmed.split(/\n\n(?=\*\*[^*\n]+\*\*)/).filter(Boolean)
  const cards: TopicCard[] = []

  for (const part of parts) {
    const diagramMatch = part.match(
      /(<div class="[^"]*(?:enlight-physics-diagram|enlight-fleming-3d|enlight-em-3d)[^"]*"[^>]*>[\s\S]*?<\/div>)\s*/,
    )
    const diagram = diagramMatch?.[1]
    const text = diagramMatch ? part.replace(diagramMatch[0], '').trim() : part.trim()
    if (text || diagram) {
      const card: TopicCard = {}
      if (text) card.text = text
      if (diagram) card.diagram = diagram
      cards.push(card)
    }
  }

  if (cards.length === 0 && diagramCards.length === 1) return diagramCards

  return cards
}

/** Split a section body into discrete cards (formulas, method types, etc.). */
export function parseContentCards(body: string): string[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  const displayBlocks = trimmed.match(/\$\$[\s\S]*?\$\$/g)

  // Formula blocks formatted as **Title** + math + description
  const formulaBlocks = trimmed.split(/\n\n(?=\*\*[^*\n]+\*\*)/)
  if (formulaBlocks.length > 1) {
    return formulaBlocks.map((b) => b.trim().replace(/^\.\s+/, '')).filter(Boolean)
  }

  if (displayBlocks && displayBlocks.length > 1) {
    const cards: string[] = []
    let rest = trimmed
    let pendingLabel = ''
    for (let i = 0; i < displayBlocks.length; i++) {
      const block = displayBlocks[i]
      const idx = rest.indexOf(block)
      const before = rest.slice(0, idx).trim()
      rest = rest.slice(idx + block.length)
      let after = ''
      if (i < displayBlocks.length - 1) {
        const nextIdx = rest.indexOf(displayBlocks[i + 1])
        after = rest.slice(0, nextIdx).trim()
        rest = rest.slice(nextIdx)
      } else {
        after = rest.trim()
        rest = ''
      }
      const labelTail = after.match(/\s+([A-Za-z][^:\n$]{2,55}):\s*$/)
      if (labelTail && i < displayBlocks.length - 1) {
        after = after.slice(0, -labelTail[0].length).trim()
        pendingLabel = `${labelTail[1]}:`
      }
      const beforeCombined = [pendingLabel, before].filter(Boolean).join('\n\n')
      pendingLabel = ''
      const card = [beforeCombined, block.trim(), after].filter(Boolean).join('\n\n')
      if (card) cards.push(card)
    }
    return cards
  }

  if (displayBlocks?.length === 1) {
    return [trimmed]
  }

  const paragraphs = trimmed.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean)
  if (paragraphs.length > 1) return paragraphs

  const lines = trimmed.split(/\n/).map((s) => s.trim()).filter(Boolean)
  if (lines.length > 1) return lines

  return [trimmed]
}

/** Strip leading list markers from step text (avoids double numbering in UI). */
export function stripStepPrefix(text: string): string {
  return text.replace(/^\d+\.\s*/, '').trim()
}

/** Import artefact: `$2$` between math fragments (e.g. `$24^\circ$2$n$`). */
export function fixDollarTwoPlaceholder(text: string): string {
  let t = text

  // Circular measure: "$150^\circ$2$\pi$" → "150° to radians"
  t = t.replace(/\$(\d+\^\\circ)\$2\$\\pi\$/g, '$$$1$ to radians')
  t = t.replace(/\$(\d+\^\\circ)\$2\$([\d.]+\\pi)\$/g, '$$$1$ is equal to $$$2$')
  t = t.replace(/\$(\d+\^\\circ)\$2\$([\d.]+\\pi\/\d+)\$/g, '$$$1$ ($$$2$)')
  t = t.replace(/\$(\d+\^\\circ)\$2\$(\d+\^\\circ)\$/g, '$$$1$ instead of $$$2$')
  t = t.replace(/\$(\d+\^\\circ)\$2\$(\\pi\/\d+)\$/g, '$$$1$ ($$$2$)')

  t = t.replace(/\$([^$]+)\$2\$([^$]+)\$/g, (_, left, right) => {
    const l = left.trim()
    const r = right.trim()
    if (/^n\s*=/.test(r)) return `$${l}$. So $${r}$`
    if (/^\d+\^(\{\\circ\}|\\circ|°)/.test(r) || /^\d+°/.test(r)) return `$${l}$ and $${r}$`
    if (/^[a-z]$/i.test(r)) {
      if (/\\circ|°/.test(l)) return `$${l}$. Determine $${r}$`
      return `$${l}$ and $${r}$`
    }
    if (/^[A-Za-z_\\{].*=/.test(r)) return `$${l}$. So $${r}$`
    return `$${l}$. $${r}$`
  })

  t = t.replace(/\$2\$/g, '2')
  t = t.replace(/\$\.\$/g, (_match, offset, full: string) => {
    if (offset > 1 && full[offset - 1] === '}' && full[offset - 2] === '$') return '.$'
    if (offset > 0 && full[offset - 1] === '}') return '.$'
    return '2'
  })
  t = t.replace(/\}\$\.\$/g, '}.')
  t = t.replace(/\(\$\.\s/g, '(2 ')
  t = t.replace(/\(\.\$/g, '(2$')
  return t
}

/** Strip nested `$…$` wrappers from lines inside a display block body. */
function unwrapInnerDollarLines(inner: string): string[] {
  return inner
    .split('\n')
    .map((line) => {
      let t = line.trim()
      if (!t) return ''
      if (/^\$\s?/.test(t)) {
        t = t.replace(/^\$\s?/, '').replace(/\$$/, '').trim()
      }
      return t
    })
    .filter(Boolean)
}

/** Split a display block that contains multiple \\text{Title:} formulas. */
export function splitMultiFormulaDisplayBlocks(text: string): string {
  return text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const trimmed = inner.trim()
    if (/\\begin\{(aligned|array|cases|pmatrix|bmatrix|matrix)\}/.test(trimmed)) {
      return `$$\n${trimmed}\n$$`
    }

    const lines = unwrapInnerDollarLines(trimmed)
    if (lines.length > 1) {
      return lines.map((p) => `$$\n${p}\n$$`).join('\n\n')
    }

    const single = lines[0] ?? inner.trim().replace(/^\$+/, '').replace(/\$+$/, '').trim()
    const parts = single
      .split(/\n(?=(?:\\text\{|\$\s*\\text\{))/)
      .map((p) => p.trim().replace(/^\$+/, '').replace(/\$+$/, '').trim())
      .filter(Boolean)

    if (parts.length <= 1) {
      const qParts = single
        .split(/\s*\\qquad\s*/)
        .map((p) => p.trim())
        .filter(Boolean)
      if (qParts.length > 1) {
        return qParts.map((p) => `$$\n${p}\n$$`).join('\n\n')
      }
      return `$$\n${single}\n$$`
    }
    return parts.map((p) => `$$\n${p}\n$$`).join('\n\n')
  })
}

/** Wrap orphan LaTeX lines (\\text, \\frac, etc.) that lost $$ delimiters during import. */
export function wrapOrphanLatexLines(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  return parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part
        .split('\n')
        .map((line) => {
          const t = line.trim()
          if (!t) return line
          if (/^\\(text|frac|begin|left|Rightarrow|quad|hat|vec|int|sqrt|Delta|pmatrix)\b/.test(t)) {
            return `$$\n${t}\n$$`
          }
          return line
        })
        .join('\n')
    })
    .join('')
}

/** Balance $ delimiters and wrap bare math lines (worked-example import artefacts). */
export function fixInlineMathLines(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/)
  return parts
    .map((part) => {
      if (part.startsWith('$$')) return part
      return part
        .split('\n')
        .map((line) => {
          let l = line
          l = l.replace(/\$\.\$/g, '2')

          const dollars = l.match(/(?<!\\)\$/g)?.length ?? 0
          if (dollars % 2 === 1) {
            // Close before trailing sentence punctuation, not after it ($0 \le x \le 4$. not 4.$)
            l = l.replace(/([.?!])$/, (_, punct) => `$${punct}`)
            if ((l.match(/(?<!\\)\$/g)?.length ?? 0) % 2 === 1) {
              l = `${l.trimEnd()}$`
            }
          }

          const trimmed = l.trim()
          if (
            !trimmed.includes('$') &&
            (/\\times|\\text\{|\\frac|\\Rightarrow/.test(trimmed) ||
              /^(\d+\s*=|[A-Za-z].*= .*\\times)/.test(trimmed))
          ) {
            return `$${trimmed}$`
          }

          return l
        })
        .join('\n')
    })
    .join('')
}

/** Strip nested $...$ inside $$ display blocks (invalid KaTeX — common import artefact). */
function unwrapNestedInlineInDisplay(text: string): string {
  return text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const cleaned = inner
      .replace(/\$([^$]+)\$/g, (_m: string, math: string) => math.trim())
      .replace(/^\$+/, '')
      .replace(/\$+$/, '')
      .trim()
    return cleaned ? `$$\n${cleaned}\n$$` : ''
  })
}

/** Normalise key-formulas section bodies before card parsing. */
export function normalizeKeyFormulasBody(body: string): string {
  let t = fixDollarTwoPlaceholder(body)
  t = unwrapNestedInlineInDisplay(t)
  t = wrapPlainFormulaLines(t)
  t = splitMultiFormulaDisplayBlocks(t)
  t = wrapOrphanLatexLines(t)
  return t
}

/** Move diagram captions out of raw HTML so remark-math can render $...$ in captions. */
export function promoteDiagramCaptions(text: string): string {
  return text.replace(
    /<div class="enlight-physics-diagram">([\s\S]*?)<p class="enlight-physics-diagram__caption">([\s\S]*?)<\/p>\s*<\/div>/g,
    (_match, inner, caption) =>
      `<div class="enlight-physics-diagram">${String(inner).trim()}</div>\n\n${String(caption).trim()}`,
  )
}

/** Remove $ wrappers around plain English phrases (import artefact). */
function stripProseDollarWrappers(text: string): string {
  let t = text
  t = t.replace(/\$\$\$/g, '$$\n')
  t = t.replace(/\$At\$/g, 'At')
  t = t.replace(/\$Compare:\$/g, 'Compare:')
  t = t.replace(/\$The domain excludes\$/g, 'The domain excludes')
  t = t.replace(/\$since this causes\b/g, 'since this causes')
  t = t.replace(/\beven though\$/g, 'even though')
  t = t.replace(/\$itself is defined\b/g, 'itself is defined')
  t = t.replace(/\$but\$/g, ' but ')
  t = t.replace(/\$and\$/g, ' and ')
  t = t.replace(/\$for all\$/g, 'for all')
  t = t.replace(/\$Maximum area\$/g, 'Maximum area')
  return t.replace(/\$([A-Za-z][A-Za-z\s,:.;!?-]{2,}?)\$/g, (match, inner: string) => {
    if (/\\[a-zA-Z]|\\frac|\\sqrt|\^|_|=|<|>|\\text|\\\\|\d/.test(inner)) return match
    if (/\b(the|a|an|of|to|at|in|for|and|is|are|was|domain|excludes|since|though|Compare|Maximum|area)\b/i.test(inner)) {
      return inner.trim()
    }
    return match
  })
}

/** Fix common Word/import artifacts in note markdown before math normalization. */
/** Fix docx import artefacts like `$k$. $k^2$)` or `$h$. So $l = …$)`. */
function fixDocxSplitMathPunctuation(text: string): string {
  return text
    .replace(/\$([^$\n]+)\$\.\s+\$([^$\n]+)\$\)/g, '$$$1$ ($$2$)')
    .replace(/\$([^$\n]+)\$\.\s+So\s+\$([^$\n]+)\$\)/g, '$$$1$. Use $$2$')
    .replace(/\(\$([^$]+)\$\.\s+\$([^$]+)\$\)/g, '($$1$, $$2$)')
    .replace(/\$h\$\s+and\s+\$l\.\s*h\$\s+and\s+\$l\$/g, '$h$ and $l$')
    .replace(/\\frac\{1\}\{4\/3\}/g, '\\frac{4}{3}')
    .replace(/\(e\.g\$\.\s+\$2x_/g, '(e.g. $x_')
    .replace(/\$y value \(e\.g\$/g, '$y$ value (e.g.')
    .replace(/(\d+):\$/g, '$1: $')
    .replace(/\$([^$\n]+)\$\.\s+So\s+\$([^$\n]+)\$/g, '$$$1$ when $$2$')
    .replace(/\$0\.25N\$\.\s+\$0\.5N\.\s+0\.75N\$/g, '$0.25N$, $0.5N$, and $0.75N$')
    .replace(/area \$=\s+frequency\.\$/g, 'area $=$ frequency')
    .replace(/\$(\d{2,3})P(?=\\|\()/g, '\n\n$P')
    .replace(
      /\\begin\{cases\}([\s\S]*?)\s\\(?![\\])([\s\S]*?)\\end\{cases\}/g,
      (_, first, second) => `\\begin{cases}${first.trim()} \\\\ ${second.trim()}\\end{cases}`,
    )
    .replace(/\$([A-Z])\$\s+and\s+\$([A-Z])\.\s*([A-Z])\$/g, '$$1$, $$2$, and $$3$')
    .replace(/\$([0-9]+\\circ)\$\s+and\s+\$([0-9]+\\circ)\.\s*\\text\{/g, '$$1$ from $$2$: $\\text{')
    .replace(/:\$\\text\{/g, ': $\\text{')
}

export function repairImportedNoteArtifacts(text: string): string {
  let t = text
  t = promoteDiagramCaptions(t)
  t = fixDollarTwoPlaceholder(t)
  t = fixDocxSplitMathPunctuation(t)
  t = stripProseDollarWrappers(t)
  t = unwrapNestedInlineInDisplay(t)
  t = closeUnclosedDisplayMath(t)
  t = t.replace(/([a-z])(time|distance|speed|Calculate|Identify|Apply|So)(\b)/gi, '$1 $2$3')
  t = t.replace(/(\))and(\s*\()/gi, '$1 and $2')
  t = t.replace(/andtime/gi, 'and time')
  t = t.replace(/Calculatethe/gi, 'Calculate the')
  t = t.replace(/distanceis/gi, 'distance is ')
  t = t.replace(/speed\$\./g, 'speed$.')
  t = t.replace(/(\$[^$]+\$)([A-Za-z])/g, '$1 $2')
  t = t.replace(/^\$\s*Question:\s*/gim, 'Question: ')
  t = t.replace(/^\$Question:\s*/gim, 'Question: ')
  t = t.replace(/([a-z,.])(\$[^$]+\$)/g, '$1 $2')
  t = t.replace(/\$\s*(\d+(?:\.\d+)?)\s*\$/g, '$$$1$$')
  t = t.replace(/\\Rightarrow([a-zA-Z])/g, '\\Rightarrow $1')
  return t
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

  let steps = main
    .split(/\n(?=\d+\.\s)/)
    .map((s) => stripStepPrefix(s))
    .filter(Boolean)

  if (steps.length <= 1) {
    const paraSteps = main
      .split(/\n{2,}/)
      .map((s) => stripStepPrefix(s.trim()))
      .filter(Boolean)
    if (paraSteps.length > 1) steps = paraSteps
  }

  if (steps.length <= 1) {
    const lineSteps = main
      .split(/\n/)
      .map((s) => stripStepPrefix(s.trim()))
      .filter((s) => s.length > 0 && !s.startsWith('#'))
    if (lineSteps.length > 1) steps = lineSteps
  }

  if (steps.length === 0 && main.trim()) {
    steps = [stripStepPrefix(main.trim())]
  }

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

/** Extract display title from a worked-example section heading. */
export function workedExampleTitle(heading: string): string {
  const match = heading.match(/^worked examples?\s*[—–-]\s*(.+)/i)
  if (match?.[1]) return match[1].trim()
  if (/^worked examples?$/i.test(heading.trim())) return 'Worked example'
  return heading.replace(/^worked examples?\s*/i, '').trim() || 'Worked example'
}

/** Split a worked-examples body on "Example N (…)" headers into separate blocks. */
export function splitMultipleExamplesByHeader(body: string): { title: string; body: string }[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  const parts = trimmed.split(/\n(?=Example\s+\d+\s*\()/i)
  if (parts.length <= 1) return []

  return parts
    .map((part) => {
      const headerMatch = part.match(/^(Example\s+\d+\s*\([^)]+\))\s*:?\s*([\s\S]*)/i)
      if (headerMatch) {
        return { title: headerMatch[1].trim(), body: headerMatch[2].trim() }
      }
      const fallback = part.trim()
      if (!fallback) return null
      return { title: 'Worked example', body: fallback }
    })
    .filter((b): b is { title: string; body: string } => Boolean(b?.body))
}

/** Expand combined "Worked examples" sections into one section per example. */
export function expandWorkedExampleSections<T extends { kind: string; heading: string; body: string }>(
  sections: T[],
): T[] {
  const out: T[] = []
  for (const section of sections) {
    if (section.kind !== 'worked-example') {
      out.push(section)
      continue
    }

    const blocks = splitMultipleExamplesByHeader(section.body)
    if (blocks.length > 1) {
      for (const block of blocks) {
        out.push({
          ...section,
          heading: `Worked example — ${block.title}`,
          body: block.body,
        })
      }
      continue
    }

    const subBlocks = parseWorkedExampleBlocks(section.body, workedExampleTitle(section.heading))
    if (subBlocks.length > 1 && /^worked examples?$/i.test(section.heading.trim())) {
      for (const block of subBlocks) {
        out.push({
          ...section,
          heading: `Worked example — ${block.title}`,
          body: block.body,
        })
      }
      continue
    }

    out.push(section)
  }
  return out
}

/** Move worked-example sections to immediately follow the last steps/method block. */
export function reorderWorkedExamplesAfterSteps<T extends { kind: string }>(sections: T[]): T[] {
  const examples = sections.filter((s) => s.kind === 'worked-example')
  if (examples.length === 0) return sections

  const withoutExamples = sections.filter((s) => s.kind !== 'worked-example')
  let insertAfter = -1
  for (let i = 0; i < withoutExamples.length; i++) {
    if (withoutExamples[i].kind === 'steps' || withoutExamples[i].kind === 'method-block') {
      insertAfter = i
    }
  }
  if (insertAfter === -1) return sections

  return [
    ...withoutExamples.slice(0, insertAfter + 1),
    ...examples,
    ...withoutExamples.slice(insertAfter + 1),
  ]
}

/** Split a worked-example body into multiple ###-headed blocks. */
export function parseWorkedExampleBlocks(
  body: string,
  defaultTitle = 'Worked example',
): { title: string; body: string }[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  const parts = trimmed.split(/\n(?=###\s+)/)
  if (parts.length > 1) {
    return parts.map((part) => {
      const match = part.match(/^###\s+(.+?)\s*\n([\s\S]*)/)
      if (match) {
        return { title: match[1].trim(), body: match[2].trim() }
      }
      return { title: defaultTitle, body: part.trim() }
    })
  }

  return [{ title: defaultTitle, body: trimmed }]
}

/** Preprocess worked-example bodies (import bullets, inline steps, $Question: wrappers). */
export function normalizeWorkedExampleBody(text: string): string {
  let t = repairImportedNoteArtifacts(fixInlinePipeTables(text.trim()))
  t = t.replace(/^-\s*\*\*Question\*\*:\s*/im, 'Question: ')
  t = t.replace(/^\$\s*Question:\s*/im, 'Question: ')
  t = t.replace(/^\$Question:\s*/im, 'Question: ')
  t = t.replace(/^(Question:[^\n]*)\s*\$\s*$/im, '$1')
  t = t.replace(/^-\s*\*\*Step\s+(\d+)\*\*:\s*/gim, '\n$1. ')
  if (/\bStep\s+1:/i.test(t) && /\bStep\s+2:/i.test(t)) {
    t = t.replace(/\s*Step\s+(\d+):\s*/gi, '\n$1. ')
    t = t.replace(/\s*Solution:\s*/gi, '\nSolution: ')
  }
  t = t.replace(/(\^\circ\\text\{C\}\)|\\text\{ K\}\)|J\/\(kg K\}\))\s*2\s*$/gm, '$1')
  t = t.replace(/(\))\s*2\s*$/gm, '$1')
  t = t.replace(/\(\$\\Delta\\theta\$\)(\d+)/g, '($\\Delta\\theta$) of $1')
  t = t.replace(/\$of\b/g, ' of')
  t = t.replace(/\s+\\\s*,\s*dx\b/g, '\\,dx')
  t = t.replace(/(\d|\)|\})\s*,\s*dx\b/g, '$1\\,dx')
  return t
}

/** Split worked-example body into question prompt(s) and solution steps. */
export function parseWorkedExampleParts(body: string): { questions: string[]; steps: string[] } {
  const trimmed = normalizeWorkedExampleBody(body)
  if (!trimmed) return { questions: [], steps: [] }

  const numbered = trimmed
    .split(/\n(?=\d+\.\s)/)
    .map((s) => stripStepPrefix(s))
    .filter(Boolean)

  if (numbered.length > 1) {
    return partitionQuestionAndSteps(numbered)
  }

  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((s) => stripStepPrefix(s.trim()))
    .filter(Boolean)

  return partitionQuestionAndSteps(paragraphs)
}

const QUESTION_START =
  /^(?:Question:\s*)?(?:Calculate|Find|Show|Prove|Determine|Solve|Compare|Sketch|Write|State|Given|Describe|Does|Is |Are |Can |Evaluate|Express|Simplify|Factorise|Factorize|Expand|Differentiate|Integrate|A\s+(?:class|particle|stone|car|ball|body|train|student|mapping|metal))/i

function looksLikeSolutionStep(text: string): boolean {
  const t = text.trim()
  if (/^Solution:/i.test(t)) return true
  if (/^\(?\$?\d+\s*[×x*]\s*\d/.test(t)) return true
  if (/^So\b|^Therefore\b|^Hence\b|^Mean\s*=|^Total frequency|^Class [AB] has/i.test(t)) return true
  if (/^\$\$/.test(t) || /^\\frac|^\\text\{Mean/.test(t)) return true
  if (/^This is\b|^On \$|^For \$|^Inner\b|^Substitute\b|^Apply\b|^Using\b/i.test(t)) return true
  if (/^\*\*[A-Z]/.test(t) && !QUESTION_START.test(t)) return true
  return false
}

function splitMixedQuestionAnswer(text: string): { question: string | null; steps: string[] } {
  const answerSplit = text.match(
    /^([\s\S]*?\.\s*)(?=(?:Class [AB] has\b|So\b|Therefore\b|Hence\b|\([0-9]+\s*[×x*]|\$\(|Mean\s*=|This is\b|On \$|For \$|Inner\b|Substitute\b))/i,
  )
  if (answerSplit) {
    const question = answerSplit[1].trim()
    const rest = text.slice(answerSplit[0].length).trim()
    const steps = rest ? (rest.startsWith('Solution:') ? splitSolutionParagraph(rest) : [rest]) : []
    return { question: question || null, steps }
  }

  if (QUESTION_START.test(text) && !looksLikeSolutionStep(text)) {
    return { question: text.replace(/^Question:\s*/i, '').trim(), steps: [] }
  }

  return { question: null, steps: [text] }
}

function partitionQuestionAndSteps(blocks: string[]): { questions: string[]; steps: string[] } {
  const questions: string[] = []
  const steps: string[] = []

  for (const block of blocks) {
    const p = block.trim()
    if (!p || /^Solution:?\s*$/i.test(p)) continue

    if (/^Question:/i.test(p)) {
      questions.push(p.replace(/^Question:\s*/i, '').trim())
      continue
    }

    if (/^Solution:/i.test(p)) {
      steps.push(...splitSolutionParagraph(p))
      continue
    }

    if (questions.length === 0 && steps.length === 0) {
      const mixed = splitMixedQuestionAnswer(p)
      if (mixed.question) questions.push(mixed.question)
      if (mixed.steps.length) steps.push(...mixed.steps)
      else if (!mixed.question) steps.push(p)
      continue
    }

    if (questions.length > 0 && steps.length === 0 && looksLikeSolutionStep(p)) {
      steps.push(p)
      continue
    }

    if (questions.length === 0 && !looksLikeSolutionStep(p) && QUESTION_START.test(p)) {
      questions.push(p)
      continue
    }

    steps.push(p)
  }

  const deduped = (items: string[]) => {
    const seen = new Set<string>()
    return items.filter((item) => {
      const key = item.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 140)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  return { questions: deduped(questions), steps: deduped(steps) }
}

/** Split worked-example body into sequential steps (legacy — prefer parseWorkedExampleParts). */
export function parseWorkedExampleSteps(body: string): string[] {
  const { questions, steps } = parseWorkedExampleParts(body)
  return [...questions.map((q) => `Question: ${q}`), ...steps]
}

/** Split a Solution block into numbered-friendly steps. */
function splitSolutionParagraph(text: string): string[] {
  const body = text.replace(/^Solution:\s*/i, '').trim()
  if (!body) return []

  if (/⟹|⇒/.test(body)) {
    const parts = body.split(/\s*(?:⟹|⇒)\s*/).filter(Boolean)
    if (parts.length > 1) {
      return parts.map((part, i) => (i === 0 ? part.trim() : `So ${part.trim()}`))
    }
  }

  if (/\$\\Rightarrow\$/.test(body)) {
    const parts = body.split(/\s*\$\\Rightarrow\$\s*/).filter(Boolean)
    if (parts.length > 1) {
      return parts.map((part, i) => (i === 0 ? part.trim() : `So ${part.trim()}`))
    }
  }

  const verbSplit = body.split(
    /\.\s+(?=Draw|Reflect|Plot|Solve|Set|Swap|Instead|Find|Simplify|Inner|Substitute|Apply|The intersection|Intersection)/i,
  )
  if (verbSplit.length > 1) {
    return verbSplit.map((s) => {
      const t = s.trim()
      return t.endsWith('.') ? t : `${t}.`
    })
  }

  const sentences = body.split(/(?<=[.)])\s+(?=[A-Z(])/).filter(Boolean)
  if (sentences.length > 1) return sentences.map((s) => s.trim())

  return [body]
}
