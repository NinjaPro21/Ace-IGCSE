import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const f = path.join(__dirname, 'maths-diagram-snippets.mjs')
const lines = fs.readFileSync(f, 'utf8').split('\n')
const head = lines.slice(0, 15).join('\n')
let body = lines.slice(15).join('\n')

const map = [
  ['#dbeafe', '${C.eqFill}'],
  ['#bfdbfe', '${C.eqFill}'],
  ['#93c5fd', '${C.eqFill}'],
  ['#fef3c7', '${C.eqFillAlt}'],
  ['#bbf7d0', '${C.eqFillAlt}'],
  ['#fecaca', '${C.eqFillAlt}'],
  ['#f8fafc', '${C.eqFillAlt}'],
  ['#1e3a8a', '${C.text}'],
  ['#92400e', '${C.text}'],
  ['#2563eb', '${C.line}'],
  ['#d97706', '${C.eqStroke}'],
  ['#16a34a', '${C.lineAlt}'],
  ['#dc2626', '${C.accent}'],
  ['#64748b', '${C.axis}'],
  ['#475569', '${C.label}'],
  ['#94a3b8', '${C.grid}'],
  ['#78716c', '${C.label}'],
  ['#44403c', '${C.text}'],
  ['#f8f4ea', '${C.eqFill}'],
  ['#c4b8a8', '${C.eqStroke}'],
  ['#f0ebe0', '${C.eqFillAlt}'],
  ['#334155', '${C.text}'],
  ['#f59e0b', '${C.eqStroke}'],
  ['#7c3aed', '${C.line}'],
  ['#cbd5e1', '${C.grid}'],
]

for (const [from, to] of map) body = body.split(from).join(to)
fs.writeFileSync(f, `${head}\n${body}`)
console.log('Recolored diagram snippets')
