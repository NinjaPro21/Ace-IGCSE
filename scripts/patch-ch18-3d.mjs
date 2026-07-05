import fs from 'node:fs'
import path from 'node:path'

const NOTES = path.join('content', 'notes', 'physics')

const ARIA_SCENES = [
  ['Three stage magnet and solenoid', 'induction-magnet', true],
  ['Faraday iron ring', 'induction-ring', false],
  ['Three stage induced e.m.f.', 'induction-emf', false],
  ['A.c. generator schematic', 'generator', false],
  ['Generator voltage time graph', 'generator-voltage', false],
  ['Magnetic field around straight wire', 'wire-field', false],
  ['Right hand grip rule', 'grip-rule', false],
  ['Magnetic field of solenoid', 'solenoid-field', false],
  ['Catapult field', 'catapult-field', false],
  ['D.c. motor schematic', 'dc-motor', false],
  ['Transformer structure', 'transformer', false],
  ['Grid transmission network', 'transmission-grid', false],
  ['Primary and secondary voltage', 'transformer-voltage', false],
]

function patchFile(file) {
  let text = fs.readFileSync(file, 'utf8')
  let changed = 0

  text = text.replace(
    /<div class="enlight-fleming-3d enlight-physics-diagram" data-hand="(left|right)"><\/div>/g,
    (_, hand) => {
      changed++
      const scene = hand === 'right' ? 'fleming-right' : 'fleming-left'
      return `<div class="enlight-em-3d enlight-physics-diagram" data-scene="${scene}"></div>`
    },
  )

  for (const [needle, scene, hero] of ARIA_SCENES) {
    const re = new RegExp(
      `<div class="enlight-physics-diagram[^"]*">[\\s\\S]*?aria-label="[^"]*${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"\\>[\\s\\S]*?<\\/div>`,
      'g',
    )
    text = text.replace(re, () => {
      changed++
      const cls = hero
        ? 'enlight-em-3d enlight-physics-diagram enlight-physics-diagram--hero'
        : 'enlight-em-3d enlight-physics-diagram'
      return `<div class="${cls}" data-scene="${scene}"></div>`
    })
  }

  if (changed) {
    fs.writeFileSync(file, text)
    console.log(`${path.basename(file)}: ${changed} diagram(s) → 3D`)
  }
}

for (const f of fs.readdirSync(NOTES).filter((n) => n.startsWith('18-'))) {
  patchFile(path.join(NOTES, f))
}
