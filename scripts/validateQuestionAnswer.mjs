/**
 * Validate a single MCQ question's correct answer against computed math.
 * Returns an array of error strings (empty if valid).
 */
import {
  coeffX2InExpansion,
  evalCubic,
  productOfCubicRootsMinusForm,
  substitutionQuadraticCoeff,
  parseNumericOption,
  parseQuadraticOption,
  factorial,
  nCr,
  nPr,
  gcd,
} from './quizMath.mjs'

function parseCubicFromTex(tex) {
  const normalized = tex.replace(/²/g, '^2').replace(/³/g, '^3').trim()
  const parts = normalized.split(/\s*([+-])\s*/)
  const terms = []
  if (parts[0]) terms.push(parts[0])
  for (let i = 1; i < parts.length; i += 2) {
    terms.push(parts[i] + parts[i + 1])
  }

  let a3 = 0
  let a2 = 0
  let a1 = 0
  let a0 = 0

  for (const term of terms) {
    const t = term.trim()
    if (!t) continue
    const sign = t.startsWith('-') ? -1 : 1
    const body = t.replace(/^[-+]/, '').trim()
    if (body.includes('x^3') || body.includes('x³')) {
      const n = body.replace(/x\^?3.*/, '') || '1'
      a3 = sign * Number(n)
    } else if (body.includes('x^2') || body.includes('x²')) {
      const n = body.replace(/x\^?2.*/, '') || '1'
      a2 = sign * Number(n)
    } else if (/^(\d*)x$/.test(body) || body === 'x') {
      const n = body.replace('x', '') || '1'
      a1 = sign * Number(n)
    } else if (/^\d+$/.test(body)) {
      a0 = sign * Number(body)
    }
  }

  if (a3 === 0 && a2 === 0 && a1 === 0 && a0 === 0) return null
  return [a3, a2, a1, a0]
}

function checkNumeric(id, q, expected) {
  const correctOpt = parseNumericOption(q.options[q.correctIndex])
  if (correctOpt === null) {
    return [`${id}: expected numeric ${expected}, correct option is non-numeric (${q.options[q.correctIndex]})`]
  }
  if (correctOpt !== expected) {
    return [
      `${id}: expected ${expected}, got ${correctOpt} (option ${q.correctIndex}: ${q.options[q.correctIndex]})`,
    ]
  }
  return []
}

function checkQuadratic(id, q, quad) {
  const correctQuad = parseQuadraticOption(q.options[q.correctIndex])
  if (!correctQuad) {
    return [`${id}: could not parse quadratic correct option (${q.options[q.correctIndex]})`]
  }
  if (
    correctQuad.a !== quad.a ||
    correctQuad.b !== quad.b ||
    correctQuad.c !== quad.c
  ) {
    return [
      `${id}: expected ${quad.a}x² + ${quad.b}x + ${quad.c} = 0, got ${correctQuad.a}x² + ${correctQuad.b}x + ${correctQuad.c} = 0`,
    ]
  }
  return []
}

function checkRootsPair(id, q, r1, r2) {
  const correct = q.options[q.correctIndex]
  const norm = correct.replace(/\$/g, '').replace(/\s/g, '')
  const hasR1 = norm.includes(String(r1))
  const hasR2 = norm.includes(String(r2))
  if (!hasR1 || !hasR2) {
    return [`${id}: expected roots ${r1} and ${r2}, got ${correct}`]
  }
  return []
}

