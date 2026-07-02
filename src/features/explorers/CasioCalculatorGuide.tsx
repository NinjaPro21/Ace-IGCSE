import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathText'
import type { CalculatorGuidePanel } from '@/lib/contentTypes'

type CalcVariant = '0580' | '0606'
type KeyStyle = 'black' | 'white' | 'blue' | 'gold' | 'alpha' | 'silver'

interface KeyDef {
  id: string
  label: string
  shift?: string
  x: number
  y: number
  w: number
  h: number
  style: KeyStyle
  colSpan?: number
}

interface GuideStep {
  title: string
  body: string
  highlightKeys?: string[]
  practiceKeys?: string[]
  display?: string
  result?: string
}

/** fx-570EX / fx-991EX ClassWiz — 5-column layout matching the physical calculator. */
const BODY_KEYS: KeyDef[] = [
  { id: 'shift', label: 'SHIFT', x: 14, y: 118, w: 44, h: 28, style: 'gold' },
  { id: 'alpha', label: 'ALPHA', x: 62, y: 118, w: 44, h: 28, style: 'alpha' },
  { id: 'menu-setup', label: 'MENU', shift: 'SETUP', x: 186, y: 118, w: 52, h: 28, style: 'black' },
  { id: 'on', label: 'ON', x: 242, y: 118, w: 24, h: 28, style: 'black' },
  { id: 'optn', label: 'OPTN', x: 14, y: 154, w: 44, h: 30, style: 'black' },
  { id: 'calc', label: 'CALC', shift: 'SOLVE', x: 62, y: 154, w: 44, h: 30, style: 'black' },
  { id: 'integral', label: '∫', shift: 'd/dx', x: 110, y: 154, w: 44, h: 30, style: 'black' },
  { id: 'xinv', label: 'x⁻¹', shift: 'x!', x: 158, y: 154, w: 44, h: 30, style: 'black' },
  { id: 'log', label: 'log', shift: '10ˣ', x: 206, y: 154, w: 44, h: 30, style: 'black' },
  { id: 'frac', label: 'a b/c', shift: '∠', x: 14, y: 188, w: 44, h: 30, style: 'black' },
  { id: 'sqrt', label: '√', shift: '³√', x: 62, y: 188, w: 44, h: 30, style: 'black' },
  { id: 'square', label: 'x²', shift: '√', x: 110, y: 188, w: 44, h: 30, style: 'black' },
  { id: 'pow', label: 'xʸ', shift: 'ʸ√x', x: 158, y: 188, w: 44, h: 30, style: 'black' },
  { id: 'ln', label: 'ln', shift: 'eˣ', x: 206, y: 188, w: 44, h: 30, style: 'black' },
  { id: 'neg', label: '(−)', shift: 'A', x: 14, y: 222, w: 44, h: 30, style: 'black' },
  { id: 'dms', label: '°′″', shift: 'B', x: 62, y: 222, w: 44, h: 30, style: 'black' },
  { id: 'hyp', label: 'hyp', shift: 'C', x: 110, y: 222, w: 44, h: 30, style: 'black' },
  { id: 'sin', label: 'sin', shift: 'sin⁻¹', x: 158, y: 222, w: 44, h: 30, style: 'black' },
  { id: 'cos', label: 'cos', shift: 'cos⁻¹', x: 206, y: 222, w: 44, h: 30, style: 'black' },
  { id: 'sto', label: 'STO', shift: 'D', x: 14, y: 256, w: 44, h: 30, style: 'black' },
  { id: 'eng', label: 'ENG', shift: 'E', x: 62, y: 256, w: 44, h: 30, style: 'black' },
  { id: 'lparen', label: '(', shift: 'F', x: 110, y: 256, w: 44, h: 30, style: 'black' },
  { id: 'rparen', label: ')', shift: 'x', x: 158, y: 256, w: 44, h: 30, style: 'black' },
  { id: 'tan', label: 'tan', shift: 'tan⁻¹', x: 206, y: 256, w: 44, h: 30, style: 'black' },
  { id: 'rcl', label: 'RCL', shift: 'y', x: 14, y: 290, w: 44, h: 30, style: 'black' },
  { id: 'sd', label: 'S⇔D', shift: 'M', x: 62, y: 290, w: 44, h: 30, style: 'black' },
  { id: 'mplus', label: 'M+', shift: 'M−', x: 110, y: 290, w: 44, h: 30, style: 'black' },
  { id: 'conv', label: 'CONV', shift: 'RCL', x: 158, y: 290, w: 44, h: 30, style: 'black' },
  { id: 'clr', label: 'CLR', shift: 'INS', x: 206, y: 290, w: 44, h: 30, style: 'black' },
  { id: '7', label: '7', x: 14, y: 328, w: 44, h: 34, style: 'white' },
  { id: '8', label: '8', x: 62, y: 328, w: 44, h: 34, style: 'white' },
  { id: '9', label: '9', x: 110, y: 328, w: 44, h: 34, style: 'white' },
  { id: 'del', label: 'DEL', x: 158, y: 328, w: 44, h: 34, style: 'blue' },
  { id: 'ac', label: 'AC', x: 206, y: 328, w: 44, h: 34, style: 'blue' },
  { id: '4', label: '4', x: 14, y: 366, w: 44, h: 34, style: 'white' },
  { id: '5', label: '5', x: 62, y: 366, w: 44, h: 34, style: 'white' },
  { id: '6', label: '6', x: 110, y: 366, w: 44, h: 34, style: 'white' },
  { id: 'mul', label: '×', x: 158, y: 366, w: 44, h: 34, style: 'white' },
  { id: 'div', label: '÷', x: 206, y: 366, w: 44, h: 34, style: 'white' },
  { id: '1', label: '1', x: 14, y: 404, w: 44, h: 34, style: 'white' },
  { id: '2', label: '2', x: 62, y: 404, w: 44, h: 34, style: 'white' },
  { id: '3', label: '3', x: 110, y: 404, w: 44, h: 34, style: 'white' },
  { id: 'plus', label: '+', x: 158, y: 404, w: 44, h: 34, style: 'white' },
  { id: 'minus', label: '−', x: 206, y: 404, w: 44, h: 34, style: 'white' },
  { id: '0', label: '0', x: 14, y: 442, w: 76, h: 34, style: 'white', colSpan: 2 },
  { id: 'dot', label: '.', x: 94, y: 442, w: 40, h: 34, style: 'white' },
  { id: 'exp10', label: '×10ˣ', x: 138, y: 442, w: 44, h: 34, style: 'white' },
  { id: 'ans', label: 'Ans', x: 186, y: 442, w: 40, h: 34, style: 'white' },
  { id: 'eq', label: '=', x: 230, y: 442, w: 40, h: 34, style: 'white' },
]

