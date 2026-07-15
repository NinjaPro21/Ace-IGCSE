import type { McqQuestion, McqQuestionVariant } from '@/lib/contentTypes'

type Variant = McqQuestionVariant

function mk(question: string, options: string[], correctIndex = 0, explanation?: string): Variant {
  return { question, options, correctIndex, explanation }
}

/** (ax² - bx + c)(dx - e), e > 0 → coefficient of x² */
function coeffX2InExpansion(a: number, b: number, d: number, e: number): number {
  return -a * e - b * d
}

function evalCubic(coeffs: readonly number[], x: number): number {
  return coeffs[0] * x ** 3 + coeffs[1] * x ** 2 + coeffs[2] * x + coeffs[3]
}

function formatPolyTerm(coef: number, power: number, leading = false): string {
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

function formatCubicPoly(coeffs: readonly number[]): string {
  let s = formatPolyTerm(coeffs[0], 3, true)
  s += formatPolyTerm(coeffs[1], 2)
  s += formatPolyTerm(coeffs[2], 1)
  s += formatPolyTerm(coeffs[3], 0)
  return s
}

function formatSignedConstant(n: number): string {
  return n >= 0 ? String(n) : `- ${Math.abs(n)}`
}

function factorial(n: number): number {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

function nCr(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r))
}

function nPr(n: number, r: number): number {
  return factorial(n) / factorial(n - r)
}

function rootsPair(r1: number, r2: number): string[] {
  const [a, b] = [r1, r2].sort((x, y) => y - x)
  return [
    `$x = ${a}$ and $x = ${b}$`,
    `$x = ${-a}$ and $x = ${-b}$`,
    `$x = ${a}$ and $x = ${-b}$`,
    `$x = ${-a}$ and $x = ${b}$`,
  ]
}

