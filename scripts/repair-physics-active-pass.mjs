#!/usr/bin/env node
/**
 * Repair active physics topic quizzes — targeted LaTeX fixes + manual overrides.
 * Skips chNN-* stub files (not used at runtime).
 *
 * Run: node scripts/repair-physics-active-pass.mjs
 * Then: npm run audit:quizzes -- physics --strict
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { repairPhysicsQuizText } from './repair-physics-quiz-latex.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const quizDir = path.join(__dirname, '..', 'content', 'quizzes', 'physics')
const chapterDir = path.join(__dirname, '..', 'content', 'chapters', 'physics')

const activeTopics = new Set()
for (const f of fs.readdirSync(chapterDir)) {
  if (!f.endsWith('.json')) continue
  const ch = JSON.parse(fs.readFileSync(path.join(chapterDir, f), 'utf8'))
  for (const t of ch.topicIds ?? []) activeTopics.add(t)
}

/** Manual overrides when automatic repair is insufficient or stems were mis-paired at import. */
const OVERRIDES = {
  // ── Misassigned stems (question ≠ options/explanation) ─────────
  '11-3-common-features-of-wave-behaviour-medium-q5': {
    question:
      'What occurs when plane waves strike a straight barrier at an angle of incidence of $0^\\circ$?',
    options: [
      'The waves reflect back along their original path',
      'The waves are refracted towards the normal',
      'The waves undergo maximum diffraction',
      'The wavelength of the reflected waves doubles',
    ],
    correctIndex: 0,
    explanation:
      'An angle of incidence of $0^\\circ$ means the waves hit the barrier head-on. They reflect directly back. Refraction and diffraction require boundaries between media or gaps/edges.\n\n**Common mistake:** Review the method above and check units/signs.',
  },
  '11-3-common-features-of-wave-behaviour-pyp-q4': {
    question:
      'The diagram shows waves reflecting from a barrier. The angle between the incident wavefronts and the barrier is $30^\\circ$. What is the angle of reflection $r$?',
    options: ['$30^\\circ$', '$60^\\circ$', '$90^\\circ$', '$0^\\circ$'],
    correctIndex: 0,
    explanation:
      'If the wavefronts are at $30^\\circ$ to the barrier, the incident ray (perpendicular to wavefronts) is at $30^\\circ$ to the normal. By the law of reflection, $i = r = 30^\\circ$.\n\n**Common mistake:** Review the method above and check units/signs.',
  },
  '7-2-pressure-in-liquids-medium-q5': {
    question:
      'Which graph correctly shows how the pressure $p$ in a liquid of constant density varies with depth $h$?',
    options: [
      'A straight line passing through the origin',
      'A horizontal straight line',
      'A curve that gets steeper as depth increases',
      'A straight line with a negative gradient',
    ],
    correctIndex: 0,
    explanation:
      'Because $p$ is directly proportional to $h$ ($p = \\rho g h$), the relationship is linear and the graph is a straight line through the origin. \n\n**Common mistake:** Thinking the graph should be a curve because liquid pressure feels \'heavy\'.',
  },
  '8-3-gases-and-the-absolute-scale-of-temperature-medium-q4': {
    question:
      'Which graph correctly shows how the pressure $p$ of a fixed mass of gas varies with its volume $V$ at constant temperature?',
    options: [
      'A curve showing that as $V$ increases, $p$ decreases',
      'A straight line through the origin with a positive gradient',
      'A straight line with a negative gradient that hits the axes',
      'A horizontal straight line at the atmospheric pressure level',
    ],
    correctIndex: 0,
    explanation:
      'Since $p \\times V = \\text{constant}$, the graph is a hyperbola (a curve that never reaches zero). **Common mistake:** Thinking it is a straight line; a straight line only occurs if you plot $p$ against $1/V$.',
  },

  // ── Class J / angle notation ───────────────────────────────────
  '11-3-common-features-of-wave-behaviour-easy-q5': {
    question:
      'For the reflection of water waves, what is the relationship between the angle of incidence $i$ and the angle of reflection $r$?',
    options: ['$i = r$', '$i > r$', '$i < r$', '$i + r = 90^\\circ$'],
  },

  // ── LaTeX corruption ───────────────────────────────────────────
  '12-2-refraction-of-light-easy-q4': {
    explanation:
      'Snell\'s Law states that the constant ratio of the sine of the angle of incidence ($i$) to the sine of the angle of refraction ($r$) is the refractive index ($n$).\n\n**Common mistake:** Review the method above and check units/signs.',
  },
  '6-2-work-easy-q3': {
    explanation:
      'Work done is the product of the constant force $F$ and the distance moved $s$ in the direction of that force. **Common mistake:** Using the kinetic energy formula ($\\frac{1}{2}mv^2$) to find work done directly from mass and speed.',
  },
  '6-4-power-hard-q5': {
    explanation:
      'In A, the distance $s$ is doubled compared to B. Since Work $= Fs$, Work in A is double. Because Power $=$ Work $/$ time and time is the same, Power in A is double. \n\n**Common mistake:** Thinking power only depends on the force applied regardless of distance.',
  },
  '9-2-specific-heat-capacity-easy-q4': {
    explanation:
      'Specific heat capacity $c$ is the thermal energy $\\Delta E$ divided by the product of mass $m$ and temperature change $\\Delta \\theta$. \n\n**Common mistake:** Forgetting to divide by both mass and temperature change.',
  },
  '16-6-electrical-energy-and-electrical-power-medium-q3': {
    explanation:
      'Energy in kWh is calculated by $E = P \\times t$, where $P$ is in kW and $t$ is in hours. $E = 3\\text{ kW} \\times 2.0\\text{ h} = 6.0\\text{ kWh}$.\n\n**Common mistake:** Review the method above and check units/signs.',
  },
  '16-6-electrical-energy-and-electrical-power-medium-q4': {
    question:
      'If electricity costs $0.27$ per kWh, what is the cost of using $1.5\\text{ kWh}$ of energy?',
    options: ['$0.41$', '$0.18$', '$0.54$', '$0.27$'],
    explanation:
      'Cost $=$ Energy used $\\times$ tariff. $1.5\\text{ kWh} \\times 0.27 = 0.405$, which rounds to approximately $0.41$. \n\n**Common mistake:** Review the method above and check units/signs.',
  },
  '21-2-the-solar-system-pyp-q4': {
    options: [
      'Between $2$ and $12$ Earth years',
      'Less than $1$ Earth year',
      'Exactly $1$ Earth year',
      'More than $30$ Earth years',
    ],
    explanation:
      'As noted in the practice answers, since Mars takes $1.9$ years and Jupiter takes $11.9$ years, an asteroid in between would take between $2$ and $12$ years. \n\n**Common mistake:** Assuming all objects in space take $1$ year to orbit.',
  },
  '21-2-the-solar-system-pyp-q5': {
    explanation:
      'From Worked Example 21B: $t = d/v = (4.5 \\times 10^{12}\\text{ m}) / (3 \\times 10^{8}\\text{ m/s}) = 15000$ seconds, which is $4.17 \\approx 4.2$ hours. \n\n**Common mistake:** Selecting $1500$ seconds due to a decimal error.',
  },
  '18-6-the-transformer-hard-q1': {
    explanation:
      'Using $I_p V_p = I_s V_s$ for $100\\%$ efficiency: $I_p = (12 \\times 0.8) / 240 = 9.6 / 240 = 0.04\\text{ A}$. \n\n**Common mistake:** Multiplying the input voltage and output current directly.',
  },
  '18-6-the-transformer-hard-q4': {
    options: [
      'By a factor of $200$',
      'By a factor of $20$',
      'By a factor of $400$',
      'It has not changed, only the voltage changed.',
    ],
    explanation:
      'The voltage is increased from $2000\\text{ V}$ to $400000\\text{ V}$, a factor of $200$. In an ideal transformer ($IV$ constant), the current must therefore decrease by the same factor of $200$. \n\n**Common mistake:** Calculating the difference ($398\\text{ kV}$) rather than the ratio.',
  },

  // ── Regressions / remaining LaTeX ──────────────────────────────
  '12-1-reflection-of-light-easy-q1': {
    explanation:
      'According to the Law of Reflection, the angle of incidence ($i$) is equal to the angle of reflection ($r$). \n\n**Common mistake:** thinking $i$ and $r$ must add to $90^\\circ$, which only happens if $i = 45^\\circ$.',
  },
  '12-1-reflection-of-light-pyp-q2': {
    question:
      'A ray of light strikes a plane mirror. The angle between the incident ray and the mirror surface is $35^\\circ$. What is the angle of reflection?',
  },
  '12-1-reflection-of-light-pyp-q5': {
    explanation:
      'In a periscope, light reflects from two plane mirrors at $45^\\circ$ so the image is seen around a corner. \n\n**Common mistake:** Confusing reflection with refraction through lenses.',
  },
  '12-3-total-internal-reflection-pyp-q1': {
    explanation:
      'The critical angle is the angle of incidence in the denser medium that gives an angle of refraction of $90^\\circ$. \n\n**Common mistake:** Confusing it with the angle of refraction itself.',
  },
  '2-2-graphs-of-motion-easy-q1': {
    explanation:
      'The gradient of a distance–time graph ($\\Delta y / \\Delta x$) represents the change in distance over the change in time, which is speed. \n\n**Common mistake:** Students often confuse distance–time and speed–time graphs, incorrectly stating that the gradient represents acceleration.',
  },
  '5-1-what-is-momentum-easy-q1': {
    explanation:
      'By definition, momentum $p$ is calculated as mass $m$ multiplied by velocity $v$. \n\n**Common mistake:** Confusing it with force ($F = ma$) or impulse ($F \\Delta t$).',
  },
  '5-2-momentum-impulse-and-force-easy-q2': {
    explanation:
      'Since impulse is force ($N$) $\\times$ time ($s$), its unit is the newton second ($N\\,s$). It is also equivalent to $\\text{kg m/s}$. \n\n**Common mistake:** Using units of force ($N$) or energy ($J$).',
  },
  '5-2-momentum-impulse-and-force-easy-q3': {
    explanation:
      'By definition, the resultant force $F$ is the rate of change of momentum: $F = \\Delta p / \\Delta t$. \n\n**Common mistake:** Thinking force is just the total \'change\' in momentum without considering time.',
  },
  '5-2-momentum-impulse-and-force-easy-q5': {
    explanation:
      'For a fixed change in momentum (impulse), increasing the time interval $\\Delta t$ reduces the average force $F$ because $F = \\Delta p / \\Delta t$. \n\n**Common mistake:** Thinking it changes the total impulse; the impulse remains the same because the change in velocity is the same.',
  },
  '5-2-momentum-impulse-and-force-hard-q5': {
    explanation:
      'From $F = \\Delta p / \\Delta t$, a smaller contact time means a larger average force for the same momentum change. \n\n**Common mistake:** Assuming the impulse changes when only the time changes.',
  },
  '5-2-momentum-impulse-and-force-medium-q5': {
    question:
      'Which equation correctly represents the relationship between force ($F$), mass ($m$), change in velocity ($\\Delta v$), and time ($t$)?',
    options: [
      '$F = \\frac{m \\Delta v}{t}$',
      '$F = m \\Delta v \\times t$',
      '$F = \\frac{m t}{\\Delta v}$',
      '$F = \\frac{t}{m \\Delta v}$',
    ],
    explanation:
      'This is derived from $F = \\Delta p / \\Delta t$ where $\\Delta p = m \\Delta v$. So $F = m \\Delta v / t$. \n\n**Common mistake:** Placing time in the numerator or ignoring the division entirely.',
  },
  '6-1-energy-medium-q2': {
    explanation:
      'Gravitational potential energy depends on height: $E_p = mgh$. Doubling the height doubles the stored energy if mass and $g$ are unchanged. \n\n**Common mistake:** Thinking energy depends on speed at the top of a climb only.',
  },
  '6-1-energy-pyp-q5': {
    explanation:
      'Since $mgh = \\frac{1}{2}mv^2$, the mass $m$ cancels out ($gh = \\frac{1}{2}v^2$). Thus, speed $v$ only depends on gravity $g$ and the change in height $h$. \n\n**Common mistake:** Thinking a heavier bob will swing faster.',
  },
  '6-4-power-pyp-q2': {
    question:
      'Which equation correctly represents the power $P$ of a device in terms of work done $W$, energy converted $\\Delta E$, and time $t$?',
    options: [
      '$P = \\frac{W}{t} = \\frac{\\Delta E}{t}$',
      '$P = W \\times t = \\Delta E \\times t$',
      '$P = \\frac{t}{W} = \\frac{t}{\\Delta E}$',
      '$P = W - t = \\Delta E - t$',
    ],
  },
  '7-2-pressure-in-liquids-easy-q2': {
    question:
      'Which of the following is the correct equation for the change in pressure ($\\Delta p$) in a liquid?',
    options: [
      '$\\Delta p = \\rho g \\Delta h$',
      '$\\Delta p = F / A$',
      '$\\Delta p = m / V$',
      '$\\Delta p = \\rho / g h$',
    ],
  },
  '9-2-specific-heat-capacity-easy-q4': {
    options: [
      '$c = \\frac{\\Delta E}{m \\Delta \\theta}$',
      '$c = m \\times g \\times \\Delta h$',
      '$c = P \\times t$',
      '$c = \\frac{m}{\\Delta E \\times \\Delta \\theta}$',
    ],
  },
  '9-2-specific-heat-capacity-hard-q2': {
    explanation:
      'Use $E = mc\\Delta\\theta$ with consistent units. Rearrange to find $\\Delta\\theta$ before substituting values. \n\n**Common mistake:** Mixing grams and kilograms without converting.',
  },
  '9-2-specific-heat-capacity-hard-q5': {
    explanation:
      'Compare $Q = mc\\Delta\\theta$ for each metal: the smaller specific heat capacity needs less energy for the same temperature rise. \n\n**Common mistake:** Assuming equal masses always reach the same temperature after equal heating times without comparing $c$.',
  },
}