const PANEL_MISSIONS: Record<CalculatorGuidePanel, string> = {
  layout: 'Learn the ClassWiz keyboard',
  setup: 'Open SETUP and confirm degree mode',
  modes: 'Verify sin 30 = 0.5 in degrees',
  logs: 'Evaluate log(100) and powers',
  tools: 'Master fractions, S⇔D, and Ans',
}

const KEY_TIPS: Record<string, string> = {
  shift: 'Gold SHIFT — yellow labels above each key',
  'menu-setup': 'MENU / SETUP — change angle unit & format',
  nav: 'Silver pad — scroll menus and move cursor',
  sin: 'sin — sine (SHIFT for sin⁻¹)',
  log: 'log — base-10 logarithm',
  ln: 'ln — natural log (SHIFT gives eˣ)',
  frac: 'a b/c — stacked fractions',
  sd: 'S⇔D — exact ↔ decimal toggle',
  ans: 'Ans — reuse last calculated value',
  exp10: '×10ˣ — standard form entry',
  eq: '= — evaluate expression',
  del: 'DEL — delete character',
  ac: 'AC — clear all',
  clr: 'CLR — clear (SHIFT+CLR resets SETUP)',
}

const KEY_FILL: Record<KeyStyle, { base: string; active: string; stroke: string; text: string; shift: string }> = {
  black: { base: '#1a1a1a', active: '#2563eb', stroke: '#333', text: '#f8fafc', shift: '#fbbf24' },
  white: { base: '#f1f5f9', active: '#2563eb', stroke: '#cbd5e1', text: '#0f172a', shift: '#64748b' },
  blue: { base: '#1d4ed8', active: '#1e40af', stroke: '#1e3a8a', text: '#fff', shift: '#bfdbfe' },
  gold: { base: '#ca8a04', active: '#2563eb', stroke: '#a16207', text: '#fff', shift: '#fef3c7' },
  alpha: { base: '#1a1a1a', active: '#2563eb', stroke: '#dc2626', text: '#fca5a5', shift: '#f87171' },
  silver: { base: '#94a3b8', active: '#2563eb', stroke: '#64748b', text: '#1e293b', shift: '#475569' },
}

