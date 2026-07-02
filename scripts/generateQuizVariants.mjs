/**
 * Add numeric variants to Add Maths 0606 quiz questions so retries use different numbers.
 * Run: node scripts/generateQuizVariants.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { evalCubic, formatCubicPoly } from './quizMath.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUIZ_DIR = path.join(__dirname, '..', 'content', 'quizzes', 'add-maths-0606')
const TARGET = 4

const stats = { files: 0, updated: 0, skipped: 0, questions: 0, variantsAdded: 0 }

function pick(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(i, 1)[0])
  }
  return out
}

function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

function frac(n, d) {
  const g = gcd(n, d)
  n /= g
  d /= g
  if (d === 1) return String(n)
  if (d < 0) return `-${frac(-n, -d)}`
  return `\\frac{${n}}{${d}}`
}

function tex(n) {
  if (typeof n === 'string') return n
  return String(n)
}

function rootsPair(r1, r2) {
  const a = [r1, r2].sort((x, y) => y - x)
  return [`$x = ${a[0]}$ and $x = ${a[1]}$`, `$x = ${-a[0]}$ and $x = ${-a[1]}$`, `$x = ${a[0]}$ and $x = ${-a[1]}$`, `$x = ${-a[0]}$ and $x = ${a[1]}$`]
}

function mkVariant(question, options, correctIndex, explanation) {
  return { question, options, correctIndex, explanation }
}

/** Try pattern matchers; return array of variants (not including base). */
function generateVariants(q) {
  const text = q.question
  const out = []

  // f(x) = ax + b, find f(c)
  let m = text.match(/f\(x\)\s*=\s*(\d+)x\s*-\s*(\d+).*?f\((\d+)\)/s)
  if (m) {
    const sets = [[2, 3, 5], [4, 7, 3], [5, 2, 4], [2, 1, 6], [3, 4, 2]]
    for (const [a, b, c] of sets) {
      const ans = a * c - b
      out.push(
        mkVariant(
          `A function $f(x)$ is defined by $f(x) = ${a}x - ${b}$ for the domain $x \\in \\mathbb{R}$. Find the value of $f(${c})$.`,
          [`$${ans}$`, `$${-ans}$`, `$${a * c + b}$`, `$${ans - 2}$`],
          0,
          `$f(${c}) = ${a}(${c}) - ${b} = ${ans}$.`,
        ),
      )
    }
    return out
  }

  m = text.match(/f\(x\)\s*=\s*(\d+)x\s*\+\s*(\d+).*?f\((\d+)\)/s)
  if (m) {
    const sets = [[2, 3, 5], [3, 1, 4], [4, 2, 3], [5, 3, 2]]
    for (const [a, b, c] of sets) {
      const ans = a * c + b
      out.push(
        mkVariant(
          `A function $f(x)$ is defined by $f(x) = ${a}x + ${b}$ for the domain $x \\in \\mathbb{R}$. Find the value of $f(${c})$.`,
          [`$${ans}$`, `$${ans - 2 * b}$`, `$${a + b}$`, `$${ans + 1}$`],
          0,
          `$f(${c}) = ${a}(${c}) + ${b} = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // inverse: f(a)=b, f^-1(b)
  m = text.match(/f\((\d+)\)\s*=\s*(\d+).*?f[⁻¹\\^\-1]*\((\d+)\)/s)
  if (m && text.includes('inverse')) {
    for (const [a, b, c] of [[2, 9, 9], [3, 10, 10], [4, 11, 11], [5, 8, 8], [2, 7, 7]]) {
      if (b === c)
        out.push(
          mkVariant(
            `The function $f(x) = 2x + 1$ has an inverse function $f⁻¹(x)$. If $f(${a}) = ${b}$, state the value of $f⁻¹(${b})$.`,
            [`$${a}$`, `$${b}$`, `$\\frac{1}{${b}}$`, `$-${a}$`],
            0,
            `Since $f(${a}) = ${b}$, $f⁻¹(${b}) = ${a}$.`,
          ),
        )
    }
    return out
  }

  // range x² + k, x >= 0
  m = text.match(/f\(x\)\s*=\s*x²\s*\+\s*(\d+).*range/s)
  if (m) {
    for (const k of [2, 5, 7, 1, 9]) {
      out.push(
        mkVariant(
          `Given the function $f(x) = x² + ${k}$ for the domain $x \\ge 0$, state the range of $f$.`,
          [`$f(x) \\ge ${k}$`, `$f(x) \\ge 0$`, `$f(x) \\in \\mathbb{R}$`, `$0 \\le f(x) \\le ${k}$`],
          0,
          `Minimum of $x²$ on $x \\ge 0$ is $0$, so range is $f(x) \\ge ${k}$.`,
        ),
      )
    }
    return out
  }

  // composite gf: f(x)=x+a, g(x)=bx
  m = text.match(/f\(x\)\s*=\s*x\s*\+\s*(\d+).*g\(x\)\s*=\s*(\d+)x.*gf\(x\)/s)
  if (m) {
    for (const [a, b] of [[3, 2], [5, 3], [2, 4], [6, 2], [4, 5]]) {
      const ans = `${b}x + ${b * a}`
      out.push(
        mkVariant(
          `Given the functions $f(x) = x + ${a}$ and $g(x) = ${b}x$, find the expression for the composite function $gf(x)$.`,
          [`$${ans}$`, `$${b}x + ${a}$`, `$x + ${b * a}$`, `$${b}x² + ${b * a}x$`],
          0,
          `$gf(x) = g(x+${a}) = ${b}(x+${a}) = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // |ax - b| = c
  m = text.match(/\|(\d+)x\s*-\s*(\d+)\|\s*=\s*(\d+)/)
  if (m && text.toLowerCase().includes('modulus')) {
    for (const [a, b, c] of [[2, 3, 5], [3, 2, 8], [2, 1, 7], [4, 3, 9], [3, 4, 11]]) {
      const r1 = (b + c) / a
      const r2 = (b - c) / a
      if (!Number.isInteger(r1) || !Number.isInteger(r2)) continue
      const opts = rootsPair(r1, r2)
      out.push(
        mkVariant(
          `Determine the values of $x$ that satisfy the modulus equation $|${a}x - ${b}| = ${c}$.`,
          opts,
          0,
          `$${a}x - ${b} = ${c}$ gives $x = ${r1}$; $${a}x - ${b} = -${c}$ gives $x = ${r2}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // |ax + b| <= c critical values
  m = text.match(/\|(\d+)x\s*\+\s*(\d+)\|.*?(?:\\le|≤|<=|=)\s*(\d+)/)
  if (m && text.toLowerCase().includes('critical')) {
    for (const [a, b, c] of [[2, 3, 7], [3, 2, 11], [2, 5, 9], [4, 1, 13]]) {
      const r1 = (c - b) / a
      const r2 = (-c - b) / a
      if (!Number.isInteger(r1) || !Number.isInteger(r2)) continue
      const f2 = frac(-c - b, a)
      const f1 = String(r1)
      out.push(
        mkVariant(
          `Identify the critical values used to solve the modulus inequality $|${a}x + ${b}| \\le ${c}$.`,
          [
            `$x = ${f1}$ and $x = ${f2}$`,
            `$x = ${f1}$ and $x = -${f1}$`,
            `$x = -${f1}$ and $x = ${frac(c - b, a)}$`,
            `$x = ${c - b}$ and $x = -${c + b}$`,
          ],
          0,
          `Boundary: $${a}x+${b} = ${c}$ and $${a}x+${b} = -${c}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // |x| > k rewrite
  m = text.match(/\|x\|\s*>\s*(\d+)/)
  if (m && text.includes('linear inequalities')) {
    for (const k of [3, 7, 4, 6, 8]) {
      out.push(
        mkVariant(
          `Express the inequality $|x| > ${k}$ as a pair of separate linear inequalities without modulus signs.`,
          [`$x > ${k}$ or $x < -${k}$`, `$-${k} < x < ${k}$`, `$x > ${k}$ and $x > -${k}$`, `$x < ${k}$ or $x > -${k}$`],
          0,
          `$|x| > ${k}$ means $x > ${k}$ or $x < -${k}$.`,
        ),
      )
    }
    return out
  }

  // log_b(x) = n
  m = text.match(/log_(\d+)\(x\)\s*=\s*(\d+)/)
  if (m && !text.includes('+')) {
    const base = +m[1]
    for (const n of [2, 3, 5, 4, 2]) {
      const x = base ** n
      out.push(
        mkVariant(
          `Given that $\\log_${base}(x) = ${n}$ , what is the value of $x$ ?`,
          [` $x = ${x}$ `, ` $x = ${base * n}$ `, ` $x = ${x - 1}$ `, ` $x = ${base + n}$ `],
          0,
          `$x = ${base}^{${n}} = ${x}$.`,
        ),
      )
    }
    return out
  }

  // log_b(x + a) = n
  m = text.match(/log_(\d+)\(x\s*\+\s*(\d+)\)\s*=\s*(\d+)/)
  if (m) {
    const base = +m[1]
    for (const [a, n] of [[3, 2], [4, 3], [2, 4], [5, 2], [6, 3]]) {
      const x = base ** n - a
      out.push(
        mkVariant(
          `Solve the linear logarithmic equation $\\log_${base}(x + ${a}) = ${n}$ .`,
          [` $x = ${x}$ `, ` $x = ${x - 2}$ `, ` $x = ${x + 2}$ `, ` $x = ${base ** n}$ `],
          0,
          `$x + ${a} = ${base}^{${n}} = ${base ** n}$, so $x = ${x}$.`,
        ),
      )
    }
    return out
  }

  // b^(ax - c) = d (same base)
  m = text.match(/(\d+)\^\{?(\d+)x\s*-\s*(\d+)\}?\s*=\s*(\d+)/)
  if (m) {
    const base = +m[1]
    for (const [a, c, rhs] of [
      [2, 1, base ** 3],
      [2, 3, base ** 4],
      [3, 1, base ** 2],
    ]) {
      if (rhs !== base ** Math.round(Math.log(rhs) / Math.log(base))) continue
      const exp = Math.round(Math.log(rhs) / Math.log(base))
      const x = (exp + c) / a
      if (!Number.isInteger(x)) continue
      out.push(
        mkVariant(
          `Solve the equation $${base}^{${a}x - ${c}} = ${rhs}$ .`,
          [` $x = ${x}$ `, ` $x = ${x - 1}$ `, ` $x = ${x + 1}$ `, ` $x = ${exp}$ `],
          0,
          `$${base}^{${a}x - ${c}} = ${base}^{${exp}} \\implies ${a}x - ${c} = ${exp}$, so $x = ${x}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // arc length s = rθ
  m = text.match(/radius\s*\$?(\d+).*?(\d+\.?\d*)\s*(?:\\text\{)?\s*radians/s)
  if (m && text.toLowerCase().includes('arc length')) {
    for (const [r, t] of [[6, 2], [10, 1.2], [5, 2.4], [12, 0.75], [4, 3]]) {
      const s = r * t
      const wrong1 = (r / t).toFixed(2).replace(/\.00$/, '')
      out.push(
        mkVariant(
          `A sector of a circle of radius $${r}\\text{ cm}$ has an angle of $${t}\\text{ radians}$ at the centre. Find the arc length of the sector.`,
          [`${s}\\text{ cm}`, `${wrong1}\\text{ cm}`, `${r * r * t}\\text{ cm}`, `${s + 2}\\text{ cm}`],
          0,
          `$s = r\\theta = ${r} \\times ${t} = ${s}\\text{ cm}$.`,
        ),
      )
    }
    return out
  }

  // degrees to radians
  m = text.match(/(\d+)\^\\circ.*radians/)
  if (m) {
    for (const deg of [90, 120, 60, 150, 45]) {
      const rad = (deg * Math.PI) / 180
      const n = deg / 180
      const texAns = frac(deg, 180) === '1' ? '\\pi' : `${frac(deg, 180)}\\pi`
      const opts = [
        texAns.replace('\\\\', '\\'),
        frac(deg + 30, 180) === '1' ? '\\pi' : `${frac(deg + 30, 180)}\\pi`,
        frac(deg - 30, 180) === '1' ? '\\pi' : `${frac(deg - 30, 180)}\\pi`,
        frac(deg, 90) === '1' ? '\\pi' : `${frac(deg, 90)}\\pi`,
      ]
      out.push(
        mkVariant(
          `Convert an angle of $${deg}^\\circ$ strictly into radians, expressing your answer in terms of $\\pi$.`,
          opts,
          0,
          `$${deg} \\times \\frac{\\pi}{180} = ${texAns}$.`,
        ),
      )
    }
    return out
  }

  // sector area A = 0.5 r² θ from area given
  m = text.match(/radius of\s*\$?(\d+).*area of\s*\$?(\d+)/s)
  if (m && text.toLowerCase().includes('angle') && text.includes('radians')) {
    for (const [r, A] of [[4, 8], [8, 16], [5, 25], [6, 18], [10, 40]]) {
      const theta = A / (0.5 * r * r)
      if (!Number.isInteger(theta) && theta % 0.5 !== 0) continue
      out.push(
        mkVariant(
          `A sector of a circle has a radius of $${r}\\text{ cm}$ and an area of $${A}\\text{ cm}^2$. Find the angle of the sector in radians.`,
          [String(theta), String(theta / 2), String(theta * 2), String(theta + 1)],
          0,
          `$${A} = \\frac{1}{2}(${r})^2\\theta \\implies \\theta = ${theta}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // sector area find A
  m = text.match(/radius\s*\$?(\d+).*central angle of\s*\$?(\d+\.?\d*)\s*(?:\\text\{)?\s*radians/s)
  if (m && text.toLowerCase().includes('area of a sector')) {
    for (const [r, t] of [[8, 1.5], [6, 2], [5, 1.6], [12, 0.5], [4, 2.5]]) {
      const A = 0.5 * r * r * t
      out.push(
        mkVariant(
          `Find the area of a sector of a circle with radius $${r}\\text{ cm}$ and a central angle of $${t}\\text{ radians}$.`,
          [`${A}\\text{ cm}^2`, `${A * 2}\\text{ cm}^2`, `${r * t}\\text{ cm}^2`, `${A / 2}\\text{ cm}^2`],
          0,
          `$A = \\frac{1}{2}r^2\\theta = 0.5 \\times ${r}^2 \\times ${t} = ${A}\\text{ cm}^2$.`,
        ),
      )
    }
    return out
  }

  // n!/r!(n-r)!
  m = text.match(/\\frac\{(\d+)!}{(\d+)!.*(\d+)!}/)
  if (m) {
    for (const [n, r] of [[8, 3], [9, 2], [10, 4], [7, 3], [6, 2]]) {
      const ans = factorial(n) / (factorial(r) * factorial(n - r))
      out.push(
        mkVariant(
          `Evaluate the exact value of the expression $\\frac{${n}!}{${r}! \\times ${n - r}!}$ .`,
          [String(ans), String(ans * 2), String(ans * r), String(ans / r)],
          0,
          `$\\frac{${n}!}{${r}!(${n - r})!} = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // nPr
  m = text.match(/\^(\d+)P_\{?(\d+)\}?/)
  if (m) {
    for (const [n, r] of [[9, 2], [10, 3], [7, 2], [8, 4], [6, 2]]) {
      const ans = factorial(n) / factorial(n - r)
      out.push(
        mkVariant(
          `Calculate the value of $^${n}P_{${r}}$ , representing the number of ways to permute ${r} items selected from a distinct set of ${n} items.`,
          [String(ans), String(ans / factorial(r)), String(factorial(n)), String(ans / n)],
          0,
          `$^${n}P_{${r}} = ${n} \\times ${n - 1} \\cdots = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // nCr committee
  m = text.match(/(\d+).*selected from.*(\d+)/)
  if (m && text.toLowerCase().includes('committee')) {
    for (const [r, n] of [[3, 8], [2, 10], [4, 10], [3, 9], [2, 7]]) {
      const ans = factorial(n) / (factorial(r) * factorial(n - r))
      out.push(
        mkVariant(
          `A committee of ${r} members is to be selected from a group of ${n} eligible candidates. Find the number of different combinations possible.`,
          [String(ans), String(factorial(n) / factorial(n - r)), String(n * r), String(r * factorial(r))],
          0,
          `$^${n}C_{${r}} = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // Remainder theorem x - a
  m = text.match(/divided by \$x - (\d+)\$/)
  if (m && text.includes('Remainder')) {
    for (const [a, coeffs] of [
      [3, [2, -3, 4, -5]],
      [1, [2, -3, 4, -5]],
      [2, [1, -2, 3, -4]],
      [4, [3, -1, 2, -6]],
    ]) {
      const val = evalCubic(coeffs, a)
      const poly = formatCubicPoly(coeffs)
      out.push(
        mkVariant(
          `Find the remainder when the polynomial $P(x) = ${poly}$ is divided by $x - ${a}$.`,
          [String(val), String(-val), String(val + 2), String(val - 2)],
          0,
          `By the Remainder Theorem, $P(${a}) = ${val}$.`,
        ),
      )
    }
    return out
  }

  // product of roots cubic ax³+bx²+cx+d
  m = text.match(/(\d+)x\^3\s*-\s*(\d+)x\^2\s*\+\s*(\d+)x\s*-\s*(\d+)\s*=\s*0/)
  if (m && text.toLowerCase().includes('product')) {
    for (const [a, b, c, d] of [
      [3, 4, 2, 6],
      [2, 3, 5, 10],
      [4, 1, 2, 8],
      [1, 5, 2, 3],
    ]) {
      const prod = d / a
      out.push(
        mkVariant(
          `State the product of the roots of the cubic equation ${a}x^3 - ${b}x^2 + ${c}x - ${d} = 0$.`,
          [String(prod), String(-prod), String(d), String(-d)],
          0,
          `With $d = -${d}$ in standard form, product $= -\\frac{d}{a} = ${prod}$.`,
        ),
      )
    }
    return out
  }

  // equal roots k: ax² - kx + c = 0
  m = text.match(/(\d+)x²\s*-\s*kx\s*\+\s*(\d+)\s*=\s*0.*equal/)
  if (m) {
    for (const [a, c] of [[2, 8], [1, 9], [4, 1], [2, 18], [1, 25]]) {
      const k = Math.sqrt(4 * a * c)
      if (!Number.isInteger(k)) continue
      out.push(
        mkVariant(
          `Find the value of the constant $k$ for which the quadratic equation ${a}x² - kx + ${c} = 0$ has two equal real roots, given that $k > 0$.`,
          [`$${k}$`, `$${k * k}$`, `$${k / 2}$`, `$${k * 2}$`],
          0,
          `$k^2 = 4(${a})(${c}) = ${k * k}$, so $k = ${k}$.`,
        ),
      )
    }
    return out
  }

  // turning point (x-h)² + k
  m = text.match(/y\s*=\s*\(x\s*-\s*(\d+)\)²\s*\+\s*(\d+)/)
  if (m && text.toLowerCase().includes('turning point')) {
    for (const [h, k] of [[2, 5], [3, -1], [1, 8], [5, 0], [-2, 4]]) {
      const hs = h < 0 ? `+ ${-h}` : `- ${h}`
      const sign = h < 0 ? `$(-${-h}, ${k})$` : `$(${h}, ${k})$`
      out.push(
        mkVariant(
          `State the coordinates of the turning point for the graph of $y = (x ${hs})² + ${k}$ and specify whether it is a maximum or a minimum point.`,
          [
            `Minimum at ${sign}`,
            `Minimum at $(${-h}, ${k})$`,
            `Maximum at ${sign}`,
            `Minimum at $(${h}, ${-k})$`,
          ],
          0,
          `Vertex form gives ${sign}, a minimum since $a > 0$.`,
        ),
      )
    }
    return out
  }

  // y-intercept |quadratic|
  m = text.match(/y\s*=\s*\|(\d+)x\^2\s*-\s*(\d+)x\s*-\s*(\d+)\|/)
  if (m && text.toLowerCase().includes('y-intercept')) {
    for (const [a, b, c] of [[3, 2, 6], [1, 4, 3], [2, 7, 1], [4, 3, 5]]) {
      const y = Math.abs(-c)
      out.push(
        mkVariant(
          `Find the $y$-intercept of the graph of $y = |${a}x^2 - ${b}x - ${c}|$.`,
          [`$(0, ${y})$`, `$(0, -${y})$`, `$(${y}, 0)$`, `$(0, ${b})$`],
          0,
          `At $x=0$, $y = |-${c}| = ${y}$.`,
        ),
      )
    }
    return out
  }

  // |x² - a| = b at y-intercept transform
  m = text.match(/y\s*=\s*x²\s*-\s*(\d+).*transformed into.*\|x²\s*-\s*\1\|/)
  if (m) {
    for (const a of [9, 16, 1, 25, 4]) {
      out.push(
        mkVariant(
          `The graph of $y = x² - ${a}$ is transformed into $y = |x² - ${a}|$. Find the $y$-intercept of the transformed graph.`,
          [`$(0, ${a})$`, `$(0, -${a})$`, `$(\\sqrt{${a}}, 0)$`, `$(0, ${a + 1})$`],
          0,
          `At $x=0$, $y = |-${a}| = ${a}$.`,
        ),
      )
    }
    return out
  }

  // differentiate y = Ax^n - B/x^m
  m = text.match(/y\s*=\s*(\d+)x\^(\d+)\s*-\s*\\frac\{(\d+)\}\{x\^(\d+)\}/)
  if (m && text.includes('mathrm{d}')) {
    for (const [A, n, B, m2] of [
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [5, 2, 3, 2],
    ]) {
      const coef = A * n
      const pos = B * m2
      out.push(
        mkVariant(
          `Given that $y = ${A}x^${n} - \\frac{${B}}{x^${m2}}$, find $\\frac{\\mathrm{d}y}{\\mathrm{d}x}$.`,
          [
            `$${coef}x^${n - 1} + \\frac{${pos}}{x^${m2 + 1}}$`,
            `$${coef}x^${n - 1} - \\frac{${pos}}{x^${m2 + 1}}$`,
            `$${coef}x^${n - 1} + \\frac{${pos}}{x^${m2}}$`,
            `$${coef}x^${n} - \\frac{${pos}}{x^${m2 + 1}}$`,
          ],
          0,
          `Differentiate: $${coef}x^${n - 1} + ${pos}x^{-${m2 + 1}}$.`,
        ),
      )
    }
    return out
  }

  // gradient at x=1 for (ax-b)^n
  m = text.match(/y\s*=\s*\((\d+)x\s*-\s*(\d+)\)\^(\d+).*x\s*=\s*1/)
  if (m) {
    for (const [a, b, n] of [[2, 1, 3], [3, 2, 4], [2, 3, 2], [4, 1, 3]]) {
      const inner = a * 1 - b
      const grad = n * a * inner ** (n - 1)
      out.push(
        mkVariant(
          `Find the gradient of the curve $y = (${a}x - ${b})^${n}$ at the point where $x = 1$.`,
          [String(grad), String(n * inner ** (n - 1)), String(a * n), String(grad / a)],
          0,
          `$\\frac{dy}{dx} = ${n}(${a}x-${b})^{${n - 1}} \\cdot ${a}$. At $x=1$: ${grad}$.`,
        ),
      )
    }
    return out
  }

  // stationary points ax³ - bx
  m = text.match(/y\s*=\s*(\d+)x\^3\s*-\s*(\d+)x/)
  if (m && text.toLowerCase().includes('stationary')) {
    for (const [a, b] of [[1, 9], [2, 18], [1, 16], [3, 12]]) {
      const x = Math.sqrt(b / (3 * a))
      if (!Number.isInteger(x)) continue
      out.push(
        mkVariant(
          `A curve has the equation $y = ${a}x^3 - ${b}x$. Find the $x$-coordinates of the stationary points.`,
          [`$x = ${x}$ and $x = -${x}$`, `$x = ${x * 2}$ and $x = -${x * 2}$`, `$x = ${x}$ only`, `$x = 0$ and $x = ${x}$`],
          0,
          `$${3 * a}x^2 = ${b} \\implies x = \\pm ${x}$.`,
        ),
      )
    }
    return out
  }

  // fencing max area 3 sides, total L
  m = text.match(/using\s*\$(\d+)\\text\{ m\}\$ of fencing/)
  if (m && text.toLowerCase().includes('maximum possible area')) {
    for (const L of [24, 30, 36, 48, 20]) {
      const max = L * L / 8
      out.push(
        mkVariant(
          `A rectangular enclosure is built along a straight stone wall using $${L}\\text{ m}$ of fencing for the remaining three sides. Find the maximum possible area of the enclosure.`,
          [
            `$${max}\\text{ m}²$`,
            `$${max / 2}\\text{ m}²$`,
            `$${max * 2}\\text{ m}²$`,
            `$${L}\\text{ m}²$`,
          ],
          0,
          `$A = x(${L} - 2x) = -2(x - ${L / 4})^2 + ${max}$.`,
        ),
      )
    }
    return out
  }

  // horizontal line k for |x² - bx + c| exactly 3 intersections
  m = text.match(/f\(x\)\s*=\s*\|x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\|/)
  if (m && text.includes('exactly 3')) {
    for (const [b, c] of [[4, 3], [8, 15], [10, 21], [6, 8]]) {
      const h = b / 2
      const k = Math.abs(h * h - b * h + c)
      out.push(
        mkVariant(
          `The function $f(x) = |x^2 - ${b}x + ${c}|$ is plotted. A horizontal line $y = k$ intersects the curve at exactly 3 distinct points. Find the value of the constant $k$.`,
          [`$k = ${k}$`, `$k = 0$`, `$k = ${c}$`, `$k = ${k * 2}$`],
          0,
          `Vertex of quadratic at $x=${h}$ gives minimum $-${k}$; reflected maximum $k=${k}$.`,
        ),
      )
    }
    return out
  }

  return out
}

function factorial(n) {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const quiz = JSON.parse(raw)
  let fileChanged = false

  for (const q of quiz.questions) {
    stats.questions++
    const existing = q.variants?.length ?? 0
    if (existing >= TARGET) continue

    const generated = generateVariants(q)
    if (!generated.length) {
      stats.skipped++
      continue
    }

    const needed = TARGET - existing
    const newVariants = generated.slice(0, needed)
    q.variants = [...(q.variants ?? []), ...newVariants]
    stats.variantsAdded += newVariants.length
    fileChanged = true
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2) + '\n', 'utf8')
    stats.updated++
  }
  stats.files++
}

function main() {
  const files = fs.readdirSync(QUIZ_DIR).filter((f) => f.endsWith('.json')).sort()
  for (const f of files) {
    processFile(path.join(QUIZ_DIR, f))
  }
  console.log(JSON.stringify(stats, null, 2))
}

main()
