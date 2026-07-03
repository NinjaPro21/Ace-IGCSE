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
  return text
    .replace(/\$\$\s*\n(\\[^\n$]+?)\$([a-zA-Z])/g, (_, expr, ch) => `$${expr.trim()}$ ${ch}`)
    .replace(/\$\$\s*\n(\d+(?:\.\d+)?)\$/g, (_, n) => `$${n}$`)
}

/** Fix common markdown/LaTeX glue issues from import or batch normalizers. */
export function repairMathMarkdown(text: string): string {
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
  t = t.replace(/,\s*dx\.?/g, '\\,dx.')
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
  t = t.replace(/([a-zA-Z)\}])\s+\$(\d+)\$/g, (_, base, exp) => `${base}^${exp}`)
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
  t = t.replace(/([^\n])\.\s+\$\$/g, '$1.\n\n$$')
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

/** Fix LaTeX in quiz strings (double-escaped commands, unicode surds). */
export function fixQuizLatexText(raw: string): string {
  let text = decodeHTMLEntities(stripInvisibleChars(raw))
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
  return normalizeMathMarkdown(text)
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

  if (blocks.length > 1) return blocks

  const cards = parseContentCards(trimmed)
  if (cards.length >= 1) {
    return cards.map((card) => {
      const t = card.trim()
      const inlineOnly = t.match(/^\$([^$\n]+)\$$/)
      if (inlineOnly) return `$$\n${inlineOnly[1]}\n$$`
      return card
    })
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
  const title = titleMatch?.[1]?.trim() ?? ''
  const titleMarkdown = titleMatch?.[0] ?? ''
  const mathBlocks = [...trimmed.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((m) => m[1].trim())
  let description = trimmed
    .replace(/^\*\*[^*]+\*\*\s*/, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(K_VARIANT_MARKER, '')
    .trim()

  const variants: FormulaCardVariant[] = []
  if (K_VARIANT_MARKER.test(trimmed) && mathBlocks.length >= 2) {
    variants.push({ id: 'base', label: 'Standard', math: mathBlocks[0] })
    variants.push({ id: 'k', label: 'With constant $k$', math: mathBlocks[1] })
    for (let i = 2; i < mathBlocks.length; i++) {
      variants.push({ id: `form-${i + 1}`, label: `Form ${i + 1}`, math: mathBlocks[i] })
    }
  } else if (mathBlocks.length === 1) {
    variants.push({ id: 'base', label: 'Formula', math: mathBlocks[0] })
  }

  return { title, titleMarkdown, variants, description, fallbackMarkdown: trimmed }
}

export function formulaCardHasKToggle(card: string): boolean {
  return K_VARIANT_MARKER.test(card) && (card.match(/\$\$/g) || []).length >= 4
}

export interface TopicCard {
  text: string
  diagram?: string
}

/** Split graphs/diagrams sections into topic cards with optional diagram HTML. */
export function parseTopicCards(body: string): TopicCard[] {
  const trimmed = body.trim()
  if (!trimmed) return []

  // Each **Subheading** block may include bullets + one trailing diagram div.
  const parts = trimmed.split(/\n\n(?=\*\*[^*\n]+\*\*)/).filter(Boolean)
  const cards: TopicCard[] = []

  for (const part of parts) {
    const diagramMatch = part.match(/(<div class="enlight-physics-diagram">[\s\S]*?<\/div>)\s*/)
    const diagram = diagramMatch?.[1]
    const text = diagramMatch ? part.replace(diagramMatch[0], '').trim() : part.trim()
    if (text || diagram) cards.push({ text, diagram })
  }

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
  t = t.replace(/\$\.\$/g, '2')
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
    const lines = unwrapInnerDollarLines(inner.trim())
    if (lines.length > 1) {
      return lines.map((p) => `$$\n${p}\n$$`).join('\n\n')
    }

    const single = lines[0] ?? inner.trim().replace(/^\$+/, '').replace(/\$+$/, '').trim()
    const parts = single
      .split(/\n(?=(?:\\text\{|\$\s*\\text\{))/)
      .map((p) => p.trim().replace(/^\$+/, '').replace(/\$+$/, '').trim())
      .filter(Boolean)

    if (parts.length <= 1) return `$$\n${single}\n$$`
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
          if (/^\\(text|frac|begin|left|Rightarrow|quad)\b/.test(t)) {
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
  return text
    .split('\n')
    .map((line) => {
      let l = line
      l = l.replace(/\$\.\$/g, '2')

      const dollars = l.match(/(?<!\\)\$/g)?.length ?? 0
      if (dollars % 2 === 1) {
        l = `${l.trimEnd()}$`
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
}

/** Strip nested $...$ inside $$ display blocks (invalid KaTeX — common import artefact). */
function unwrapNestedInlineInDisplay(text: string): string {
  return text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const cleaned = inner
      .replace(/\$([^$]+)\$/g, (_m: string, math: string) => math.trim())
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

/** Fix common Word/import artifacts in note markdown before math normalization. */
export function repairImportedNoteArtifacts(text: string): string {
  let t = text
  t = promoteDiagramCaptions(t)
  t = fixDollarTwoPlaceholder(t)
  t = fixInlineMathLines(t)
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