const PANEL_STEPS: Record<CalculatorGuidePanel, GuideStep[]> = {
  layout: [
    {
      title: 'Know your calculator',
      body: 'This is the **fx-570EX / fx-991EX** layout used in Cambridge exams. Gold **SHIFT**, blue **DEL/AC**, and the silver navigation pad under the display.',
      highlightKeys: ['shift', 'del', 'ac', 'nav'],
    },
    {
      title: 'Check the status line',
      body: 'Before every trig question, confirm **D** (degrees) or **R** (radians) on the green status line. Wrong mode is the #1 calculator mistake on IGCSE papers.',
      display: 'Math ▶  D',
    },
    {
      title: 'Try a key',
      body: 'Tap **sin** on the diagram — the display shows what you typed. Keys glow blue when you press them. Use this to build muscle memory before the exam.',
      highlightKeys: ['sin'],
      practiceKeys: ['sin'],
      display: 'sin(',
    },
  ],
  setup: [
    {
      title: 'Step 1 — press SHIFT',
      body: 'Hold the gold **SHIFT** key first. Secondary functions (yellow labels above keys) only work after SHIFT.',
      highlightKeys: ['shift'],
      practiceKeys: ['shift'],
      display: 'SHIFT',
    },
    {
      title: 'Step 2 — open SETUP',
      body: 'While SHIFT is active, press **MENU SETUP** (yellow SETUP above MENU). The setup menu appears on screen.',
      highlightKeys: ['shift', 'menu-setup'],
      practiceKeys: ['shift', 'menu-setup'],
      display: 'SETUP ▶',
    },
    {
      title: 'Step 3 — set angle unit',
      body: 'Use **▲ ▼** on the silver pad to scroll to **Angle Unit** → choose **Deg** for 0580 and most 0606 trig.',
      highlightKeys: ['nav'],
      practiceKeys: ['nav'],
      display: 'Angle Unit ▶ Deg',
    },
    {
      title: 'Reset if stuck',
      body: 'Wrong settings? **SHIFT + CLR** (yellow INS) → **Setup Data** → **=**. This clears mode without deleting your equations.',
      highlightKeys: ['shift', 'clr', 'eq'],
    },
  ],
  modes: [
    {
      title: 'Degree check (0580)',
      body: 'Type **sin 30 =** on the diagram. Correct answer: **0.5**. If you get **−0.988…** you are in radians — fix in SETUP.',
      highlightKeys: ['sin', '3', '0', 'eq'],
      practiceKeys: ['sin', '3', '0', 'eq'],
      display: 'sin(30)',
      result: '0.5',
    },
    {
      title: 'When to use radians (0606)',
      body: 'Switch to **Rad** for circular measure, calculus with $\\sin x$, and any question that says radians or uses $\\pi$ as an angle unit.',
      display: 'Math ▶  R',
    },
    {
      title: 'Inverse trig',
      body: 'Press **SHIFT** then **sin** for $\\sin^{-1}$. Example: $\\sin^{-1}(0.5) = 30°$ in degree mode.',
      highlightKeys: ['shift', 'sin'],
      practiceKeys: ['shift', 'sin', 'dot', '5', 'rparen', 'eq'],
      display: 'sin⁻¹(0.5)',
      result: '30',
    },
  ],
  logs: [
    {
      title: 'Common logarithm',
      body: 'Press **log** then the number then **=**. Example: $\\log_{10}(100) = 2$.',
      highlightKeys: ['log', 'eq'],
      practiceKeys: ['log', '1', '0', '0', 'eq'],
      display: 'log(100)',
      result: '2',
    },
    {
      title: 'Natural log & eˣ',
      body: '**ln** gives natural log. **SHIFT + ln** gives $e^x$ — essential for exponential growth/decay questions.',
      highlightKeys: ['ln', 'shift'],
    },
    {
      title: 'Powers & change of base',
      body: 'Use **xʸ** for $a^b$. For $\\log_a b$ on 0606: type **ln(b) ÷ ln(a)** using **ln** and **÷**.',
      highlightKeys: ['ln', 'pow', 'div'],
    },
  ],
  tools: [
    {
      title: 'Stacked fractions',
      body: 'Press **a b/c** instead of typing ÷ for nested fractions — avoids bracket errors in longer expressions.',
      highlightKeys: ['frac'],
      practiceKeys: ['frac'],
      display: '1◻/◻',
    },
    {
      title: 'Exact ↔ decimal',
      body: 'Press **S⇔D** to toggle between surd/fraction and decimal. Examiners often want exact form — check before you write your final answer.',
      highlightKeys: ['sd'],
      practiceKeys: ['sd'],
      display: '1/2',
      result: '0.5',
    },
    {
      title: 'Standard form',
      body: 'Use **×10ˣ** on the bottom row: type **3.2 ×10ˣ 5** for $3.2 \\times 10^5$.',
      highlightKeys: ['exp10', 'dot'],
      practiceKeys: ['3', 'dot', '2', 'exp10', '5'],
      display: '3.2×10⁵',
    },
    {
      title: 'Reuse ANS',
      body: 'Press **Ans** to insert the previous result — never copy a rounded value by hand when the next step needs the exact calculator output.',
      highlightKeys: ['ans'],
    },
  ],
}