/** @returns {string[]} */
export function validateMcqQuestion(q, id) {
  if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    return [`${id}: correctIndex ${q.correctIndex} out of range`]
  }

  const text = q.question
  let m

  // inverse f(a)=b → f^-1(b)=a (before f(x)=ax+b patterns)
  if (/inverse|f⁻¹|f\^{-1}/i.test(text)) {
    m = text.match(/f\((\d+)\)\s*=\s*(\d+)/)
    if (m) return checkNumeric(id, q, Number(m[1]))
  }

  // f(x) = ax - b, find f(c)
  m = text.match(/f\(x\)\s*=\s*(\d+)x\s*-\s*(\d+).*?f\((\d+)\)/s)
  if (m) {
    const expected = Number(m[1]) * Number(m[3]) - Number(m[2])
    return checkNumeric(id, q, expected)
  }

  m = text.match(/f\(x\)\s*=\s*(\d+)x\s*\+\s*(\d+).*?f\((\d+)\)/s)
  if (m) {
    const expected = Number(m[1]) * Number(m[3]) + Number(m[2])
    return checkNumeric(id, q, expected)
  }

  // range x² + k, x >= 0
  m = text.match(/f\(x\)\s*=\s*x²\s*\+\s*(\d+).*range/s)
  if (m) {
    const k = Number(m[1])
    const correct = q.options[q.correctIndex].replace(/\$/g, '')
    if (!correct.includes(String(k))) {
      return [`${id}: expected range with minimum ${k}, got ${q.options[q.correctIndex]}`]
    }
    return []
  }

  // |ax - b| = c
  m = text.match(/\|(\d+)x\s*-\s*(\d+)\|\s*=\s*(\d+)/)
  if (m && text.toLowerCase().includes('solve')) {
    const [a, b, c] = [+m[1], +m[2], +m[3]]
    const r1 = (b + c) / a
    const r2 = (b - c) / a
    if (Number.isInteger(r1) && Number.isInteger(r2)) {
      return checkRootsPair(id, q, r1, r2)
    }
  }

  // |ax + b| ≤ c critical
  m = text.match(/\|(\d+)x\s*\+\s*(\d+)\|.*?(?:\\le|≤)\s*(\d+)/)
  if (m && text.toLowerCase().includes('critical')) {
    const [a, b, c] = [+m[1], +m[2], +m[3]]
    const r1 = (c - b) / a
    const r2 = (-c - b) / a
    if (Number.isInteger(r1) && Number.isInteger(r2)) {
      return checkRootsPair(id, q, r1, r2)
    }
  }

  // log_b(x) = n (simple numeric RHS only — skip change-of-base / log_x forms)
  m = text.match(/log_(\d+)\(x\)\s*=\s*(\d+)\s*[\.$]?/)
  if (
    m &&
    !text.includes('+') &&
    !/log_\{?x\}?|\\log_x|log_x\(|\blog_\w+\(x\)/i.test(text)
  ) {
    const expected = Number(m[1]) ** Number(m[2])
    return checkNumeric(id, q, expected)
  }

  // log_b(x+a)=n
  m = text.match(/log_(\d+)\(x\s*\+\s*(\d+)\)\s*=\s*(\d+)/)
  if (m) {
    const expected = Number(m[1]) ** Number(m[3]) - Number(m[2])
    return checkNumeric(id, q, expected)
  }

  // b^(ax-c) = rhs
  m = text.match(/(\d+)\^\{?(\d+)x\s*-\s*(\d+)\}?\s*=\s*(\d+)/)
  if (m && text.toLowerCase().includes('solve')) {
    const base = Number(m[1])
    const a = Number(m[2])
    const c = Number(m[3])
    const rhs = Number(m[4])
    const exp = Math.round(Math.log(rhs) / Math.log(base))
    const expected = (exp + c) / a
    if (Number.isInteger(expected)) return checkNumeric(id, q, expected)
  }

  // arc length rθ
  m = text.match(/radius\s*\$?(\d+).*?(\d+\.?\d*)\s*(?:\\text\{)?\s*radians/i)
  if (m && text.toLowerCase().includes('arc length')) {
    const expected = Number(m[1]) * Number(m[2])
    const correct = parseNumericOption(q.options[q.correctIndex])
    if (correct !== null && correct !== expected) {
      return [`${id}: expected arc length ${expected}, got ${correct}`]
    }
  }

  // degrees → radians (only explicit conversion questions)
  m = text.match(/Convert an angle of (\d+)\^\\circ/i)
  if (m) {
    const deg = Number(m[1])
    const g = gcd(deg, 180)
    const correct = q.options[q.correctIndex].replace(/\$/g, '')
    const n = deg / g
    const d = 180 / g
    const needle = n === d ? '\\pi' : `${n}/${d}`
    if (!correct.includes(needle) && !correct.includes(String(n))) {
      return [`${id}: expected ${deg}° = ${needle}π radians, got ${q.options[q.correctIndex]}`]
    }
    return []
  }

  // sector area ½r²θ
  m = text.match(/radius\s*\$?(\d+).*angle\s*\$?(\d+\.?\d*)\s*(?:\\text\{)?\s*radians/i)
  if (m && text.toLowerCase().includes('area of a sector')) {
    const expected = 0.5 * Number(m[1]) ** 2 * Number(m[2])
    const correct = parseNumericOption(q.options[q.correctIndex])
    if (correct !== null && correct !== expected) {
      return [`${id}: expected sector area ${expected}, got ${correct}`]
    }
  }

  // sector angle from area
  m = text.match(/radius\s*\$?(\d+).*area\s*\$?(\d+)/is)
  if (m && text.toLowerCase().includes('angle') && text.includes('radians')) {
    const r = Number(m[1])
    const A = Number(m[2])
    const expected = A / (0.5 * r * r)
    return checkNumeric(id, q, expected)
  }

  // n!/(r!(n-r)!)
  m = text.match(/\\frac\{(\d+)!}{(\d+)!.*(\d+)!}/)
  if (m) {
    return checkNumeric(id, q, nCr(Number(m[1]), Number(m[2])))
  }

  // nPr
  m = text.match(/\^(\d+)P_\{?(\d+)\}?/)
  if (m) {
    return checkNumeric(id, q, nPr(Number(m[1]), Number(m[2])))
  }

  // committee nCr (plain selection only — skip constrained counting problems)
  if (text.toLowerCase().includes('committee')) {
    const constrained =
      /at least|at most|\bmust\b|refuse|together|not together|neither|both be|excluding|without both|contains at least|choose at least|distinct items|more .+ than|\bmen and \d+ women|\bwomen and \d+ men/i.test(
        text,
      )
    if (!constrained) {
      m = text.match(/committee of (\d+).*from (\d+)/i)
      if (m) return checkNumeric(id, q, nCr(Number(m[2]), Number(m[1])))
    }
  }

  // n distinct letters arrangements
  m = text.match(/(\d+)\s+distinct letters/i)
  if (m && text.toLowerCase().includes('arranged')) {
    return checkNumeric(id, q, factorial(Number(m[1])))
  }

  // coefficient of x² expansion
  m = text.match(
    /coefficient of \$x\^2\$.*\((\d+)x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\)\((\d+)x\s*-\s*(\d+)\)/i,
  )
  if (m) {
    return checkNumeric(id, q, coeffX2InExpansion(+m[1], +m[2], +m[4], +m[5]))
  }

  // expansion without "coefficient" keyword
  m = text.match(
    /expansion of \$(\d+)x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\)\((\d+)x\s*-\s*(\d+)\)/i,
  )
  if (m) {
    return checkNumeric(id, q, coeffX2InExpansion(+m[1], +m[2], +m[4], +m[5]))
  }

  // remainder
  m = text.match(
    /remainder when (?:the polynomial )?\$P\(x\) = (.+?)\$ is divided by \$x - (\d+)\$/i,
  )
  if (m) {
    const coeffs = parseCubicFromTex(m[1])
    if (coeffs) return checkNumeric(id, q, evalCubic(coeffs, +m[2]))
  }

  // product of roots
  m = text.match(/(\d+)x\^?3\s*-\s*(\d+)x\^?2\s*\+\s*(\d+)x\s*-\s*(\d+)\s*=\s*0/i)
  if (m && text.toLowerCase().includes('product')) {
    return checkNumeric(id, q, productOfCubicRootsMinusForm(+m[1], +m[4]))
  }

  // substitution into circle
  m = text.match(/y = (?:(\d+)x|x) \+ (\d+).*x² \+ y² = (\d+)/i)
  if (m) {
    const mx = m[1] ? Number(m[1]) : 1
    return checkQuadratic(id, q, substitutionQuadraticCoeff(mx, Number(m[2]), Number(m[3])))
  }

  // equal roots ax² - kx + c
  m = text.match(/(\d+)x²\s*-\s*kx\s*\+\s*(\d+)\s*=\s*0.*equal/i)
  if (m) {
    const a = Number(m[1])
    const c = Number(m[2])
    const k = Math.sqrt(4 * a * c)
    if (Number.isInteger(k)) return checkNumeric(id, q, k)
  }

  // critical values x² - bx - c > 0
  m = text.match(/x²\s*-\s*(\d+)x\s*-\s*(\d+)\s*>\s*0/i)
  if (m && text.toLowerCase().includes('critical')) {
    const b = Number(m[1])
    const c = Number(m[2])
    const s = Math.sqrt(b * b + 4 * c)
    if (Number.isInteger(s)) {
      const r1 = (b + s) / 2
      const r2 = (b - s) / 2
      return checkRootsPair(id, q, r1, r2)
    }
  }

  // y-intercept |ax²+bx+c|
  m = text.match(/\|(\d+)x\^2\s*-\s*(\d+)x\s*-\s*(\d+)\|/)
  if (m && text.toLowerCase().includes('y-intercept')) {
    return checkNumeric(id, q, Math.abs(Number(m[3])))
  }

  // gradient (ax-b)^n at x=1
  m = text.match(/y\s*=\s*\((\d+)x\s*-\s*(\d+)\)\^(\d+).*x\s*=\s*1/i)
  if (m) {
    const a = Number(m[1])
    const b = Number(m[2])
    const n = Number(m[3])
    const inner = a - b
    const expected = n * a * inner ** (n - 1)
    return checkNumeric(id, q, expected)
  }

  // stationary ax³ - bx
  m = text.match(/y\s*=\s*(\d+)x\^3\s*-\s*(\d+)x/i)
  if (m && text.toLowerCase().includes('stationary')) {
    const a = Number(m[1])
    const b = Number(m[2])
    const x = Math.sqrt(b / (3 * a))
    if (Number.isInteger(x)) {
      const correct = q.options[q.correctIndex].replace(/\$/g, '')
      if (!correct.includes(String(x)) || !correct.includes(String(-x))) {
        return [`${id}: expected stationary x = ±${x}, got ${q.options[q.correctIndex]}`]
      }
      return []
    }
  }

  // tangent to y=x²-bx+c at (px,py)
  m = text.match(/Tangent to \$y = x\^2 - (\d+)x \+ (\d+)\$ at \((\d+),\s*(\d+)\)/i)
  if (m) {
    const b = Number(m[1])
    const px = Number(m[3])
    const py = Number(m[4])
    const grad = 2 * px - b
    const intercept = py - grad * px
    const sign = intercept >= 0 ? '+' : '-'
    const absInt = Math.abs(intercept)
    const correct = q.options[q.correctIndex].replace(/\$/g, '').replace(/\s/g, '')
    if (!correct.includes(String(grad)) || !correct.includes(String(absInt))) {
      return [`${id}: expected tangent grad ${grad}, intercept ${sign}${absInt}, got ${q.options[q.correctIndex]}`]
    }
    return []
  }

  // fencing max area L m for 3 sides
  m = text.match(/\$(\d+)\\text\{ m\}\$ of fencing/i)
  if (m && text.toLowerCase().includes('maximum possible area')) {
    const L = Number(m[1])
    const expected = (L * L) / 8
    const correct = parseNumericOption(q.options[q.correctIndex])
    if (correct !== null && correct !== expected) {
      return [`${id}: expected max area ${expected}, got ${correct}`]
    }
  }

  // |x²-bx+c| exactly 3 intersections
  m = text.match(/\|x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\|/)
  if (m && text.includes('exactly 3')) {
    const b = Number(m[1])
    const c = Number(m[2])
    const h = b / 2
    const k = Math.abs(h * h - b * h + c)
    return checkNumeric(id, q, k)
  }

  // AP sum
  if (text.toLowerCase().includes('arithmetic') && text.includes('Sum of')) {
    m = text.match(/first term (\d+).*difference (\d+).*(\d+) terms/i)
    if (m) {
      const a = Number(m[1])
      const d = Number(m[2])
      const n = Number(m[3])
      const expected = (n / 2) * (2 * a + (n - 1) * d)
      return checkNumeric(id, q, expected)
    }
  }

  // discriminant / factor theorem condition f(-3)=0 for x+3 factor
  if (text.includes('x + 3') && text.includes('factor') && text.includes('f(-3)')) {
    const correct = q.options[q.correctIndex]
    if (!correct.includes('f(-3)')) {
      return [`${id}: expected f(-3) = 0 condition, got ${correct}`]
    }
  }

  return []
}