function tryGenerators(text: string): Variant[] {
  const out: Variant[] = []
  let m: RegExpMatchArray | null

  // f(x) = ax ± b, find f(c)
  m = text.match(/f\(x\)\s*=\s*(\d+)x\s*-\s*(\d+).*?f\((\d+)\)/s)
  if (m) {
    for (const [a, b, c] of [
      [2, 3, 5],
      [4, 7, 3],
      [5, 2, 4],
      [2, 1, 6],
    ] as const) {
      const ans = a * c - b
      out.push(
        mk(
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
    for (const [a, b, c] of [
      [2, 3, 5],
      [3, 1, 4],
      [4, 2, 3],
      [5, 3, 2],
    ] as const) {
      const ans = a * c + b
      out.push(
        mk(
          `A function $f(x)$ is defined by $f(x) = ${a}x + ${b}$. Find the value of $f(${c})$.`,
          [`$${ans}$`, `$${ans - 2 * b}$`, `$${a + b}$`, `$${ans + 1}$`],
          0,
          `$f(${c}) = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // inverse f(a)=b → f^-1(b)
  if (text.includes('inverse') && /f\((\d+)\)\s*=\s*(\d+)/.test(text)) {
    for (const [a, b] of [
      [2, 9],
      [3, 10],
      [4, 11],
      [5, 8],
    ] as const) {
      out.push(
        mk(
          `If $f(${a}) = ${b}$, state the value of $f^{-1}(${b})$.`,
          [`$${a}$`, `$${b}$`, `$\\frac{1}{${b}}$`, `$-${a}$`],
          0,
          `$f^{-1}(${b}) = ${a}$.`,
        ),
      )
    }
    return out
  }

  // range x² + k, x >= 0
  m = text.match(/f\(x\)\s*=\s*x²\s*\+\s*(\d+).*range/s)
  if (m) {
    for (const k of [2, 5, 7, 1]) {
      out.push(
        mk(
          `Given $f(x) = x² + ${k}$ for $x \\ge 0$, state the range of $f$.`,
          [`$f(x) \\ge ${k}$`, `$f(x) \\ge 0$`, `$f(x) \\in \\mathbb{R}$`, `$0 \\le f(x) \\le ${k}$`],
          0,
          `Minimum value is ${k}$, so $f(x) \\ge ${k}$.`,
        ),
      )
    }
    return out
  }

  // composite gf: f(x)=x+a, g(x)=bx
  m = text.match(/f\(x\)\s*=\s*x\s*\+\s*(\d+).*g\(x\)\s*=\s*(\d+)x.*gf\(x\)/s)
  if (m) {
    for (const [a, b] of [
      [3, 2],
      [5, 3],
      [2, 4],
      [6, 2],
    ] as const) {
      out.push(
        mk(
          `Given $f(x) = x + ${a}$ and $g(x) = ${b}x$, find $gf(x)$.`,
          [`$${b}x + ${b * a}$`, `$${b}x + ${a}$`, `$x + ${b * a}$`, `$${b}x² + ${b * a}x$`],
          0,
          `$gf(x) = ${b}(x+${a}) = ${b}x + ${b * a}$.`,
        ),
      )
    }
    return out
  }

  // fg(x) = constant — fg(x) = f(g(x)) = a(x² + c) - b = target → x² = (target + b - ac) / a
  m = text.match(/f\(x\)\s*=\s*(\d+)x\s*-\s*(\d+).*g\(x\)\s*=\s*x²\s*\+\s*(\d+).*fg\(x\)\s*=\s*(\d+)/s)
  if (m) {
    for (const [a, b, c, target] of [
      [3, 1, 2, 32],
      [2, 3, 1, 17],
      [4, 2, 3, 26],
    ] as const) {
      const xSquared = (target + b - a * c) / a
      const r = Math.sqrt(xSquared)
      if (!Number.isInteger(r) || r <= 0) continue
      out.push(
        mk(
          `Given $f(x) = ${a}x - ${b}$ and $g(x) = x² + ${c}$, solve $fg(x) = ${target}$.`,
          [
            `$x = ${r}$ and $x = -${r}$`,
            `$x = ${r + 1}$ and $x = -${r + 1}$`,
            `$x = ${r}$ only`,
            `$x = ${xSquared}$ and $x = -${xSquared}$`,
          ],
          0,
          `$fg(x) = f(g(x)) = ${a}(x² + ${c}) - ${b} = ${target}$, so $x² = ${xSquared}$ and $x = \\pm ${r}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // linear range on domain [d1, d2]
  m = text.match(/g\(x\)\s*=\s*(\d+)\s*-\s*(\d+)x.*-\s*(\d+).*\\le\s*x\s*\\le\s*(\d+)/s)
  if (m && text.includes('range')) {
    for (const [p, q, lo, hi] of [
      [5, 2, -1, 4],
      [7, 3, 0, 5],
      [9, 4, -2, 3],
    ] as const) {
      const rLo = p - q * hi
      const rHi = p - q * lo
      const a = Math.min(rLo, rHi)
      const b = Math.max(rLo, rHi)
      out.push(
        mk(
          `$g(x) = ${p} - ${q}x$ for $${lo} \\le x \\le ${hi}$. Find the range of $g(x)$.`,
          [`$${a} \\le g(x) \\le ${b}$`, `$${b} \\le g(x) \\le ${a}$`, `$g(x) \\ge ${a}$`, `$g(x) \\le ${b}$`],
          0,
          `At $x=${lo}$, $g=${rHi}$; at $x=${hi}$, $g=${rLo}$.`,
        ),
      )
    }
    return out
  }

  // |ax - b| = c
  m = text.match(/\|(\d+)x\s*-\s*(\d+)\|\s*=\s*(\d+)/)
  if (m) {
    for (const [a, b, c] of [
      [2, 3, 5],
      [3, 2, 8],
      [2, 1, 7],
      [4, 3, 9],
    ] as const) {
      const r1 = (b + c) / a
      const r2 = (b - c) / a
      if (!Number.isInteger(r1) || !Number.isInteger(r2)) continue
      out.push(
        mk(
          `Solve $|${a}x - ${b}| = ${c}$.`,
          rootsPair(r1, r2),
          0,
          `$${a}x - ${b} = \\pm ${c}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // |ax + b| ≤ c critical
  m = text.match(/\|(\d+)x\s*\+\s*(\d+)\|.*?(?:\\le|≤)\s*(\d+)/)
  if (m && text.toLowerCase().includes('critical')) {
    for (const [a, b, c] of [
      [2, 3, 7],
      [3, 2, 11],
      [2, 5, 9],
    ] as const) {
      const r1 = (c - b) / a
      const r2 = (-c - b) / a
      if (!Number.isInteger(r1) || !Number.isInteger(r2)) continue
      out.push(
        mk(
          `Critical values for $|${a}x + ${b}| \\le ${c}$.`,
          [`$x = ${r1}$ and $x = ${r2}$`, `$x = ${-r1}$ and $x = ${r1}$`, `$x = ${r2}$ and $x = ${-r2}$`, `$x = ${c}$ and $x = ${-c}$`],
          0,
          `Solve $|${a}x+${b}| = ${c}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // |x| > k
  m = text.match(/\|x\|\s*>\s*(\d+)/)
  if (m && text.includes('linear inequalities')) {
    for (const k of [3, 7, 4, 6]) {
      out.push(
        mk(
          `Express $|x| > ${k}$ without modulus signs.`,
          [`$x > ${k}$ or $x < -${k}$`, `$-${k} < x < ${k}$`, `$x > ${k}$ and $x > -${k}$`, `$x < ${k}$ or $x > -${k}$`],
          0,
          `Outer intervals: $x > ${k}$ or $x < -${k}$.`,
        ),
      )
    }
    return out
  }

  // log_b(x) = n
  m = text.match(/log_(\d+)\(x\)\s*=\s*(\d+)/)
  if (m && !text.includes('+')) {
    const base = Number(m[1])
    for (const n of [2, 3, 4, 5]) {
      const x = base ** n
      out.push(
        mk(
          `Given $\\log_${base}(x) = ${n}$, find $x$.`,
          [`$x = ${x}$`, `$x = ${base * n}$`, `$x = ${x - 1}$`, `$x = ${base + n}$`],
          0,
          `$x = ${base}^{${n}} = ${x}$.`,
        ),
      )
    }
    return out
  }

  // log_b(x+a)=n
  m = text.match(/log_(\d+)\(x\s*\+\s*(\d+)\)\s*=\s*(\d+)/)
  if (m) {
    const base = Number(m[1])
    for (const [a, n] of [
      [3, 2],
      [4, 3],
      [2, 4],
      [5, 2],
    ] as const) {
      const x = base ** n - a
      out.push(
        mk(
          `Solve $\\log_${base}(x + ${a}) = ${n}$.`,
          [`$x = ${x}$`, `$x = ${x - 2}$`, `$x = ${x + 2}$`, `$x = ${base ** n}$`],
          0,
          `$x + ${a} = ${base ** n}$, so $x = ${x}$.`,
        ),
      )
    }
    return out
  }

  // b^(ax-c) = d
  m = text.match(/(\d+)\^\{?(\d+)x\s*-\s*(\d+)\}?\s*=\s*(\d+)/)
  if (m) {
    const base = Number(m[1])
    for (const [a, c, rhs] of [
      [2, 1, base ** 3],
      [2, 3, base ** 4],
    ] as const) {
      const exp = Math.round(Math.log(rhs) / Math.log(base))
      const x = (exp + c) / a
      if (!Number.isInteger(x)) continue
      out.push(
        mk(
          `Solve $${base}^{${a}x - ${c}} = ${rhs}$.`,
          [`$x = ${x}$`, `$x = ${x - 1}$`, `$x = ${x + 1}$`, `$x = ${exp}$`],
          0,
          `${a}x - ${c} = ${exp}$, so $x = ${x}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // arc length s=rθ
  if (text.toLowerCase().includes('arc length')) {
    m = text.match(/radius\s*\$?(\d+).*?(\d+\.?\d*)\s*(?:\\text\{)?\s*radians/s)
    if (m) {
      for (const [r, t] of [
        [6, 2],
        [10, 1.2],
        [5, 2.4],
        [8, 1.5],
      ] as const) {
        const s = r * t
        out.push(
          mk(
            `A sector has radius $${r}\\text{ cm}$ and angle $${t}\\text{ radians}$. Find the arc length.`,
            [`${s}\\text{ cm}`, `${(r / t).toFixed(1)}\\text{ cm}`, `${r * r * t}\\text{ cm}`, `${s + 2}\\text{ cm}`],
            0,
            `$s = r\\theta = ${s}\\text{ cm}$.`,
          ),
        )
      }
      return out
    }
  }

  // degrees → radians
  m = text.match(/(\d+)\^\\circ.*radians/i)
  if (m) {
    for (const deg of [90, 120, 60, 150]) {
      const g = gcd(deg, 180)
      const texAns = deg / g === 180 / g ? '\\pi' : `\\frac{${deg / g}}{${180 / g}}\\pi`
      out.push(
        mk(
          `Convert $${deg}^\\circ$ to radians in terms of $\\pi$.`,
          [texAns, `\\frac{${deg + 30}}{180}\\pi`, `\\frac{${deg - 30}}{180}\\pi`, `\\frac{${deg}}{90}\\pi`],
          0,
          `$${deg} \\cdot \\frac{\\pi}{180} = ${texAns}$.`,
        ),
      )
    }
    return out
  }

  // sector angle from area
  m = text.match(/radius of\s*\$?(\d+).*area of\s*\$?(\d+)/s)
  if (m && text.includes('radians')) {
    for (const [r, A] of [
      [4, 8],
      [8, 16],
      [5, 25],
      [6, 18],
    ] as const) {
      const theta = A / (0.5 * r * r)
      out.push(
        mk(
          `Sector radius $${r}\\text{ cm}$, area $${A}\\text{ cm}^2$. Find the angle in radians.`,
          [String(theta), String(theta / 2), String(theta * 2), String(theta + 1)],
          0,
          `$\\theta = ${theta}$ radians.`,
        ),
      )
    }
    if (out.length) return out
  }

  // sector area A=½r²θ
  m = text.match(/radius\s*\$?(\d+).*central angle of\s*\$?(\d+\.?\d*)\s*(?:\\text\{)?\s*radians/s)
  if (m && text.toLowerCase().includes('area of a sector')) {
    for (const [r, t] of [
      [8, 1.5],
      [6, 2],
      [5, 1.6],
      [10, 0.8],
    ] as const) {
      const A = 0.5 * r * r * t
      out.push(
        mk(
          `Find the area of a sector with radius $${r}\\text{ cm}$ and angle $${t}\\text{ radians}$.`,
          [`${A}\\text{ cm}^2`, `${A * 2}\\text{ cm}^2`, `${r * t}\\text{ cm}^2`, `${A / 2}\\text{ cm}^2`],
          0,
          `$A = ${A}\\text{ cm}^2$.`,
        ),
      )
    }
    return out
  }

  // n!/r!(n-r)!
  m = text.match(/\\frac\{(\d+)!}{(\d+)!.*(\d+)!}/)
  if (m) {
    for (const [n, r] of [
      [8, 3],
      [9, 2],
      [10, 4],
      [7, 3],
    ] as const) {
      const ans = nCr(n, r)
      out.push(
        mk(
          `Evaluate $\\frac{${n}!}{${r}! \\times ${n - r}!}$.`,
          [String(ans), String(ans * 2), String(ans * r), String(Math.max(1, ans / r))],
          0,
          `$= ${ans}$.`,
        ),
      )
    }
    return out
  }

  // nPr
  m = text.match(/\^(\d+)P_\{?(\d+)\}?/)
  if (m) {
    for (const [n, r] of [
      [9, 2],
      [10, 3],
      [7, 2],
      [8, 4],
    ] as const) {
      const ans = nPr(n, r)
      out.push(
        mk(
          `Calculate $^${n}P_{${r}}$.`,
          [String(ans), String(nCr(n, r)), String(factorial(n)), String(ans / n)],
          0,
          `$^${n}P_{${r}} = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // nCr committee
  if (text.toLowerCase().includes('committee')) {
    m = text.match(/(\d+).*from.*(\d+)/)
    if (m) {
      for (const [r, n] of [
        [3, 8],
        [2, 10],
        [4, 10],
        [3, 9],
      ] as const) {
        const ans = nCr(n, r)
        out.push(
          mk(
            `A committee of ${r} from ${n} candidates. How many combinations?`,
            [String(ans), String(nPr(n, r)), String(n * r), String(r * factorial(r))],
            0,
            `$^${n}C_{${r}} = ${ans}$.`,
          ),
        )
      }
      return out
    }
  }

  // n! word arrangements
  m = text.match(/(\d+)\s+letters/)
  if (m && text.toLowerCase().includes('arranged')) {
    for (const n of [5, 7, 4, 6]) {
      const ans = factorial(n)
      out.push(
        mk(
          `Find the number of arrangements of ${n} distinct letters in a line.`,
          [String(ans), String(factorial(n - 1)), String(n * n), String(n)],
          0,
          `$${n}! = ${ans}$.`,
        ),
      )
    }
    return out
  }

  // remainder x - a
  if (text.includes('remainder') && /x - (\d+)/.test(text)) {
    for (const [a, coeffs] of [
      [3, [2, -3, 4, -5]],
      [1, [2, -3, 4, -5]],
      [2, [1, -2, 3, -4]],
      [4, [3, -1, 2, -6]],
    ] as const) {
      const val = evalCubic(coeffs, a)
      out.push(
        mk(
          `Remainder when $P(x) = ${formatCubicPoly(coeffs)}$ is divided by $x - ${a}$.`,
          [String(val), String(-val), String(val + 2), String(val - 2)],
          0,
          `$P(${a}) = ${val}$.`,
        ),
      )
    }
    return out
  }

  // coefficient expansion (ax²-bx+c)(dx-e)
  m = text.match(/coefficient of \$x\^2\$.*\((\d+)x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\)\((\d+)x\s*-\s*(\d+)\)/)
  if (m) {
    for (const [a, b, c, d, e] of [
      [2, 1, 3, 3, 2],
      [1, 2, 1, 2, 3],
      [3, 1, 2, 1, 4],
    ] as const) {
      const coef = coeffX2InExpansion(a, b, d, e)
      out.push(
        mk(
          `Coefficient of $x^2$ in $(${a}x^2 - ${b}x + ${c})(${d}x - ${e})$.`,
          [String(coef), String(coef + 4), String(coef - 4), String(-a * e)],
          0,
          `$${a}x^2 \\cdot (-${e}) + (-${b}x)(${d}x) = ${coef}x^2$.`,
        ),
      )
    }
    return out
  }

  // product of roots cubic
  m = text.match(/(\d+)x\^3\s*-\s*(\d+)x\^2\s*\+\s*(\d+)x\s*-\s*(\d+)\s*=\s*0/)
  if (m && text.toLowerCase().includes('product')) {
    for (const [a, b, c, d] of [
      [3, 4, 2, 6],
      [2, 3, 5, 10],
      [4, 1, 2, 8],
    ] as const) {
      const prod = d / a
      out.push(
        mk(
          `Product of roots of ${a}x^3 - ${b}x^2 + ${c}x - ${d} = 0$.`,
          [String(prod), String(-prod), String(d), String(-d)],
          0,
          `With $d = -${d}$ in standard form, product $= -\\frac{d}{a} = ${prod}$.`,
        ),
      )
    }
    return out
  }

  // equal roots ax² - kx + c
  m = text.match(/(\d+)x²\s*-\s*kx\s*\+\s*(\d+)\s*=\s*0.*equal/s)
  if (m) {
    for (const [a, c] of [
      [2, 8],
      [1, 9],
      [4, 4],
      [2, 18],
    ] as const) {
      const k = Math.sqrt(4 * a * c)
      if (!Number.isInteger(k)) continue
      out.push(
        mk(
          `Find $k > 0$ for which ${a}x² - kx + ${c} = 0$ has equal roots.`,
          [`$${k}$`, `$${k * k}$`, `$${k / 2}$`, `$${k * 2}$`],
          0,
          `$k^2 = ${4 * a * c}$, so $k = ${k}$.`,
        ),
      )
    }
    return out
  }

  // vertex (x-h)² + k
  m = text.match(/\(x\s*-\s*(\d+)\)²\s*\+\s*(\d+)/)
  if (m && text.toLowerCase().includes('turning point')) {
    for (const [h, k] of [
      [2, 5],
      [3, -1],
      [1, 8],
      [5, 0],
    ] as const) {
      out.push(
        mk(
          `Turning point of $y = (x - ${h})² + ${formatSignedConstant(k)}$.`,
          [
            `Minimum at $(${h}, ${k})$`,
            `Minimum at $(-${h}, ${k})$`,
            `Maximum at $(${h}, ${k})$`,
            `Minimum at $(${h}, ${-k})$`,
          ],
          0,
          `Vertex $(${h}, ${k})$, minimum.`,
        ),
      )
    }
    return out
  }

  // critical values quadratic inequality x² + bx + c
  m = text.match(/x²\s*-\s*(\d+)x\s*-\s*(\d+)\s*>\s*0/)
  if (m && text.toLowerCase().includes('critical')) {
    for (const [b, c] of [
      [6, 5],
      [7, 12],
      [3, 10],
    ] as const) {
      const disc = b * b + 4 * c
      const s = Math.sqrt(disc)
      if (!Number.isInteger(s)) continue
      const r1 = (b + s) / 2
      const r2 = (b - s) / 2
      out.push(
        mk(
          `Critical values for $x² - ${b}x - ${c} > 0$.`,
          rootsPair(r1, r2),
          0,
          `Roots of $x² - ${b}x - ${c} = 0$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // y-intercept |ax²+bx+c|
  m = text.match(/\|(\d+)x\^2\s*-\s*(\d+)x\s*-\s*(\d+)\|/)
  if (m && text.toLowerCase().includes('y-intercept')) {
    for (const [a, b, c] of [
      [3, 2, 6],
      [1, 4, 3],
      [2, 7, 1],
    ] as const) {
      const y = Math.abs(-c)
      out.push(
        mk(
          `$y$-intercept of $y = |${a}x^2 - ${b}x - ${c}|$.`,
          [`$(0, ${y})$`, `$(0, -${y})$`, `$(${y}, 0)$`, `$(0, ${b})$`],
          0,
          `$y = |-${c}| = ${y}$.`,
        ),
      )
    }
    return out
  }

  // differentiate ax^n - b/x^m
  m = text.match(/y\s*=\s*(\d+)x\^(\d+)\s*-\s*\\frac\{(\d+)\}\{x\^(\d+)\}/)
  if (m && text.includes('mathrm{d}')) {
    for (const [A, n, B, p] of [
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [5, 2, 3, 2],
    ] as const) {
      const coef = A * n
      const pos = B * p
      out.push(
        mk(
          `$y = ${A}x^${n} - \\frac{${B}}{x^${p}}$. Find $\\frac{dy}{dx}$.`,
          [
            `$${coef}x^${n - 1} + \\frac{${pos}}{x^${p + 1}}$`,
            `$${coef}x^${n - 1} - \\frac{${pos}}{x^${p + 1}}$`,
            `$${coef}x^${n - 1} + \\frac{${pos}}{x^${p}}$`,
            `$${coef}x^${n} - \\frac{${pos}}{x^${p + 1}}$`,
          ],
          0,
          `Differentiate term by term.`,
        ),
      )
    }
    return out
  }

  // gradient (ax-b)^n at x=1
  m = text.match(/y\s*=\s*\((\d+)x\s*-\s*(\d+)\)\^(\d+).*x\s*=\s*1/)
  if (m) {
    for (const [a, b, n] of [
      [2, 1, 3],
      [3, 2, 4],
      [2, 3, 2],
    ] as const) {
      const inner = a - b
      const grad = n * a * inner ** (n - 1)
      out.push(
        mk(
          `Gradient of $y = (${a}x - ${b})^${n}$ at $x = 1$.`,
          [String(grad), String(n * inner ** (n - 1)), String(a * n), String(grad / a)],
          0,
          `$\\frac{dy}{dx}$ at $x=1$ is ${grad}.`,
        ),
      )
    }
    return out
  }

  // stationary ax³ - bx
  m = text.match(/y\s*=\s*(\d+)x\^3\s*-\s*(\d+)x/)
  if (m && text.toLowerCase().includes('stationary')) {
    for (const [a, b] of [
      [1, 9],
      [2, 18],
      [1, 16],
    ] as const) {
      const x = Math.sqrt(b / (3 * a))
      if (!Number.isInteger(x)) continue
      out.push(
        mk(
          `Stationary points of $y = ${a}x^3 - ${b}x$.`,
          [`$x = ${x}$ and $x = -${x}$`, `$x = ${x * 2}$ and $x = -${x * 2}$`, `$x = ${x}$ only`, `$x = 0$ and $x = ${x}$`],
          0,
          `$x = \\pm ${x}$.`,
        ),
      )
    }
    return out
  }

  // tangent at point (px, py)
  m = text.match(/\((\d+),\s*(\d+)\)/)
  if (m && text.toLowerCase().includes('tangent') && text.includes('x^2')) {
    for (const [b, c, px] of [
      [4, 5, 3],
      [6, 8, 5],
      [2, 1, 2],
    ] as const) {
      // The point must lie on the curve, so derive py instead of hardcoding it.
      const py = px * px - b * px + c
      const grad = 2 * px - b
      const intercept = py - grad * px
      const interceptSign = intercept >= 0 ? '+' : '-'
      const absInt = Math.abs(intercept)
      out.push(
        mk(
          `Tangent to $y = x^2 - ${b}x + ${c}$ at $(${px}, ${py})$.`,
          [
            `$y = ${grad}x ${interceptSign} ${absInt}$`,
            `$y = ${grad}x + ${absInt + 2}$`,
            `$y = ${grad * 2}x - ${absInt}$`,
            `$y = -${grad}x + ${py}$`,
          ],
          0,
          `Gradient $m = ${grad}$, so $y = ${grad}x ${interceptSign} ${absInt}$.`,
        ),
      )
    }
    if (out.length) return out
  }

  // chain rule (ax²+b)^n
  m = text.match(/y\s*=\s*\((\d+)x\^2\s*-\s*(\d+)\)\^(\d+)/)
  if (m && text.includes('frac{dy}{dx}')) {
    for (const [a, b, n] of [
      [3, 5, 4],
      [2, 1, 3],
      [4, 2, 2],
    ] as const) {
      out.push(
        mk(
          `$y = (${a}x^2 - ${b})^${n}$. Find $\\frac{dy}{dx}$.`,
          [
            `$${n}(${a}x^2 - ${b})^{${n - 1}} \\cdot ${2 * a}x$`,
            `$${n}(${a}x^2 - ${b})^{${n - 1}}$`,
            `$${2 * a}x(${a}x^2 - ${b})^{${n - 1}}$`,
            `$${n * a}x(${a}x^2 - ${b})^{${n - 2}}$`,
          ],
          0,
          `Use the chain rule.`,
        ),
      )
    }
    return out
  }

  // ln(ax-b)
  m = text.match(/y\s*=\s*\\ln\((\d+)x\s*-\s*(\d+)\)/)
  if (m) {
    for (const [a, b] of [
      [5, 2],
      [3, 1],
      [4, 3],
    ] as const) {
      out.push(
        mk(
          `Differentiate $y = \\ln(${a}x - ${b})$.`,
          [`$\\frac{${a}}{${a}x - ${b}}$`, `$\\frac{1}{${a}x - ${b}}$`, `$\\frac{${a}}{${a}x + ${b}}$`, `$${a}x - ${b}$`],
          0,
          `$\\frac{dy}{dx} = \\frac{${a}}{${a}x - ${b}}$.`,
        ),
      )
    }
    return out
  }

  // e^{ax^n}
  m = text.match(/y\s*=\s*e\^\{(\d+)x\^(\d+)\}/)
  if (m) {
    for (const [a, n] of [
      [4, 3],
      [2, 2],
      [3, 1],
    ] as const) {
      const coef = a * n
      out.push(
        mk(
          `Find $\\frac{dy}{dx}$ when $y = e^{${a}x^${n}}$.`,
          [`$${coef}x^${n - 1}e^{${a}x^${n}}$`, `$${a}x^${n}e^{${a}x^${n}}$`, `$e^{${a}x^${n}}$`, `$${coef}e^{${a}x^{n - 1}}}$`],
          0,
          `Chain rule gives $${coef}x^${n - 1}e^{${a}x^${n}}$.`,
        ),
      )
    }
    return out
  }

  // sin(ax+b)
  m = text.match(/y\s*=\s*\\sin\((\d+)x\s*\+\s*(\d+)\)/)
  if (m) {
    for (const [a, b] of [
      [3, 2],
      [2, 1],
      [4, 3],
    ] as const) {
      out.push(
        mk(
          `Find $\\frac{dy}{dx}$ when $y = \\sin(${a}x + ${b})$.`,
          [`$${a}\\cos(${a}x + ${b})$`, `$\\cos(${a}x + ${b})$`, `$${a}\\sin(${a}x + ${b})$`, `$-${a}\\cos(${a}x + ${b})$`],
          0,
          `$${a}\\cos(${a}x + ${b})$.`,
        ),
      )
    }
    return out
  }

  // fencing max area 3 sides
  m = text.match(/(\d+)\\text\{ m\}\$ of fencing/)
  if (m && text.toLowerCase().includes('maximum possible area')) {
    for (const L of [24, 30, 36, 48]) {
      const max = (L * L) / 8
      out.push(
        mk(
          `Enclosure along a wall with $${L}\\text{ m}$ fencing for three sides. Maximum area?`,
          [`$${max}\\text{ m}^2$`, `$${max / 2}\\text{ m}^2$`, `$${max * 2}\\text{ m}^2$`, `$${L}\\text{ m}^2$`],
          0,
          `Maximum area is $${max}\\text{ m}^2$.`,
        ),
      )
    }
    return out
  }

  // |x²-bx+c| horizontal k for 3 intersections
  m = text.match(/\|x\^2\s*-\s*(\d+)x\s*\+\s*(\d+)\|/)
  if (m && text.includes('exactly 3')) {
    for (const [b, c] of [
      [4, 3],
      [8, 15],
      [6, 8],
    ] as const) {
      const h = b / 2
      const k = Math.abs(h * h - b * h + c)
      out.push(
        mk(
          `$f(x) = |x^2 - ${b}x + ${c}|$. Find $k$ for exactly 3 intersections with $y=k$.`,
          [`$k = ${k}$`, `$k = 0$`, `$k = ${c}$`, `$k = ${k * 2}$`],
          0,
          `Reflected vertex height $k = ${k}$.`,
        ),
      )
    }
    return out
  }

  // distance between points or midpoint — skip complex

  // AP sum Sn
  if (text.includes('arithmetic') && text.includes('sum')) {
    m = text.match(/first term\s*(\d+).*common difference\s*(\d+).*(\d+)\s+terms/i)
    if (m) {
      const a = Number(m[1])
      const d = Number(m[2])
      const n = Number(m[3])
      const sum = (n / 2) * (2 * a + (n - 1) * d)
      out.push(
        mk(
          `Sum of ${n} terms of AP: first term ${a}, difference ${d}.`,
          [String(sum), String(sum + n), String(sum - n), String(a * n)],
          0,
          `$S_n = ${sum}$.`,
        ),
      )
      if (out.length) return out
    }
  }

  return out
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

/** Generate up to 4 numeric variants at quiz time (merged with JSON variants). */
export function generateRuntimeVariants(question: McqQuestion): McqQuestionVariant[] {
  const text = question.question
  const variants = tryGenerators(text)
  // Dedupe against base question
  const seen = new Set<string>([question.question])
  return variants.filter((v) => {
    if (seen.has(v.question)) return false
    seen.add(v.question)
    return true
  }).slice(0, 4)
}