function keyLabel(id: string): string {
  const key = BODY_KEYS.find((k) => k.id === id)
  if (key) return key.label
  if (id === 'nav') return '▲▼◀▶'
  return id
}

function CalcKey({
  keyDef,
  active,
  pressed,
  onHover,
  onPress,
}: {
  keyDef: KeyDef
  active: boolean
  pressed: boolean
  onHover: (id: string | null) => void
  onPress: (id: string) => void
}) {
  const palette = KEY_FILL[keyDef.style]
  const fill = pressed || active ? palette.active : palette.base
  const textFill = pressed || active ? '#fff' : palette.text
  const shiftFill = pressed || active ? '#dbeafe' : palette.shift

  return (
    <g
      className="enlight-calc-key"
      onMouseEnter={() => onHover(keyDef.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onPress(keyDef.id)}
      role="button"
      tabIndex={0}
      aria-label={keyDef.label}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPress(keyDef.id)
        }
      }}
    >
      {keyDef.shift && (
        <text x={keyDef.x + keyDef.w / 2} y={keyDef.y + 8} textAnchor="middle" fontSize={6} fontWeight={600} fill={shiftFill}>
          {keyDef.shift}
        </text>
      )}
      <rect
        x={keyDef.x}
        y={keyDef.y + (keyDef.shift ? 4 : 0)}
        width={keyDef.w}
        height={keyDef.h - (keyDef.shift ? 4 : 0)}
        rx={5}
        fill={fill}
        stroke={active ? '#93c5fd' : palette.stroke}
        strokeWidth={active || pressed ? 2.5 : 1}
        style={{ transition: 'fill 0.12s' }}
      />
      <text
        x={keyDef.x + keyDef.w / 2}
        y={keyDef.y + (keyDef.shift ? 22 : 18)}
        textAnchor="middle"
        fontSize={keyDef.label.length > 4 ? 8 : keyDef.label === '×10ˣ' ? 7 : 10}
        fontWeight={700}
        fill={textFill}
      >
        {keyDef.label}
      </text>
    </g>
  )
}

