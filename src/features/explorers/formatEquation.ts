/** Format ax + b without redundant signs or coefficients (e.g. 1x + 0). */
export function formatLinearCombination(a: number, b: number, variable = 'x'): string {
  const parts: string[] = []

  if (a !== 0) {
    if (a === 1) parts.push(variable)
    else if (a === -1) parts.push(`−${variable}`)
    else parts.push(`${a}${variable}`)
  }

  if (b !== 0) {
    const sign = b > 0 ? ' + ' : ' − '
    parts.push(`${sign}${Math.abs(b)}`)
  }

  return parts.length ? parts.join('') : '0'
}

export function formatLinearEquation(c: number, d: number): string {
  return `y = ${formatLinearCombination(c, d)}`
}

export function formatModulusEquation(a: number, b: number): string {
  const inner = formatLinearCombination(a, b)
  return `y = |${inner}|`
}

export function formatModulusVsLine(a: number, b: number, c: number, d: number): string {
  return `Compare ${formatModulusEquation(a, b)} with ${formatLinearEquation(c, d)}.`
}
