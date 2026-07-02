/**
 * Fix common docx superscript corruption in maths-0580 notes.
 * Run: node scripts/fix-maths-note-typos.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.join(__dirname, '..', 'content', 'notes', 'maths-0580')

function fixTypoCorruptions(text) {
  let s = text

  // Exam year / paper references
  s = s.replace(/202²/g, '2022')
  s = s.replace(/Paper 4²/g, 'Paper 42')
  s = s.replace(/Paper 2²/g, 'Paper 22')
  s = s.replace(/Paper 1²/g, 'Paper 12')
  s = s.replace(/P4²/g, 'P42')
  s = s.replace(/P2²/g, 'P22')
  s = s.replace(/P1²/g, 'P12')

  // Arithmetic corruptions where 12 became 1² (avoid x², n², etc.)
  s = s.replace(/=1²(?![\da-z])/g, '=12')
  s = s.replace(/−1²(?![\da-z])/g, '−12')
  s = s.replace(/\+1²(?![\da-z])/g, '+12')
  s = s.replace(/\(1²(?![\da-z])/g, '(12')
  s = s.replace(/, 1²(?![\da-z])/g, ', 12')
  s = s.replace(/ 1²(?![\da-z])/g, ' 12')
  s = s.replace(/×1²(?![\da-z])/g, '×12')
  s = s.replace(/to 1²(?![\da-z])/g, 'to 12')
  s = s.replace(/every 1²/g, 'every 12')
  s = s.replace(/is 1²(?![\da-z])/g, 'is 12')
  s = s.replace(/by 1²(?![\da-z])/g, 'by 12')
  s = s.replace(/over 1²(?![\da-z])/g, 'over 12')
  s = s.replace(/−0\.1²(?![\da-z])/g, '−0.12')
  s = s.replace(/8\.1²(?![\da-z])/g, '8.12')
  s = s.replace(/x²−7x\+1²/g, 'x²−7x+12')
  s = s.replace(/multiply to equal \+1²/g, 'multiply to equal +12')

  // LCM example
  s = s.replace(/−3×\(−4\)=1²/g, '−3×(−4)=12')

  // May 202² / Nov 202² without trailing paper code
  s = s.replace(/May 202²/g, 'May 2022')
  s = s.replace(/Nov 202²/g, 'Nov 2022')
  s = s.replace(/June 202²/g, 'June 2022')
  s = s.replace(/November 202²/g, 'November 2022')

  // u=−1² in substitution
  s = s.replace(/u=−1²/g, 'u=−12')
  s = s.replace(/−3x−1²/g, '−3x−12')
  s = s.replace(/−3x\+1²/g, '−3x+12')
  s = s.replace(/4x−1²/g, '4x−12')
  s = s.replace(/\+1²\./g, '+12.')
  s = s.replace(/x²−7x\+1²/g, 'x²−7x+12')
  s = s.replace(/equal \+1²/g, 'equal +12')
  s = s.replace(/−0\.1²/g, '−0.12')
  s = s.replace(/8\.1²/g, '8.12')

  // Fraction LCD
  s = s.replace(/which is 1²\./g, 'which is 12.')
  s = s.replace(/by 1² to clear/g, 'by 12 to clear')

  // Subscript corruption x1​ -> x_1 style (optional cleanup)
  s = s.replace(/x1​/g, 'x_1')
  s = s.replace(/x²​/g, 'x_2')
  s = s.replace(/y1​/g, 'y_1')
  s = s.replace(/y2​/g, 'y_2')

  return s
}

const files = fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'))
let updated = 0

for (const file of files) {
  const filePath = path.join(notesDir, file)
  const before = fs.readFileSync(filePath, 'utf8')
  const after = fixTypoCorruptions(before)
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8')
    updated++
    console.log('fixed typos:', file)
  }
}

console.log(`Done — ${updated}/${files.length} files updated.`)
