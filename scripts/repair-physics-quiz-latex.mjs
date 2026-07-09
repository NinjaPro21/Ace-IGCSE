/**
 * Safe LaTeX repairs for physics quiz JSON (docx import artefacts).
 * Used by repair-physics-active-pass.mjs — not a full fixQuizLatexText pass.
 */

/** Fix ^circ missing backslash (common in angles). */
function fixCirc(text) {
  return text
    .replace(/\^\\circ/g, '^\\circ') // idempotent
    .replace(/\^circ/g, '^\\circ')
}

/** Docx ate $ around numbers after prose glue words. */
function fixCaretGlue(text) {
  let t = text
  t = t.replace(/factor of\^(\d+)/gi, 'factor of $$1$')
  t = t.replace(/By a factor of\^(\d+)/gi, 'By a factor of $$1$')
  t = t.replace(/by a factor of\^(\d+)/gi, 'by a factor of $$1$')
  t = t.replace(/a factor of\^(\d+)/gi, 'a factor of $$1$')
  t = t.replace(/the same factor of\^(\d+)/gi, 'the same factor of $$1$')
  t = t.replace(/rate of\^(\d+)/gi, 'rate of $$1$')
  t = t.replace(/at a rate of\^(\d+)/gi, 'at a rate of $$1$')
  t = t.replace(/Less than\^(\d+)/gi, 'Less than $$1$')
  t = t.replace(/Exactly\^(\d+)/gi, 'Exactly $$1$')
  t = t.replace(/More than\^(\d+)/gi, 'More than $$1$')
  t = t.replace(/take\^(\d+)/gi, 'take $$1$')
  t = t.replace(/Selecting\^(\d+)/gi, 'Selecting $$1$')
  t = t.replace(/between(\d+)and\^(\d+)/gi, 'between $$1$ and $$2$')
  t = t.replace(
    /\b(of|or|between|by|side|radius|and|at|height|length|ladder)\^(\d+)/gi,
    (_, word, n) => `${word} $${n}$`,
  )
  return t
}

/** Class J — unclosed $var before prose. */
function fixUnclosedVarBeforeProse(text) {
  return text.replace(
    /\$([a-zA-Z])\s{1,}(of|is|and|the|when|at|in|for|a|an|or|with|from|by|to|metres|meters|gives|where|increasing|decreasing|reflection)\b/gi,
    '$$$1$ $2',
  )
}

/** $90^circ. → $90^\circ$. (missing \ and closing $). */
function fixAngleAtEndOfSentence(text) {
  return text.replace(/\$(\d+)\^\\circ\./g, '$$$1^\\circ$.')
}

/** Close single-letter variables opened with $ but not closed before prose. */
function fixSingleVarOpenMath(text) {
  return text.replace(
    /\$([a-zA-Z])\s{2,}(and|or|\+|=)/g,
    '$$$1$ $2',
  )
}

/** Broken ($i ) style fragments. */
function fixBrokenParenMath(text) {
  return text.replace(/\(\$([a-zA-Z])\s+\)/g, '($$$1$)')
}

/** Glue like "V_s  for 100\%$" — close math before prose. */
function fixMathBeforeForPercent(text) {
  return text.replace(
    /(\$[^$\n]+)\s{2,}for\s+(\d+\\%)\$/g,
    (_, math, pct) => {
      const inner = math.startsWith('$') ? math.slice(1) : math
      return `$${inner}$ for $${pct}$`
    },
  )
}

/** (r$) or angle of refraction (r$) → ($r$) — only when not already closed. */
function fixBareVarBeforeCloseParen(text) {
  return text.replace(/\(([a-zA-Z])\$(?!\$)/g, '($$$1$')
}

/** Fix bare Delta tokens inside $...$ blocks. */
function fixDeltaInMathBlocks(text) {
  return text.replace(/\$([^$\n]+)\$/g, (match, inner) => {
    if (!/\bDelta /.test(inner) && !/\brho\b/.test(inner)) return match
    const fixed = inner
      .replace(/\bDelta /g, '\\Delta ')
      .replace(/\brho\b/g, '\\rho')
    return `$${fixed}$`
  })
}

/** Undo double-$ artefacts from earlier repair passes. */
function fixRegressionArtifacts(text) {
  return text
    .replace(/\$\$\\Delta/g, '$\\Delta')
    .replace(/\(\$r\$\)\)/g, '($r$)')
    .replace(/\band r\$ must\b/g, 'and $r$ must')
    .replace(/\$c = m \\times g \\times \$\\Delta h\$/g, '$c = m \\times g \\times \\Delta h$')
    .replace(/energy converted \$\$\\Delta E\$/g, 'energy converted $\\Delta E$')
    .replace(/\$\$\\Delta p\$/g, '$\\Delta p$')
    .replace(/in a liquid\$/g, 'in a liquid')
    .replace(/\(\$\\Delta p\$\) in a liquid\$/g, '($\\Delta p$) in a liquid')
}

function countDollars(text) {
  return (text.match(/(?<!\\)\$/g) ?? []).length
}

/** Try to close trailing unclosed inline math before sentence punctuation. */
function closeTrailingUnclosedMath(text) {
  if (countDollars(text) % 2 === 0) return text
  if (/\$[^$\n]+\.\s*$/.test(text)) {
    return text.replace(/(\$[^$\n]+)(\.)(\s*)$/, '$1$$$2$3')
  }
  if (/\$[^$\n]+\?\s*$/.test(text)) {
    return text.replace(/(\$[^$\n]+)(\?\s*)$/, '$1$$$2')
  }
  if (/\$[A-Za-z_][A-Za-z0-9_]*\s+and\b/.test(text)) {
    return text.replace(/(\$[A-Za-z_][A-Za-z0-9_]*)\s+(and\b)/, '$1$ $2')
  }
  return text
}

export function repairPhysicsQuizText(text) {
  if (!text || typeof text !== 'string') return text
  let t = text
  t = fixCirc(t)
  t = fixCaretGlue(t)
  t = fixUnclosedVarBeforeProse(t)
  t = fixSingleVarOpenMath(t)
  t = fixAngleAtEndOfSentence(t)
  t = fixBrokenParenMath(t)
  t = fixMathBeforeForPercent(t)
  t = fixBareVarBeforeCloseParen(t)
  t = fixDeltaInMathBlocks(t)
  t = fixRegressionArtifacts(t)
  t = closeTrailingUnclosedMath(t)
  return t
}
