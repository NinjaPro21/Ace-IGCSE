/**
 * Single source of truth for physics note LaTeX repair.
 * Used by polish-physics-notes.mjs and fix-all-note-latex.mjs (physics only).
 */

/** Strip $...$ wrappers from long prose accidentally treated as math. */
export function unwrapRunawayInlineMath(text) {
  return text.replace(/\$([^$\n]+)\$/g, (match, inner) => {
    const trimmed = inner.trim()
    if (!trimmed) return match

    const hasStrongMath =
      /\\(frac|sqrt|text|Delta|theta|rho|tan|Rightarrow|times|approx|pm|cdot|quad)/.test(trimmed) ||
      /[_^{}\\]/.test(trimmed) ||
      /^[+\-=]?\s*\d/.test(trimmed)

    if (hasStrongMath) return match

    const longWords = (trimmed.match(/[A-Za-z]{4,}/g) || []).length
    const letterCount = trimmed.replace(/[^A-Za-z]/g, '').length

    if (longWords >= 3 && letterCount > 20) {
      return trimmed.replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\,/g, ' ')
    }

    if (/^[A-Za-z]/.test(trimmed) && !/\s/.test(trimmed) && trimmed.length > 30) {
      return trimmed.replace(/\\text\{([^}]*)\}/g, '$1')
    }

    return match
  })
}

export function closeUnclosedInlineMath(text) {
  return text
    .split('\n')
    .map((line) => {
      if (line.includes('enlight-physics-diagram') || /^<\/?[a-z]/i.test(line.trim())) return line
      let l = line
      l = l.replace(
        /(\$[^$\n]+\\text\{[^}]+\})\.\s+(Calculate|What|Use|If|Step|Describe|Express|Identify|Find|A|The|When|Two|Sum|Apply|Solve|Rearrange|Substitute)/gi,
        '$1$. $2',
      )
      l = l.replace(
        /(\$[^$\n]+\\text\{[^}]+\})\.\s*$/g,
        '$1$.',
      )
      l = l.replace(
        /(\$[^$\n]+\\[^$]+)\.\s+(Calculate|What|Use|If|Step|Describe|Express|Identify|Find|When|Two|Sum|Apply|Solve)/gi,
        '$1$. $2',
      )
      l = l.replace(/(\$\([^)]+\))\.\s*$/g, '$1$.')
      l = l.replace(/(\$\([^)]+\))\.\s+(Calculate|What|Use|If|at|When|Two|Sum|Apply|Solve)/gi, '$1$. $2')
      const dollars = (l.match(/\$/g) || []).length
      if (dollars % 2 === 0) return l
      if (/\$[^$\n]+\.\s*$/.test(l)) {
        return l.replace(/(\$[^$\n]+)(\.)(\s*)$/, '$1$$$2$3')
      }
      if (/\$[A-Za-z_][A-Za-z0-9_]*\.\s*$/.test(l)) {
        return l.replace(/(\$[A-Za-z_][A-Za-z0-9_]*)(\.)(\s*)$/, '$1$$$2$3')
      }
      if (/\$[^$\n]+\?\s*$/.test(l)) {
        return l.replace(/(\$[^$\n]+)(\?\s*)$/, '$1$$$2')
      }
      return l
    })
    .join('\n')
}

export function normalizeDisplayMath(text) {
  return text
    .replace(/\*\*([^*]+)\*\*\s+\$\$/g, '**$1**\n\n$$')
    .replace(/(\$)([^$\n]+)(\$\$)(?=\s*\n|\s*$)/g, '$$$2$$')
    .replace(/\$\$\$\$([\s\S]*?)\$\$/g, (_, inner) => `$$${inner.trim()}$$`)
    .replace(/\$\$\$([^$\n]+)\$\$/g, (_, inner) => `$$${inner.trim()}$$`)
    .replace(/(\$[^$\n]+)\$\$\$/g, (_, inner) => `$$${inner.trim()}$$`)
    .replace(/\$\$\$\$/g, '$$')
}

function fixDuplicatedAnswers(line) {
  return line
    .replace(/(\$[^$]+\$)\.\1/g, '$1')
    .replace(/(\d+(?:\.\d+)?\\text\{[^}]+\})\.\1(\$)?/g, '$1$2')
    .replace(/(\\text\{[^}]+\})\.(\d+(?:\.\d+)?\\text\{[^}]+\})/g, '$1')
    .replace(/(\\text\{[^}]+\})\.(\d+(?:\.\d+)?\\text\{[^}]+\}\$)/g, '$1')
    .replace(/(\d+(?:\.\d+)?\\text\{[^}]+\})\.(\d+(?:\.\d+)?\\text\{[^}]+\})/g, '$1')
    .replace(/direction\)\$/g, 'direction).')
}

