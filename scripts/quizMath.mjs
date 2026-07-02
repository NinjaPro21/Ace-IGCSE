/** Shared quiz math helpers for generators and validation. */

export function coeffX2InExpansion(a, b, d, e) {
  // (ax² - bx + c)(dx - e), e > 0 → x² coefficient is -ae - bd
  return -a * e - b * d
}

export function evalCubic(coeffs, x) {
  const [a3, a2, a1, a0] = coeffs
  return a3 * x ** 3 + a2 * x ** 2 + a1 * x + a0
}

export function productOfCubicRootsMinusForm(a, d) {
  // ax³ - bx² + cx - d = 0 → product of roots = d/a
  return d / a
}

export function substitutionQuadraticCoeff(mx, b, r) {
  const a = 1 + mx * mx
  const mid = 2 * mx * b
  const c = b * b - r
  return { a, b: mid, c }
}

export function parseQuadraticOption(opt) {
  const t = String(opt).replace(/\$/g, '').replace(/²/g, '^2').trim()
  const m = t.match(/^(-?\d*)x\^2\s*([+-])\s*(\d*)x\s*([+-])\s*(\d+)\s*=\s*0$/)
  if (!m) return null
  const a = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : Number(m[1])
  const bx = m[3] === '' ? 1 : Number(m[3])
  const b = m[2] === '-' ? -bx : bx
  const cx = Number(m[5])
  const c = m[4] === '-' ? -cx : cx
  return { a, b, c }
}

export function formatPolyTerm(coef, power, leading = false) {
  if (coef === 0) return ''
  const abs = Math.abs(coef)
  const varPart = power === 0 ? '' : power === 1 ? 'x' : `x^${power}`
  const numPart = abs === 1 && power > 0 ? '' : String(abs)
  if (leading) {
    return coef < 0 ? `-${numPart}${varPart}` : `${numPart}${varPart}`
  }
  const sign = coef >= 0 ? ' + ' : ' - '
  return `${sign}${numPart}${varPart}`
}

export function formatCubicPoly(coeffs) {
  let s = formatPolyTerm(coeffs[0], 3, true)
  s += formatPolyTerm(coeffs[1], 2)
  s += formatPolyTerm(coeffs[2], 1)
  s += formatPolyTerm(coeffs[3], 0)
  return s
}

export function parseNumericOption(opt) {
  const t = String(opt).replace(/\$/g, '').trim()
  const varEq = t.match(/^(?:x|k|m|n)\s*=\s*(-?\d+(?:\.\d+)?)$/i)
  if (varEq) return Number(varEq[1])
  const m = t.match(/^-?\d+(?:\.\d+)?$/)
  return m ? Number(m[0]) : null
}

export function factorial(n) {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

export function nCr(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r))
}

export function nPr(n, r) {
  return factorial(n) / factorial(n - r)
}

export function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}