function applyOverrides(q) {
  const ov = OVERRIDES[q.id]
  if (!ov) return q
  return {
    ...q,
    ...(ov.question !== undefined ? { question: ov.question } : {}),
    ...(ov.options !== undefined ? { options: ov.options } : {}),
    ...(ov.explanation !== undefined ? { explanation: ov.explanation } : {}),
    ...(ov.correctIndex !== undefined ? { correctIndex: ov.correctIndex } : {}),
  }
}

function repairField(text) {
  return repairPhysicsQuizText(text)
}

function repairQuestion(q) {
  let next = { ...q }
  if (next.question) next.question = repairField(next.question)
  if (next.explanation) next.explanation = repairField(next.explanation)
  if (next.options) next.options = next.options.map((o) => repairField(String(o)))
  next = applyOverrides(next)
  return next
}

let files = 0
let fields = 0

for (const name of fs.readdirSync(quizDir)) {
  if (!name.endsWith('.json') || name.startsWith('ch')) continue
  const filePath = path.join(quizDir, name)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  if (!activeTopics.has(data.topicId)) continue

  let changed = false
  const nextQuestions = (data.questions ?? []).map((q) => {
    const repaired = repairQuestion(q)
    if (JSON.stringify(repaired) !== JSON.stringify(q)) {
      changed = true
      fields++
    }
    return repaired
  })

  if (changed) {
    data.questions = nextQuestions
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
    files++
    console.log('fixed', name)
  }
}

console.log(`Physics active pass done — ${files} file(s), ${fields} question(s)`)
