/** Extract sidebar-friendly excerpts from raw topic note markdown. */

export function extractQuickCheck(notes: string): string | undefined {
  const m = notes.match(/^## Quick check\s*\n+([\s\S]*?)(?=\n## |$)/im)
  const body = m?.[1]?.trim()
  return body || undefined
}

export function extractKeyFormula(notes: string): string | undefined {
  const m = notes.match(/^## Key formulas\s*\n+([\s\S]*?)(?=\n## |$)/im)
  if (!m) return undefined
  const block = m[1]
  const math = block.match(/\$\$([\s\S]*?)\$\$/)?.[1]?.trim()
  return math || undefined
}