function fixStepNumberGluedToFormula(line) {
  return line.replace(/^(\d+)\.(\d+)([a-zA-Z_\\])/g, '$1. $$$2$3')
}

function fixKnownCorruptions(line) {
  return line
    .replace(/for \\theta\.T\s*=/g, 'for $\\theta$. $T =')
    .replace(/Substitute \$20\$ for \\theta\.T/g, 'Substitute $20$ for $\\theta$. $T')
    .replace(/\\theta\.T/g, '$\\theta$. $T')
    .replace(/approx\$\./g, 'approx. $')
    .replace(/find the period \$T(?!\$)/g, 'find the period $T$')
    .replace(/\)\$\.(\d|\\)/g, ') $$$1')
    .replace(/\$([^$]+)\$\.([\\])/g, '$$$1$.\n\n$$$2')
    .replace(/([^$])\\Rightarrow/g, '$1 $\\Rightarrow$')
    .replace(/\\Rightarrow([^$])/g, '$\\Rightarrow$ $1')
    .replace(/formula\$/g, 'formula.')
    .replace(/(\d)\$\./g, '$1.')
    .replace(/([A-Za-z])\.(\\text|\\Delta)/g, '$1. $$2')
    .replace(/:\s*\\Delta/g, ': $\\Delta')
    .replace(/=\s*\\Delta/g, '= $\\Delta')
    .replace(/Use the formula\s+\\Delta/g, 'Use the formula $\\Delta')
    .replace(/Calculate\s+\\Delta/g, 'Calculate $\\Delta')
    .replace(/Solve for\s+\\Delta/g, 'Solve for $\\Delta')
    .replace(/Identify values\.t\s*=/g, 'Identify values: $t =')
    .replace(/Identify values\.c\s*=/g, 'Identify values: $c =')
    .replace(/\.t\s*=\s*0\./g, '. $t = 0.')
    .replace(/water\)\.d\s*=/g, 'water). $d =')
    .replace(/(\d)\.\$(\d)/g, '$1.$2')
    .replace(/(\d)\.\$\$(\d)/g, '$1.$2')
    .replace(/\$(\d)\$(\d)/g, '$$1$2')
    .replace(/(\d)\$(\d)(?=\s|\\text|,|\/|\)|$|\^)/g, '$1$2')
    .replace(/x²=/g, 'x2=')
    .replace(/y²=/g, 'y2=')
}

function fixWrongScalarAnswers(line) {
  return line
    .replace(/=\s+\+\$8\\text\{[^}]+\}\$\.[\s\S]*?\$1\\text\{[^}]+\}\$/g, (m) =>
      m.replace(/\$1\\text\{[^}]+\}\$/, '$8\\text{ N}$'),
    )
    .replace(/\\sqrt\{25\}\s*=\s*\$5\\text\{[^}]+\}\$[\s\S]*?\$1\\text\{[^}]+\}\$/g, (m) =>
      m.replace(/\$1\\text\{[^}]+\}\$/, '$5\\text{ N}$'),
    )
}

export function fixPhysicsLine(line) {
  if (!line?.trim()) return line
  if (line.includes('enlight-physics-diagram') || /^<\/?[a-z]/i.test(line.trim())) return line

  let t = line
  t = fixKnownCorruptions(t)
  t = fixStepNumberGluedToFormula(t)
  t = fixDuplicatedAnswers(t)
  t = fixWrongScalarAnswers(t)
  t = unwrapRunawayInlineMath(t)
  t = closeUnclosedInlineMath(t)
  return t
}

export function fixPhysicsWorkedExample(body) {
  return body.split('\n').map((raw) => fixPhysicsLine(raw)).join('\n')
}

export function fixPhysicsMarkdown(text) {
  let t = text
  t = normalizeDisplayMath(t)
  t = t.replace(/(\$\$[\s\S]*?)\$\$\s*\$\$/g, '$1$$')

  const parts = t.split(/(<div class="enlight-physics-diagram">[\s\S]*?<\/div>)/)
  t = parts
    .map((part) => (part.startsWith('<div class="enlight-physics-diagram"') ? part : fixPhysicsWorkedExample(part)))
    .join('')

  t = unwrapRunawayInlineMath(t)
  t = closeUnclosedInlineMath(t)
  return normalizeDisplayMath(t)
}
