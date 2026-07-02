/**
 * Maps doc "Visual / interactive intent" text → explorerId + panels.
 * Order matters: more specific rules first.
 */
export function mapExplorer(visualText, title) {
  if (!visualText || /notes only/i.test(visualText)) return null

  const t = visualText.toLowerCase()
  const ttl = title.toLowerCase()
  const combined = `${ttl} ${t}`

  // Title-first overrides
  if (/position vector/i.test(ttl)) return { explorerId: 'vectors-guide', explorerPanels: ['displacement'] }
  if (/tangents and normals/i.test(ttl)) return { explorerId: 'differentiation-guide', explorerPanels: ['tangent'] }
  if (/intersection.*circle|lines and circles/i.test(combined)) return { explorerId: 'circle-line' }
  if (/intersection of a line and a curve/i.test(ttl)) return { explorerId: 'line-intersection' }
  if (/applications of integration in kinematics/i.test(ttl)) return { explorerId: 'kinematics-guide', explorerPanels: ['distance', 'graphs'] }
  if (/applications of differentiation in kinematics/i.test(ttl)) return { explorerId: 'kinematics-guide', explorerPanels: ['graphs', 'chain'] }

  if (/vertical line test|mapping types/i.test(t)) return { explorerId: 'functions-guide', explorerPanels: ['types', 'mapping'] }
  if (/function machine|composite/i.test(t)) return { explorerId: 'functions-guide', explorerPanels: ['composite'] }
  if (/reflection symmetry|graph of a function and its inverse/i.test(combined)) return { explorerId: 'functions-guide', explorerPanels: ['inverse'] }

  if (/modulus intersector|∣f\(x\)|\|f\(x\)\|=g/i.test(combined)) return { explorerId: 'modulus', explorerPanels: ['fx-gx'] }
  if (/shaded number line|modulus inequalities/i.test(t)) return { explorerId: 'modulus', explorerPanels: ['inequality'] }
  if (/graph reflector|modulus parabola|absolute value number line/i.test(t)) return { explorerId: 'modulus' }

  if (/cubic modulus|cubic modulus transformer|cubic grapher/i.test(t)) return { explorerId: 'cubic', explorerPanels: ['modulus'] }
  if (/factor finder|factor theorem/i.test(t)) return { explorerId: 'cubic', explorerPanels: ['factor'] }
  if (/polynomial division/i.test(t)) return { explorerId: 'poly-division' }

  if (/tangency tester/i.test(t)) return { explorerId: 'line-intersection' }
  if (/completing the square|maximum.*minimum/i.test(t)) return { explorerId: 'quadratic' }
  if (/quadratic inequalities|discriminant\/root slider|shaded inequality regions/i.test(t)) return { explorerId: 'quadratic', explorerPanels: ['inequality'] }

  if (/simultaneous|intersection point slider/i.test(t)) return { explorerId: 'line-intersection' }

  if (/base-swapper|change of base/i.test(combined)) return { explorerId: 'log' }
  if (/natural log|e and ln|transformation grid/i.test(combined)) return { explorerId: 'natural-log' }
  if (/non-linear.*linear|linear form|linearising|linearizing/i.test(combined)) return { explorerId: 'linear-law' }
  if (/exponential growth/i.test(t)) return { explorerId: 'exponential' }

  if (/gradient slider|midpoint|parallel|perpendicular/i.test(t)) return { explorerId: 'line-geometry', explorerPanels: ['parallel'] }
  if (/shoelace/i.test(t)) return { explorerId: 'shoelace' }
  if (/linearizer|non-linear.*linear|data plotter/i.test(t)) return { explorerId: 'linear-law' }
  if (/circle geometry lab|equation of a circle/i.test(t)) return { explorerId: 'circle-circle' }

  if (/radian visualizer|arc stretcher|sector|segment shader|circular measure/i.test(t)) return { explorerId: 'trig', explorerPanels: ['sector'] }
  if (/cast unit circle|general angles/i.test(t)) return { explorerId: 'cast' }
  if (/trig transformer|trig demo|reciprocal grapher|trig slope weaver|basic trigonometry/i.test(t)) return { explorerId: 'trig' }

  if (/anagram|committee picker|permutation|combination/i.test(t)) return { explorerId: 'pnc-guide' }
  if (/pascal|ap builder|convergence visualizer|geometric progressions/i.test(t)) return { explorerId: 'series-guide' }

  if (/derivative dragger|gradient function/i.test(t)) return { explorerId: 'differentiation-guide', explorerPanels: ['gradient', 'rules'] }
  if (/zooming tangent|small increment/i.test(t)) return { explorerId: 'differentiation-guide', explorerPanels: ['approximation'] }
  if (/stationary point/i.test(t)) return { explorerId: 'differentiation-guide', explorerPanels: ['optimization'] }
  if (/tangent.*normal|exponential slope tracer/i.test(t)) return { explorerId: 'differentiation-guide', explorerPanels: ['transcendental'] }

  if (/vector component|collinearity|velocity race|constant velocity/i.test(t)) {
    return {
      explorerId: 'vectors-guide',
      explorerPanels: ttl.includes('velocity') ? ['motion'] : ['displacement'],
    }
  }

  if (/area under velocity/i.test(t)) return { explorerId: 'kinematics-guide', explorerPanels: ['distance', 'graphs'] }
  if (/kinematics grapher/i.test(t)) return { explorerId: 'kinematics-guide', explorerPanels: ['graphs', 'chain'] }

  if (/linear divider|indefinite integral/i.test(t)) return { explorerId: 'integration-guide', explorerPanels: ['indefinite'] }
  if (/limit slider|definite integration/i.test(t)) return { explorerId: 'integration-guide', explorerPanels: ['definite', 'area'] }
  if (/area painter|area under a curve/i.test(t)) return { explorerId: 'integration-guide', explorerPanels: ['area'] }
  if (/log area/i.test(t)) return { explorerId: 'integration-guide', explorerPanels: ['indefinite'] }

  // ── IGCSE Mathematics 0580 (Mathnotes.docx) ──
  if (/number line walk|number line slider/i.test(t)) return null
  if (/venn diagram factorizer|set builder venn/i.test(t)) return null
  if (/sequence pattern|term builder/i.test(t)) return { explorerId: 'series-guide' }
  if (/bound range slider|inequality region/i.test(t)) return { explorerId: 'quadratic', explorerPanels: ['inequality'] }
  if (/powers of ten|power-of-ten zoom/i.test(t)) return { explorerId: 'exponential' }
  if (/area model expansion|algebra tile/i.test(t)) return null
  if (/linear intersection solver|intersection point slider/i.test(t)) return { explorerId: 'line-intersection' }
  if (/discriminant slider|discriminant\/root slider/i.test(t)) return { explorerId: 'discriminant' }
  if (/line and curve intersection|tangency tester/i.test(t)) return { explorerId: 'line-intersection' }
  if (/proportion curve|direct and inverse proportion/i.test(t)) return { explorerId: 'linear-law' }
  if (/linear region shading|shaded inequality regions/i.test(t)) return { explorerId: 'quadratic', explorerPanels: ['inequality'] }
  if (/slope-intercept animator|gradient.*y-intercept/i.test(t)) return { explorerId: 'line-geometry', explorerPanels: ['forms'] }
  if (/perpendicular line constructor|perpendicular bisector/i.test(t)) return { explorerId: 'line-geometry', explorerPanels: ['parallel'] }
  if (/curve function morphulator|parabola morph/i.test(t)) return { explorerId: 'quadratic' }
  if (/kinematics journey|distance-time graph|speed-time graph/i.test(t)) return { explorerId: 'kinematics-guide', explorerPanels: ['graphs'] }
  if (/tangent slope tracer|zooming tangent/i.test(t)) return { explorerId: 'differentiation-guide', explorerPanels: ['gradient'] }
  if (/circle theorem|dynamic circle theorem/i.test(t)) return { explorerId: 'circle-line' }
  if (/3d net folder|scaling prism|3d solid/i.test(t)) return null
  if (/transformation matrix|symmetry matrix/i.test(t)) return null
  if (/unit circle|trig function wave|sine wave/i.test(combined)) return { explorerId: 'cast' }
  if (/financial growth|compound interest/i.test(t)) return { explorerId: 'exponential' }
  if (/area and circle|sector.*segment|arc stretcher/i.test(t)) return { explorerId: 'trig', explorerPanels: ['sector'] }
  if (/function machine/i.test(t)) return { explorerId: 'functions-guide', explorerPanels: ['composite'] }
  if (/histogram|box plot|scatter plot|cumulative frequency/i.test(t)) return null
  if (/probability spinner|tree diagram/i.test(t)) return { explorerId: 'pnc-guide' }
  if (/reuse explorer/i.test(t)) {
    if (/discriminant/i.test(t)) return { explorerId: 'discriminant' }
    if (/line and curve|intersection/i.test(t)) return { explorerId: 'line-intersection' }
    if (/trig demo|trigonometry graph/i.test(t)) return { explorerId: 'trig' }
    if (/cast|unit circle/i.test(t)) return { explorerId: 'cast' }
    if (/exponential|log/i.test(t)) return { explorerId: 'exponential' }
    if (/quadratic|completing the square/i.test(t)) return { explorerId: 'quadratic' }
    if (/modulus|absolute value/i.test(t)) return { explorerId: 'modulus' }
    if (/circle/i.test(t)) return { explorerId: 'circle-line' }
    if (/kinematics|distance.*time/i.test(t)) return { explorerId: 'kinematics-guide', explorerPanels: ['graphs'] }
    if (/differentiation|tangent/i.test(t)) return { explorerId: 'differentiation-guide', explorerPanels: ['gradient'] }
    if (/proportion|linear law/i.test(t)) return { explorerId: 'linear-law' }
    if (/permutation|combination|tree/i.test(t)) return { explorerId: 'pnc-guide' }
    if (/series|sequence|ap |gp /i.test(t)) return { explorerId: 'series-guide' }
    if (/coordinate|gradient|midpoint|parallel|perpendicular/i.test(t)) return { explorerId: 'line-geometry', explorerPanels: ['parallel'] }
  }

  return null
}