function DPad({
  active,
  pressed,
  onHover,
  onPress,
}: {
  active: boolean
  pressed: boolean
  onHover: (id: string | null) => void
  onPress: (id: string) => void
}) {
  const cx = 148
  const cy = 132
  const r = 28
  const fill = pressed || active ? '#2563eb' : '#94a3b8'

  return (
    <g
      className="enlight-calc-key"
      onMouseEnter={() => onHover('nav')}
      onMouseLeave={() => onHover(null)}
      onClick={() => onPress('nav')}
      role="button"
      aria-label="Navigation pad"
    >
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={active ? '#93c5fd' : '#64748b'} strokeWidth={active ? 2.5 : 1.5} />
      <polygon points={`${cx},${cy - 10} ${cx - 7},${cy - 2} ${cx + 7},${cy - 2}`} fill={active || pressed ? '#fff' : '#1e293b'} />
      <polygon points={`${cx},${cy + 10} ${cx - 7},${cy + 2} ${cx + 7},${cy + 2}`} fill={active || pressed ? '#fff' : '#1e293b'} />
      <polygon points={`${cx - 10},${cy} ${cx - 2},${cy - 7} ${cx - 2},${cy + 7}`} fill={active || pressed ? '#fff' : '#1e293b'} />
      <polygon points={`${cx + 10},${cy} ${cx + 2},${cy - 7} ${cx + 2},${cy + 7}`} fill={active || pressed ? '#fff' : '#1e293b'} />
      <circle cx={cx} cy={cy} r={4} fill={active || pressed ? '#dbeafe' : '#475569'} />
    </g>
  )
}

function CalculatorSvg({
  display,
  result,
  statusLine,
  highlightIds,
  hoverId,
  pressedId,
  onHoverKey,
  onPressKey,
}: {
  display: string
  result?: string
  statusLine: string
  highlightIds: Set<string>
  hoverId: string | null
  pressedId: string | null
  onHoverKey: (id: string | null) => void
  onPressKey: (id: string) => void
}) {
  const active = (id: string) => highlightIds.has(id) || hoverId === id
  const pressed = (id: string) => pressedId === id

  return (
    <svg viewBox="0 0 280 520" className="enlight-calc-svg" role="img" aria-label="Casio fx-570EX ClassWiz">
      <defs>
        <pattern id="calc-carbon" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={6} height={6} fill="#111" />
          <line x1={0} y1={0} x2={0} y2={6} stroke="#1c1c1c" strokeWidth={2} />
        </pattern>
        <linearGradient id="calc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="35%" stopColor="#141414" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      <rect x={4} y={4} width={272} height={512} rx={18} fill="url(#calc-body)" stroke="#000" strokeWidth={2} />
      <text x={16} y={26} fontSize={13} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">CASIO</text>
      <text x={16} y={40} fontSize={7} fill="#f472b6" fontFamily="Arial, sans-serif">fx-570EX</text>
      <text x={16} y={50} fontSize={6} fill="#f472b6" fontFamily="Arial, sans-serif">CLASSWIZ</text>
      <rect x={228} y={14} width={36} height={14} rx={2} fill="#1e293b" stroke="#475569" strokeWidth={0.5} />
      <rect x={14} y={58} width={252} height={52} rx={4} fill="#9ca3af" stroke="#6b7280" strokeWidth={1} />
      <rect x={18} y={62} width={244} height={44} rx={2} fill="#d1fae5" />
      <text x={24} y={78} fontSize={9} fill="#374151" fontFamily="Arial, sans-serif">Math ▶</text>
      <text x={24} y={92} fontSize={11} fill="#111827" fontFamily="'Courier New', monospace" fontWeight={600}>{display}</text>
      {result && (
        <text x={240} y={100} fontSize={11} fill="#111827" fontFamily="'Courier New', monospace" fontWeight={600} textAnchor="end">{result}</text>
      )}
      <text x={24} y={102} fontSize={7} fill="#059669" fontFamily="Arial, sans-serif">{statusLine}</text>
      <rect x={10} y={112} width={260} height={400} rx={10} fill="url(#calc-carbon)" />
      <DPad active={active('nav')} pressed={pressed('nav')} onHover={onHoverKey} onPress={onPressKey} />
      {BODY_KEYS.map((k) => (
        <CalcKey key={k.id} keyDef={k} active={active(k.id)} pressed={pressed(k.id)} onHover={onHoverKey} onPress={onPressKey} />
      ))}
    </svg>
  )
}

