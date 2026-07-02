import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
function paras() {
  const tmpDir = path.join(root, '.tmp-docx', 'physicsnotes_docx')
  const xml = fs.readFileSync(path.join(tmpDir, 'extracted', 'word', 'document.xml'), 'utf8')
  return xml.split(/<w:p[ >]/).slice(1).map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('').trim()).filter(Boolean)
}
const p = paras()
;[642, 688, 858, 900, 1787].forEach((i) => console.log('---', i + 1, '---') || p.slice(i - 1, i + 8).forEach((l, j) => console.log(i + j, l.slice(0, 100))))
