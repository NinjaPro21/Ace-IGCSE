/** Restore SVG x2=" coordinate attrs corrupted by x2 → x² normalizer. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

const notesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'content', 'notes', 'maths-0580')
let updated = 0

for (const file of fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))) {
  const filePath = path.join(notesDir, file)
  const before = fs.readFileSync(filePath, 'utf8')
  const after = before.replace(/ x²="/g, ' x2="')
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8')
    updated++
    console.log('svg fix:', file)
  }
}

console.log(`Done — ${updated} files updated.`)