export function CasioCalculatorGuide({
  panels,
  variant = '0580',
}: {
  panels?: CalculatorGuidePanel[]
  variant?: CalcVariant
}) {
  const defaultPanels: CalculatorGuidePanel[] = ['layout', 'setup', 'modes', 'logs', 'tools']
  const filtered = panels?.length ? panels : defaultPanels
  const [tab, setTab] = useState<CalculatorGuidePanel>(filtered[0] ?? 'layout')
  const [stepIdx, setStepIdx] = useState(0)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [pressedId, setPressedId] = useState<string | null>(null)
  const [practiceIdx, setPracticeIdx] = useState(0)
  const [liveDisplay, setLiveDisplay] = useState<string | null>(null)
  const [liveResult, setLiveResult] = useState<string | undefined>()
  const [practiceComplete, setPracticeComplete] = useState(false)

  const steps = PANEL_STEPS[tab] ?? PANEL_STEPS.layout
  const step = steps[stepIdx] ?? steps[0]
  const practiceSeq = step.practiceKeys ?? []

  const highlights = useMemo(() => {
    const ids = new Set(step.highlightKeys ?? [])
    if (practiceIdx < practiceSeq.length) ids.add(practiceSeq[practiceIdx])
    return ids
  }, [step, practiceIdx, practiceSeq])

  const resetPractice = () => {
    setPracticeIdx(0)
    setLiveDisplay(null)
    setLiveResult(undefined)
    setPracticeComplete(false)
  }

  const handlePress = (id: string) => {
    setPressedId(id)
    window.setTimeout(() => setPressedId(null), 180)

    const seq = step.practiceKeys ?? []
    if (seq.length === 0) {
      if (id === 'sin') setLiveDisplay('sin(')
      return
    }

    const expected = seq[practiceIdx]
    if (id !== expected) {
      resetPractice()
      return
    }

    const next = practiceIdx + 1
    setPracticeIdx(next)

    if (tab === 'modes' && seq.join(',') === 'sin,3,0,eq') {
      if (id === 'sin') setLiveDisplay('sin(')
      else if (id === '3') setLiveDisplay('sin(3')
      else if (id === '0') setLiveDisplay('sin(30')
      else if (id === 'eq') {
        setLiveDisplay('sin(30)')
        setLiveResult('0.5')
      }
    } else if (tab === 'logs' && seq.join(',') === 'log,1,0,0,eq') {
      if (id === 'log') setLiveDisplay('log(')
      else if (id === '1') setLiveDisplay('log(1')
      else if (id === '0' && liveDisplay === 'log(1') setLiveDisplay('log(10')
      else if (id === '0') setLiveDisplay('log(100')
      else if (id === 'eq') {
        setLiveDisplay('log(100)')
        setLiveResult('2')
      }
    } else if (tab === 'setup') {
      if (id === 'shift') setLiveDisplay('SHIFT')
      else if (id === 'menu-setup') setLiveDisplay('SETUP ▶')
      else if (id === 'nav') setLiveDisplay('Angle Unit ▶ Deg')
    } else if (tab === 'tools' && id === 'frac') {
      setLiveDisplay('1◻/◻')
    } else if (tab === 'tools' && id === 'sd') {
      setLiveDisplay('1/2')
      setLiveResult('0.5')
    }

    if (next >= seq.length) {
      setPracticeComplete(true)
      window.setTimeout(() => {
        if (stepIdx < steps.length - 1) {
          setStepIdx((i) => i + 1)
        }
        resetPractice()
      }, 1400)
    }
  }

  const display = liveDisplay ?? step.display ?? (tab === 'layout' ? 'Math ▶' : 'Math ▶  D')
  const result = liveResult ?? step.result

  const statusLine =
    variant === '0580'
      ? 'Check D on status line before trig'
      : 'Switch D ↔ R for trig vs circular measure'

  const tabLabels: Record<CalculatorGuidePanel, string> = {
    layout: 'Key layout',
    setup: 'SETUP menu',
    modes: variant === '0580' ? 'Degree mode' : 'Deg / Rad',
    logs: 'Log & exp',
    tools: 'Exam tools',
  }

  const hoverTip = hoverId ? KEY_TIPS[hoverId] ?? `${keyLabel(hoverId)} key` : null

  return (
    <div className="enlight-calc-guide">
      <div className="enlight-calc-guide__mission-bar">
        <div>
          <div className="enlight-calc-guide__mission-label">Practice mission</div>
          <p className="enlight-calc-guide__mission-title">{PANEL_MISSIONS[tab]}</p>
        </div>
        <span className="enlight-calc-guide__mission-progress">
          Step {stepIdx + 1} / {steps.length}
        </span>
      </div>

      <div className="enlight-calc-guide__tabs" role="tablist">
        {filtered.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            className={`enlight-calc-guide__tab${tab === p ? ' enlight-calc-guide__tab--active' : ''}`}
            onClick={() => {
              setTab(p)
              setStepIdx(0)
              resetPractice()
            }}
          >
            {tabLabels[p]}
          </button>
        ))}
      </div>

      <div className="enlight-calc-guide__layout">
        <div className="enlight-calc-guide__device">
          <CalculatorSvg
            display={display}
            result={result}
            statusLine={statusLine}
            highlightIds={highlights}
            onHoverKey={setHoverId}
            hoverId={hoverId}
            pressedId={pressedId}
            onPressKey={handlePress}
          />
          {hoverTip && <p className="enlight-calc-guide__key-hint">{hoverTip}</p>}
          {practiceSeq.length > 0 && (
            <div className="enlight-calc-guide__sequence" aria-label="Key sequence">
              {practiceSeq.map((keyId, i) => (
                <span
                  key={keyId + i}
                  className={[
                    'enlight-calc-guide__sequence-key',
                    i < practiceIdx || practiceComplete ? 'enlight-calc-guide__sequence-key--done' : '',
                    i === practiceIdx && !practiceComplete ? 'enlight-calc-guide__sequence-key--active' : '',
                  ].join(' ')}
                >
                  {keyLabel(keyId)}
                </span>
              ))}
            </div>
          )}
          <p className="enlight-calc-guide__caption">
            {practiceSeq.length > 0
              ? 'Press the highlighted keys in order on the diagram above.'
              : 'Hover any key to learn what it does, then tap to try it.'}
          </p>
          {practiceComplete && (
            <p className="enlight-calc-guide__practice-hint">✓ Sequence complete — moving to next step…</p>
          )}
        </div>

        <div className="enlight-calc-guide__panel">
          <h3 className="enlight-calc-guide__step-title">{step.title}</h3>
          <MathText block className="enlight-calc-guide__step-body" content={step.body} />
          {practiceSeq.length > 0 && (
            <ul className="enlight-calc-guide__checklist">
              {practiceSeq.map((keyId, i) => (
                <li
                  key={keyId + i}
                  className={i < practiceIdx || practiceComplete ? 'enlight-calc-guide__checklist-item--done' : ''}
                >
                  Press <strong>{keyLabel(keyId)}</strong>
                  {i === practiceSeq.length - 1 && result ? ` → expect ${result}` : ''}
                </li>
              ))}
            </ul>
          )}
          <div className="enlight-calc-guide__step-nav">
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={() => {
                setStepIdx((i) => i - 1)
                resetPractice()
              }}
            >
              ← Previous
            </button>
            <span>
              {stepIdx + 1} / {steps.length}
            </span>
            <button
              type="button"
              disabled={stepIdx >= steps.length - 1}
              onClick={() => {
                setStepIdx((i) => i + 1)
                resetPractice()
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
