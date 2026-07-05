/**
 * Cleans raw docx paragraph lines before markdown export.
 * Handles broken superscripts, split formulas, Word list artifacts,
 * and splits embedded worked examples out of Steps / method blocks.
 */

export const SUPERSCRIPT_MAP = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾', n: 'ⁿ', x: 'ˣ',
}

export function toSuperscript(text) {
  return [...text].map((ch) => SUPERSCRIPT_MAP[ch] ?? ch).join('')
}

/** Remove Word auto-numbering junk like "+1." on its own or as a prefix. */
export function stripListArtifact(line) {
  const t = line.trim()
  if (/^\+?\d+[.)]\s*$/.test(t)) return ''
  if (/^\+?\d+\.\s+[A-Z]/.test(t)) return t.replace(/^\+?\d+\.\s+/, '')
  return t
}

function absorbListNumber(raw, prev) {
  const m = raw.trim().match(/^\+?(\d+)\.\s*(.*)$/)
  if (!m || !prev) return null
  const [, num, rest] = m
  if (/x²\+?\d*$/.test(prev) || /g\(x\)=x²$/.test(prev) || /=\s*x²$/.test(prev)) {
    return { append: `+${num}`, rest: rest.trim() }
  }
  return null
}

export function mergeMathFragments(lines) {
  const out = []
  for (const raw of lines) {
    let line = raw?.trim()
    if (!line || line === '​') continue

    if (/^[²³⁰⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+$/.test(line) && out.length) {
      out[out.length - 1] += line
      continue
    }

    if (/^\d+$/.test(line) && out.length) {
      const prev = out[out.length - 1]
      if (/[a-zfgxynt]$/i.test(prev)) {
        out[out.length - 1] = prev + toSuperscript(line)
        continue
      }
      if (/[xynabctrf(\]↦−-]$/.test(prev) || prev.endsWith('(') || /\([−-]?\d*$/.test(prev)) {
        out[out.length - 1] = prev + toSuperscript(line)
        continue
      }
      if (/[=,]$/.test(prev)) {
        out[out.length - 1] = prev + line
        continue
      }
    }

    if (/^=\d/.test(line) && out.length) {
      out[out.length - 1] += line
      continue
    }

    if (/^\(.+\)$/.test(line) && out.length && /f[−-]?1$/i.test(out[out.length - 1])) {
      out[out.length - 1] = out[out.length - 1].replace(/f[−-]?1$/i, 'f⁻¹') + line
      continue
    }

    if (/^\(.+\)$/.test(line) && out.length && /²$/.test(out[out.length - 1])) {
      out[out.length - 1] += line
      continue
    }

    if (/^[∘°]\s*$/.test(line) && out.length) {
      out[out.length - 1] += '°'
      continue
    }

    if (/^θ/.test(line) && out.length && /(?:sin|cos|tan|sec|cosec|cot|sin²|cos²|tan²|sec²|cosec²|\d)\s*$/i.test(out[out.length - 1])) {
      out[out.length - 1] += line
      continue
    }

    if (/^(Opposite|Adjacent|Hypotenuse)$/i.test(line) && out.length && /=/.test(out[out.length - 1])) {
      out[out.length - 1] += ` ${line}`
      continue
    }

    if (/^dy/i.test(line) && out.length && /^dx$/i.test(out[out.length - 1])) {
      out[out.length - 1] += ` ${line}`
      continue
    }

    if (/^x$/i.test(line) && out.length && /\(?e$/i.test(out[out.length - 1])) {
      out[out.length - 1] += 'x'
      continue
    }

    if (/^′$|^'$/.test(line) && out.length) {
      out[out.length - 1] += '′'
      continue
    }

    if (/^x\)=e$/i.test(line) && out.length) {
      out[out.length - 1] += line.replace(/^x/, 'x')
      continue
    }

    if (/^f\(x\)$/i.test(line) && out.length && /\(e$/.test(out[out.length - 1])) {
      out[out.length - 1] += line
      continue
    }

    out.push(line)
  }
  return out
}

function isNewStepLine(line) {
  return (
    /^(Question:|Solution:|Worked Example\s+\d)/i.test(line) ||
    /^[A-Z][A-Za-z /]{2,42}:\s/.test(line)
  )
}

function shouldJoinLines(prev, line) {
  const t = stripListArtifact(line)
  if (!t) return false
  if (isNewStepLine(t)) return false

  if (/^\+?\d+[.)]/.test(t) && /[x²³\d)]$/.test(prev)) return true
  if (/[(\[=:−-]$/.test(prev)) return true
  if (/²$/.test(prev) && /^\(/.test(t)) return true
  if (/=2$/.test(prev) && /^x\+1/.test(t)) return true
  if (/=2\^\($/.test(prev) && /^x\+1/.test(t)) return true
  if (/f\(2\^\($/.test(prev) && /^x\+1/.test(t)) return true
  if (/=2\^\(x\+1\)$/.test(prev) && /^\+1/.test(t)) return true
  if (/=f\(2/.test(prev)) return true
  if (/f[−-]?1$/i.test(prev) && /^\(\s*x/.test(t)) return true
  if (/f[−-]?1$/i.test(prev) && /^and\s/i.test(t)) return true
  if (/and f[−-]?1$/i.test(prev) && /^intersect/i.test(t)) return true
  if (/^\d+$/.test(prev) && (/^[∘°]$/.test(t) || /^to \d+/.test(t))) return true
  if (/^to \d+$/.test(prev) && /^[∘°]/.test(t)) return true
  if (/^[,∘°]/.test(t) && !/^[A-Z][a-z]+:/.test(t)) return true
  if (/^θ/.test(t) && /(?:sin|cos|tan|sec|cosec|cot|\d)\s*$/i.test(prev)) return true
  if (/^,\s*(?:sin|cos|tan|sec|cosec)/i.test(t)) return true
  if (/^(dx|dy|dt|du|dv|d²|d|∫|log|n|r|u|v|x|e|a|b|y|k|c|t|s|m|h|A|V|S|P|C|Q|D|R|f|g|π|θ|′|⁻|¹|²|³|\d+)$/i.test(t)) return true
  if (/^\(?e$/i.test(t) && /d$/i.test(prev)) return true
  if (/^x\)?=e$/i.test(t)) return true
  if (/^x$/i.test(t) && /\(?e$/i.test(prev)) return true
  if (/^f\(x\)$/i.test(t) && /\(e$/i.test(prev)) return true
  if (/^′$/.test(t)) return true
  if (/^(dx|dy|dt|du|dv)$/i.test(prev) && /^d$/i.test(t)) return true
  if (/^d$/i.test(prev) && /^\(/.test(t)) return true
  if (/^n$/i.test(prev) && /^P$|^C$|^!/.test(t)) return true
  if (/^[PRC]$/i.test(prev) && /^r$|^n$|^r=/.test(t)) return true
  if (/^log$/i.test(prev) && /^[a-z]$/i.test(t)) return true
  if (/^∫$/i.test(prev)) return true
  if (/^\[$/i.test(prev) || /^\]$/.test(t)) return true

  if (/^is\b/i.test(t) && /,\s*ex$/i.test(prev)) return true
  if (/^is\b/i.test(t) && /^ex$/i.test(prev)) return true
  if (/^x−1\)?$/.test(t) && /xe/i.test(prev)) return true

  if (/^[+−=)\d]/.test(t) && !/^[A-Z][a-z]+:/.test(t)) return true
  if (t.length <= 12 && /^[+−=)\d²³.,]/.test(t)) return true

  return false
}

function joinLines(prev, line) {
  const t = stripListArtifact(line)
  if (!t) return prev
  if (/^\+?\d/.test(t) && /[x²³\d)]$/.test(prev)) return prev + t
  if (/^[+−=)]/.test(t)) return prev + t
  if (/f[−-]?1$/i.test(prev) && /^and\s/i.test(t)) return `${prev} ${t}`
  if (/^f\(x\)$/i.test(prev) && /^\)/.test(t)) return `${prev}${t}`
  if (/^[∘°]/.test(t) && /\d$/.test(prev)) return `${prev}${t}`
  return `${prev} ${t}`
}

/** Join paragraphs that were split mid-formula by docx export. */
export function joinBrokenExpressions(lines) {
  const out = []
  for (const raw of mergeMathFragments(lines)) {
    const trimmed = raw?.trim()
    if (!trimmed) continue

    if (/^\+?\d+\.\s*$/.test(trimmed) && out.length) {
      out[out.length - 1] += `+${trimmed.replace(/\D/g, '')}`
      continue
    }

    const absorbed = out.length ? absorbListNumber(trimmed, out[out.length - 1]) : null
    let line = absorbed ? absorbed.rest : stripListArtifact(trimmed)
    if (absorbed?.append) out[out.length - 1] += absorbed.append
    if (!line) continue

    if (out.length === 0) {
      out.push(line)
      continue
    }

    const prev = out[out.length - 1]
    if (shouldJoinLines(prev, line)) {
      out[out.length - 1] = joinLines(prev, line)
    } else {
      out.push(line)
    }
  }
  return out
}

/** Apply a transform only to text outside $...$ inline math delimiters. */
function mapOutsideMath(text, fn) {
  return text
    .split(/(\$[^$\n]+\$)/)
    .map((part) => (part.startsWith('$') && part.endsWith('$') ? part : fn(part)))
    .join('')
}

function fixExponentPass(segment) {
  let t = segment
  t = t.replace(/2\s+x\+1/g, '$2^{x+1}$')
  t = t.replace(/4\s+x\+1/g, '$4^{x+1}$')
  t = t.replace(/(\d+)\^\(([^)]+)\)/g, (_, base, exp) => `$${base}^{${exp}}$`)
  t = t.replace(/=2\s*x\+1/g, '=$2^{x+1}$')
  t = t.replace(/f\(2\^\(x\+1\)\)/g, 'f($2^{x+1}$)')
  t = t.replace(/f\(2\^\(\s*x\+1\)/g, 'f($2^{x+1}$')
  t = t.replace(/2\^\(\s*x\+1\)\+1/g, '$2^{x+1}$+1')
  t = t.replace(/4\^\(x\+1\)\+2/g, '$4^{x+1}$+2')
  t = t.replace(/4\^\(x\+1\)\+3/g, '$4^{x+1}$+3')
  t = t.replace(/4\^\(x\+1\)\+3=5/g, '$4^{x+1}$+3=5')
  t = t.replace(/4\s*\^\s*\(\s*x\+1\s*\)\s*\+3/g, '$4^{x+1}$+3')
  t = t.replace(/4\s*x\+1\+2/g, '$4^{x+1}$+2')
  t = t.replace(/4\s*x\+3/g, '$4^{x+1}$+3')
  t = t.replace(/4\s*x\+3=5/g, '$4^{x+1}$+3=5')
  t = t.replace(/=f\(\s*x\+1\s*\)=2/g, '=f($2^{x+1}$)=2^(')
  t = t.replace(/4\s+x\+1\+2=4\s+x\+3/g, '$4^{x+1}$+2=$4^{x+1}$+3')
  t = t.replace(/4\s+x\+3=5/g, '$4^{x+1}$+3=5')
  return t
}

function fixInversePass(segment) {
  return segment
    .replace(/f⁻¹\s*\(\s*x\s*\)/g, '$f^{-1}(x)$')
    .replace(/f[−-]1\s*\(\s*x\s*\)/gi, '$f^{-1}(x)$')
    .replace(/f⁻¹/g, '$f^{-1}$')
    .replace(/f[−-]1/gi, '$f^{-1}$')
    .replace(/f\(x\)=f\$f\^\{-1\}\$\(x\)/g, 'f(x)=$f^{-1}(x)$')
}

function fixLogPass(segment) {
  return segment.replace(/(?:=\s*)?\blnx\b/gi, (m) => (m.startsWith('=') ? '=$\\ln x$' : '$\\ln x$'))
}

function fixLnSpacePass(segment) {
  return segment.replace(/\bln\s+x\b/gi, '$\\ln x$')
}

function fixExpPass(segment) {
  return segment
    .replace(/f\(x\)=e\s+x\b/gi, 'f(x)=$e^x$')
    .replace(/\be\s+x\b/gi, '$e^x$')
    .replace(/\bex is its own/gi, '$e^x$ is its own')
    .replace(/\bderivative of ex\b/gi, 'derivative of $e^x$')
    .replace(/\by=ex²\+(\d+x|\d+x)/gi, 'y=$e^{x^2+$1}$')
    .replace(/\by=ex([²+\d])/gi, (_, tail) => (tail === '²' ? 'y=$e^{x^2}$' : `y=$e^{x${tail}}$`))
    .replace(/\)\s*ex²\+(\d+x)/g, ')$e^{x^2+$1}$')
    .replace(/\be f\(x\)/g, '$e^{f(x)}$')
    .replace(/\b(\d+)e\s+(\d+x)\b/gi, (_, a, b) => `$${a}e^{${b}}$`)
    .replace(/\bas \$xe\^\{x-1\}\$\s*\n?\s*x−1\)?/gi, 'as $xe^{x-1}$')
    .replace(/\$xe\^\{x-1\}\$\s+x−1\)?/gi, '$xe^{x-1}$')
}

function fixMiscPass(segment) {
  return segment
    .replace(/x↦x2\b/g, 'x↦x²')
    // Skip SVG coordinate attrs (x2="…") — aggressive mode was corrupting diagrams.
    .replace(/\bx2\b(?!=")/g, 'x²')
    .replace(/\bx3\b(?!=")/g, 'x³')
    .replace(/f2\b/g, 'f²')
    .replace(/g2\b/g, 'g²')
    // Do not convert trailing "2" in numbers like 12 N or 1200 — breaks physics values.
    .replace(/\(([−-]?\d+)\)\s*2(?=[,=.\s]|$)/g, '($1)²')
    .replace(/\(([−-]?\d+)\)2(?=[,=.\s]|$)/g, '($1)²')
    .replace(/([,:\s])([−-]?\d+)\s+2(?=[,=.\s]|$)/g, '$1$2²')
    .replace(/=f\(\$2\^\{x\+1\}\$\)/g, '=f($2^{x+1}$)')
    .replace(/\(²/g, '(')
    .replace(/f²\s*\(/g, 'f²(')
}

function fixTrigPass(segment) {
  let t = segment
  t = t.replace(/\b(sin|cos|tan)[−-]1\b/gi, (_, fn) => `$\\${fn.toLowerCase()}^{-1}$`)
  t = t.replace(/\b(sin|cos|tan|sec|cosec|cot)²\s*θ/gi, (_, fn) => `$\\${fn.toLowerCase()}^2\\theta$`)
  t = t.replace(/\b(sin|cos|tan|sec|cosec|cot)\s*θ/gi, (_, fn) => `$\\${fn.toLowerCase()}\\theta$`)
  t = t.replace(/\b(sin|cos|tan|sec|cosec|cot)x\b/gi, (_, fn) => `$\\${fn.toLowerCase()} x$`)
  t = t.replace(/\bθ\b/g, '$\\theta$')
  t = t.replace(/(\d+)\s*°/g, '$1^{\\circ}')
  t = t.replace(/(\d+)\s*∘/g, '$1^{\\circ}')
  return t
}

function fixCalculusPass(segment) {
  let t = segment
  t = t.replace(/\bdx\s+d\s*\(\s*e\s*\^?\s*x\s*\)\s*=\s*e\s*\^?\s*x/gi, '$\\frac{d}{dx}(e^x)=e^x$')
  t = t.replace(/\bdx\s+d\s*\(\s*e\s*\^?\s*\{?\s*f\(x\)\s*\}?\s*\)\s*=\s*f\s*′?\s*\(?\s*x\s*\)?\s*e\s*\^?\s*f\(x\)/gi,
    '$\\frac{d}{dx}(e^{f(x)})=f\'(x)e^{f(x)}$')
  t = t.replace(/\bdx\s+d\s*\(\s*\\?\$?\\?(?:ln|sin|cos|tan)/gi, (m) =>
    m.replace(/\bdx\s+d\s*\(/, '$\\frac{d}{dx}('))
  t = t.replace(/\bdx²\s+d²\s*y\s*=\s*dx\s+d\s*\(\s*dx\s+dy\s*\)/gi, '$\\frac{d^2y}{dx^2}=\\frac{d}{dx}\\left(\\frac{dy}{dx}\\right)$')
  t = t.replace(/\bdx\s+dy\s*=\s*0/gi, '$\\frac{dy}{dx}=0$')
  t = t.replace(/\bdx\s+dy\s*=\s*du\s+dy\s*×\s*dx\s+du/gi, '$\\frac{dy}{dx}=\\frac{dy}{du}\\times\\frac{du}{dx}$')
  t = t.replace(/\bdx\s+d\s*\(\s*uv\s*\)\s*=\s*u\s+dx\s+dv\s*\+\s*v\s+dx\s+du/gi,
    '$\\frac{d}{dx}(uv)=u\\frac{dv}{dx}+v\\frac{du}{dx}$')
  t = t.replace(/\bn\s+P\s+r\s*=\s*\(?\s*n−r\s*\)?!\s*n!/gi, '$_{n}P_{r}=\\frac{n!}{(n-r)!}$')
  t = t.replace(/\bn\s+C\s+r\s*=\s*\(?\s*r\s*\/?\s*n\s*\)?\s*=\s*r!\s*\(?\s*n−r\s*\)?!\s*n!/gi,
    '$_{n}C_{r}=\\binom{n}{r}=\\frac{n!}{r!(n-r)!}$')
  t = t.replace(/\be\s+x\b/gi, '$e^x$')
  t = t.replace(/\be\s+(\d+x|[0-9]+x)/gi, (_, p) => `$e^{${p.replace(/\s+/, '')}}$`)
  t = t.replace(/\bdx\s+dy\s*=\s*(\d+)e\s+(\d+x)/gi, '$\\frac{dy}{dx}=$1e^{$2}$')
  t = t.replace(/\bdx\s+dy\b/gi, '$\\frac{dy}{dx}$')
  t = t.replace(/\bdx\s+d\b/gi, '$\\frac{d}{dx}$')
  t = t.replace(/\bdx²\s+d²\b/gi, '$\\frac{d^2}{dx^2}$')
  t = t.replace(/\bdt\s+dy\b/gi, '$\\frac{dy}{dt}$')
  t = t.replace(/\bdt\s+d\b/gi, '$\\frac{d}{dt}$')
  t = t.replace(/\bdt²\s+d²\b/gi, '$\\frac{d^2}{dt^2}$')
  t = t.replace(/\b∫\s*x\s*\^?\s*n\s+dx\s*=\s*n\+1\s+x\s*\^?\s*n\+1\s*\+c/gi,
    '$\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+c$')
  t = t.replace(/\b∫\s*k\s*dx\s*=\s*k\s*x\s*\+c/gi, '$\\int k\\,dx=kx+c$')
  t = t.replace(/\bn!\s*=\s*n×/gi, '$n!=n\\times$')
  return t
}

function polishMathLine(line) {
  return line
    .replace(/\$f\^{-1\}\$\s*\(\s*x\s*\)/g, '$f^{-1}(x)$')
    .replace(/\$f\^{-1\}\$\s*\(\s*x\s*\)\s*=/g, '$f^{-1}(x)=')
    .replace(/\$(\\[a-z]+\\theta)\$\$(\\[a-z]+\\theta)\$/g, '$$$1$2$')
    .replace(/\$(\\[a-z]+\\theta)\$\=(\d+)/g, '$$$1=$2$')
    .replace(/\$(\\[a-z]+\\theta)\$\=/g, '$$$1=$')
    .replace(/(^|[\s,(])θ=(\d+\^\{\\circ\})/g, '$1$\\theta=$2$')
    .replace(/(^|[\s,(])θ=/g, '$1$\\theta$=')
    .replace(/(\d+)cos²θ/g, '$1\\cos^2\\theta$')
    .replace(/(\d+)sin²θ/g, '$1\\sin^2\\theta$')
    .replace(/\bcos²θ/g, '$\\cos^2\\theta$')
    .replace(/\bsin²θ/g, '$\\sin^2\\theta$')
    .replace(/\btan²θ/g, '$\\tan^2\\theta$')
    .replace(/\s+\$\s+(?=[A-Za-z(])/g, ' ')
    .replace(/\s+\$\s*$/g, '')
    .replace(/^\$\s+/g, '')
}

export function fixMathInLine(line) {
  const passes = [fixExponentPass, fixInversePass, fixExpPass, fixLogPass, fixLnSpacePass, fixMiscPass, fixTrigPass, fixCalculusPass]
  let t = line
  for (const pass of passes) {
    t = mapOutsideMath(t, pass)
  }
  t = mapOutsideMath(t, (seg) => seg.replace(/⟹/g, ' $\\Rightarrow$ '))
  return polishMathLine(t.replace(/\s{2,}/g, ' ').trim())
}

/** Split a dense Solution paragraph into numbered steps. */
export function splitSolutionBody(text) {
  const body = text.replace(/^Solution:\s*/i, '').trim()
  if (!body) return []

  if (/⟹|⇒/.test(body)) {
    const parts = body.split(/\s*(?:⟹|⇒)\s*/).filter(Boolean)
    if (parts.length > 1) {
      return parts.map((part, i) =>
        fixMathInLine(i === 0 ? part.trim() : `So ${part.trim()}`),
      )
    }
  }

  const fixed = fixMathInLine(body)
  if (/\$\\Rightarrow\$/.test(fixed)) {
    const parts = fixed.split(/\s*\$\\Rightarrow\$\s*/).filter(Boolean)
    if (parts.length > 1) {
      return parts.map((part, i) => (i === 0 ? part.trim() : `So ${part.trim()}`))
    }
  }

  const verbSplit = body.split(
    /\.\s+(?=Draw|Reflect|Plot|Solve|Set|Swap|Instead|Find|Simplify|Inner|Substitute|Apply|The intersection|Intersection|Therefore)/i,
  )
  if (verbSplit.length > 1) {
    return verbSplit.map((s) => {
      const t = s.trim()
      const line = t.endsWith('.') ? t : `${t}.`
      return fixMathInLine(line)
    })
  }

  const sentences = body.split(/(?<=[.)])\s+(?=[A-Z(])/).filter(Boolean)
  if (sentences.length > 1) return sentences.map((s) => fixMathInLine(s.trim()))

  return [fixed]
}

/** Split "Example N (paper ref): …" blocks from a worked-examples section. */
export function splitExampleBlocks(lines) {
  const examples = []
  let current = null

  for (const raw of lines) {
    const line = stripListArtifact(raw)
    if (!line) continue
    const m = line.match(/^Example\s+(\d+)\s*\(([^)]+)\)\s*:?\s*(.*)$/i)
    if (m) {
      if (current) examples.push(current)
      const rest = m[3]?.trim() ?? ''
      current = { title: `Example ${m[1]} (${m[2].trim()})`, lines: rest ? [rest] : [] }
      continue
    }
    if (current) current.lines.push(line)
    else if (line.trim()) current = { title: 'Worked example', lines: [line] }
  }
  if (current) examples.push(current)
  return examples
}

export function splitStepsAndExamples(lines) {
  const exploded = []
  for (const raw of lines) {
    const line = stripListArtifact(raw)
    if (!line) continue
    if (/Worked Example/i.test(line)) {
      exploded.push(...line.split(/(?=Worked Example\s+)/i).map((s) => s.trim()).filter(Boolean))
    } else {
      exploded.push(line)
    }
  }

  const merged = joinBrokenExpressions(exploded)
  const methodLines = []
  const examples = []
  let current = null

  for (const raw of merged) {
    const line = stripListArtifact(raw)
    if (!line) continue

    const hdr = line.match(/^Worked Example\s+(?:(\d+)\s*)?\(([^)]+)\)\s*(?:Question:|Solution:|\s*$)/i)
    if (hdr) {
      if (current) examples.push(current)
      current = { num: hdr[1] || '1', title: hdr[2].trim(), lines: [] }
      const rest = line.replace(/^Worked Example\s+(?:(\d+)\s*)?\([^)]+\)\s*/i, '').trim()
      if (rest) current.lines.push(rest)
      continue
    }

    if (current) current.lines.push(line)
    else methodLines.push(line)
  }
  if (current) examples.push(current)

  return { methodLines, examples }
}

export function consolidateMethodSteps(lines) {
  const steps = []
  let buf = ''

  const flush = () => {
    if (!buf.trim()) return
    steps.push(fixMathInLine(buf.trim()))
    buf = ''
  }

  for (const line of lines) {
    if (/^[A-Z][A-Za-z /]{2,42}:\s/.test(line) && buf) {
      flush()
      buf = line
    } else if (!buf) {
      buf = line
    } else {
      buf += ` ${line}`
    }
  }
  flush()
  return steps
}

function collapseShortFragments(paragraphs) {
  const out = []
  for (const p of paragraphs) {
    const trimmed = p.trim()
    if (!trimmed) continue
    const continuesPrev =
      out.length > 0 &&
      !/^(Question:|Solution:|Find|Simplify|Solve|Inner|Substitute|The |Since|Apply|Identify|Classify)/i.test(
        trimmed,
      ) &&
      (trimmed.length < 60 ||
        /^[\dx+−=⟹⇒().^,\s]+$/i.test(trimmed) ||
        (/(\$f\^{-1\}|f[−-]?1)\s*$/i.test(out[out.length - 1]) && /^and\s/i.test(trimmed)))
    if (continuesPrev) {
      out[out.length - 1] += ` ${trimmed}`
    } else {
      out.push(trimmed)
    }
  }
  return out
}

export function formatWorkedExampleLines(lines) {
  const merged = joinBrokenExpressions(lines)
  const paragraphs = []
  let buf = ''

  const flush = () => {
    if (!buf.trim()) return
    const text = buf.trim()
    if (/Question:/i.test(text) && /Solution:/i.test(text)) {
      const match = text.match(/Question:\s*([\s\S]*?)\s*Solution:\s*([\s\S]*)/i)
      if (match) {
        paragraphs.push(`Question: ${match[1].trim()}`)
        const solution = match[2].trim()
        if (solution) paragraphs.push(`Solution: ${solution}`)
      } else {
        paragraphs.push(text)
      }
    } else if (/Solution:/i.test(text)) {
      const match = text.match(/^([\s\S]*?)\s*Solution:\s*([\s\S]*)$/i)
      if (match && match[1].trim()) {
        paragraphs.push(match[1].trim())
        const solution = match[2].trim()
        if (solution) paragraphs.push(`Solution: ${solution}`)
      } else {
        paragraphs.push(text)
      }
    } else {
      paragraphs.push(text)
    }
    buf = ''
  }

  for (const raw of merged) {
    const line = stripListArtifact(raw)
    if (!line) continue

    if (/^(Question:|Solution:)/i.test(line)) {
      flush()
      buf = line
      continue
    }

    if (/^for the /i.test(line) && buf) {
      buf += ` ${line}`
      continue
    }

    if (/^(Inner|Substitute|Simplify|Find|Solve|Apply|Hence|Therefore|The range is|Since both)\b/i.test(line) && buf) {
      flush()
      buf = line
      continue
    }

    if (shouldJoinLines(buf, line)) {
      buf = joinLines(buf, line)
      continue
    }

    flush()
    buf = line
  }
  flush()

  const base = paragraphs.length ? paragraphs : merged
  return collapseShortFragments(base).flatMap((p) => {
    if (/^Solution:/i.test(p)) return splitSolutionBody(p)
    if (/^Question:/i.test(p)) return [fixMathInLine(p)]
    if (/⟹|⇒/.test(p)) return splitSolutionBody(p)
    if (/\$\\Rightarrow\$/.test(fixMathInLine(p))) return splitSolutionBody(p)
    return [fixMathInLine(p)]
  })
}

export function isOrphanPreambleLine(line) {
  const t = line?.trim()
  return !t || /^[∘°]\s*$|^to \d+|^\)\s*$|^\(\d+\s*$|^∘\)\s*$/.test(t)
}

export function cleanDisplayTitle(rawTitle) {
  return rawTitle
    .replace(/\s*\((Harder Topic|Harder Topics)\)\s*/gi, '')
    .replace(/^[\s&–—-]+\s*\d+\.\d+\s+/i, '')
    .replace(/^\d+\.\d+\s*[–—&]\s*\d+\.\d+\s*/i, '')
    .replace(/\s*\(\d+\s*$/, ' (0° to 90°)')
    .trim()
}

const BASIC_TRIG_FORMULAS = [
  '$\\sin\\theta = \\dfrac{\\text{Opposite}}{\\text{Hypotenuse}}$',
  '$\\cos\\theta = \\dfrac{\\text{Adjacent}}{\\text{Hypotenuse}}$',
  '$\\tan\\theta = \\dfrac{\\text{Opposite}}{\\text{Adjacent}}$',
  '$\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$',
]

const RECIPROCAL_TRIG_FORMULAS = [
  '$\\sec\\theta = \\dfrac{1}{\\cos\\theta}$, $\\cosec\\theta = \\dfrac{1}{\\sin\\theta}$, $\\cot\\theta = \\dfrac{1}{\\tan\\theta}$',
  '$\\sin^2\\theta + \\cos^2\\theta = 1$',
  '$1 + \\tan^2\\theta = \\sec^2\\theta$',
  '$1 + \\cot^2\\theta = \\cosec^2\\theta$',
]

const EXP_DERIV_FORMULAS = [
  '$\\frac{d}{dx}(e^x) = e^x$',
  '$\\frac{d}{dx}(e^{f(x)}) = f\'(x)e^{f(x)}$',
]

const TRIG_DERIV_FORMULAS = [
  '$\\frac{d}{dx}(\\sin x) = \\cos x$',
  '$\\frac{d}{dx}(\\cos x) = -\\sin x$',
  '$\\frac{d}{dx}(\\tan x) = \\sec^2 x$',
]

const LN_DERIV_FORMULAS = [
  '$\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$',
  '$\\frac{d}{dx}(\\ln[f(x)]) = \\frac{f\'(x)}{f(x)}$',
]

const CHAIN_RULE_FORMULAS = ['$\\frac{dy}{dx} = \\frac{dy}{du} \\times \\frac{du}{dx}$']

const PRODUCT_RULE_FORMULAS = ['$\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}$']

const QUOTIENT_RULE_FORMULAS = [
  '$\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}$',
]

const POWER_RULE_FORMULAS = ['If $f(x)=x^n$, then $f\'(x)=nx^{n-1}$']

const NPR_FORMULAS = ['$_{n}P_{r} = \\dfrac{n!}{(n-r)!}$']

const NCR_FORMULAS = ['$_{n}C_{r} = \\binom{n}{r} = \\dfrac{n!}{r!(n-r)!}$']

const FACTORIAL_FORMULAS = ['$n! = n \\times (n-1) \\times \\cdots \\times 1$, $0! = 1$']

const AP_FORMULAS = [
  '$u_n = a + (n-1)d$',
  '$S_n = \\frac{n}{2}[2a + (n-1)d]$ or $S_n = \\frac{n}{2}(a + l)$',
]

const GP_FORMULAS = [
  '$u_n = ar^{n-1}$',
  '$S_n = \\frac{a(1-r^n)}{1-r}$',
  '$S_\\infty = \\frac{a}{1-r}$ (when $|r|<1$)',
]

const LOG_LAWS_FORMULAS = [
  '$\\log_a(xy) = \\log_a x + \\log_a y$',
  '$\\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y$',
  '$\\log_a(x^n) = n\\log_a x$',
]

const INTEGRAL_POWER_FORMULAS = [
  '$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + c$ (for $n \\neq -1$)',
  '$\\int k\\,dx = kx + c$',
]

function joined(lines) {
  return lines.join(' ')
}

function isBasicTrigFormulaBlock(lines) {
  const j = joined(lines)
  return /sin/i.test(j) && /Hypotenuse/i.test(j) && /Opposite/i.test(j)
}

function isReciprocalTrigBlock(lines) {
  const j = joined(lines)
  return /sec/i.test(j) && /cosec/i.test(j)
}

function isExpDerivativeBlock(lines) {
  const j = joined(lines)
  return /dx/.test(j) && /\(e/.test(j) && /e/.test(j)
}

function isTrigDerivativeBlock(lines) {
  const j = joined(lines)
  return /dx/.test(j) && /sin/.test(j) && /cos/.test(j)
}

function isLnDerivativeBlock(lines) {
  const j = joined(lines)
  return /dx/.test(j) && /ln/.test(j)
}

function isChainRuleBlock(lines) {
  const j = joined(lines)
  return /du/.test(j) && /dy/.test(j) && /dx/.test(j) && !/sin|e\^|ln/.test(j)
}

function isProductRuleBlock(lines) {
  const j = joined(lines)
  return /\(uv\)|u.*dv.*v.*du/i.test(j) || (/dx/.test(j) && /uv/.test(j))
}

function isQuotientRuleBlock(lines) {
  const j = joined(lines)
  return (/v²|v\^2/.test(j) && /u/.test(j) && /dx/.test(j)) || /y=\s*v\s*\/?\s*u/i.test(j)
}

function isPowerRuleBlock(lines) {
  const j = joined(lines)
  return /f\(x\)=x/.test(j) && /nx/.test(j) && /n−1|n-1/.test(j)
}

function isPermutationBlock(lines) {
  const j = joined(lines)
  return ((/\bn\s*P\s*r\b/i.test(j) || /\(n−r\)!.*n!/.test(j)) && !/log/i.test(j))
}

function isCombinationBlock(lines) {
  const j = joined(lines)
  return ((/\bn\s*C\s*r\b/i.test(j) || /r!.*\(n−r\)!.*n!/.test(j)) && !/log/i.test(j))
}

function isFactorialBlock(lines) {
  const j = joined(lines)
  return /n!/.test(j) && /0!/.test(j) && !/P r|C r/.test(j)
}

function isAPBlock(lines) {
  const j = joined(lines)
  return /u/.test(j) && /a\+\(n−1\)d|a\+(n-1)d/.test(j) && /S/.test(j)
}

function isGPBlock(lines) {
  const j = joined(lines)
  return /ar/.test(j) && /1−r|1-r/.test(j)
}

function isLogLawBlock(lines) {
  const j = joined(lines)
  return /log/i.test(j) && (/log.*[+\-−]|log.*\(x|xy|x\/y/.test(j))
}

function isIntegralPowerBlock(lines) {
  const j = joined(lines)
  return /∫/.test(j) && /x/.test(j) && /n\+1|n+1/.test(j)
}

function isFormulaFragment(line) {
  const t = line.trim()
  if (!t) return true
  if (t.length <= 4) return true
  if (t.length <= 22 && /^[\d\s+\-−=×(),\/\[\]xna-z!′²³∫^_{}\\$]+$/.test(t)) return true
  if (/^(dx|dy|dt|du|dv|d²|d|∫|log|n|r|u|v|x|e|a|b|y|k|c|t|s|m|h|A|V|S|P|C|Q|D|R|f|g|π|θ|′|⁻|¹|²|³|\d+)$/i.test(t)) return true
  if (/^\$[^$]+\$$/.test(t) && t.length < 45) return true
  return false
}

function startsNewFormulaLine(line) {
  const t = line.trim()
  return (
    /^(For |If |To convert|Product Rule|Quotient Rule|Chain Rule|Stationary|Check |Row |Area |Volume |The n-th|Displac|Speed|Optimize|At stationary|Relationship|Substitut|Integration|Differentiation|Note:|\([A-Za-z])/i.test(
      t,
    ) || /^[A-Z][a-zA-Z ]{6,55}:\s/.test(t)
  )
}

function consolidateFormulaFragments(lines) {
  const merged = joinBrokenExpressions(lines)
  const out = []
  let buf = ''

  const flush = () => {
    if (!buf.trim()) return
    out.push(buf.trim())
    buf = ''
  }

  for (const raw of merged) {
    const line = stripListArtifact(raw)
    if (!line) continue

    if (!buf) {
      buf = line
      continue
    }

    if (startsNewFormulaLine(line) && !isFormulaFragment(line)) {
      flush()
      buf = line
    } else if (isFormulaFragment(line) || isFormulaFragment(buf) || buf.length < 50) {
      if (/^[),.;:²³′⁻¹=]/.test(line)) buf += line
      else if (/[=(\[]$/.test(buf.trim())) buf += line
      else buf += (line.startsWith(',') || line.startsWith(')')) ? line : ` ${line}`
    } else {
      flush()
      buf = line
    }
  }
  flush()
  return out.map(fixMathInLine).filter(Boolean)
}

function reconstructKeyFormulas(lines) {
  if (isBasicTrigFormulaBlock(lines)) return BASIC_TRIG_FORMULAS
  if (isReciprocalTrigBlock(lines)) return RECIPROCAL_TRIG_FORMULAS
  if (isExpDerivativeBlock(lines)) return EXP_DERIV_FORMULAS
  if (isTrigDerivativeBlock(lines)) return TRIG_DERIV_FORMULAS
  if (isLnDerivativeBlock(lines)) return LN_DERIV_FORMULAS
  if (isChainRuleBlock(lines)) return CHAIN_RULE_FORMULAS
  if (isProductRuleBlock(lines)) return PRODUCT_RULE_FORMULAS
  if (isQuotientRuleBlock(lines)) return QUOTIENT_RULE_FORMULAS
  if (isPowerRuleBlock(lines)) return POWER_RULE_FORMULAS
  if (isLogLawBlock(lines)) return LOG_LAWS_FORMULAS
  if (isCombinationBlock(lines)) return NCR_FORMULAS
  if (isPermutationBlock(lines)) return NPR_FORMULAS
  if (isFactorialBlock(lines)) return FACTORIAL_FORMULAS
  if (isAPBlock(lines)) return AP_FORMULAS
  if (isGPBlock(lines)) return GP_FORMULAS
  if (isIntegralPowerBlock(lines)) return INTEGRAL_POWER_FORMULAS
  return null
}

export function normalizeKeyFormulas(lines) {
  const merged = joinBrokenExpressions(lines)
  const reconstructed = reconstructKeyFormulas(merged)
  if (reconstructed) return reconstructed
  return consolidateFormulaFragments(lines)
}

export function normalizeGenericBlock(lines) {
  const joined = joinBrokenExpressions(lines)
  const fixed = joined.map(fixMathInLine).filter(Boolean)
  const out = []
  for (const line of fixed) {
    if (out.length && /^dx$/i.test(out[out.length - 1]) && /^dy/i.test(line)) {
      out[out.length - 1] = fixMathInLine(`${out[out.length - 1]} ${line}`)
    } else if (out.length && /\$f\^{-1\}\$?\s*$/.test(out[out.length - 1]) && /^[a-z(]/.test(line)) {
      out[out.length - 1] += ` ${line}`
    } else {
      out.push(line)
    }
  }
  return out
}
