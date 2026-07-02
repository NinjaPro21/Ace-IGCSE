/**
 * Curated explorer wiring for Additional Mathematics 0606 — gaps & legacy topic ids.
 */
export const ADD_MATHS_0606_EXPLORERS = {
  // Ch1 Functions
  '1-inverse-functions-and-their-graphs': { explorerId: 'functions-guide', explorerPanels: ['inverse'] },
  '4-solving-equations-of-the-form-f-x-g-x': { explorerId: 'modulus', explorerPanels: ['fx-gx'] },
  '4-solving-modulus-inequalities': { explorerId: 'modulus', explorerPanels: ['inequality'] },

  // Ch2 Quadratics
  '2-quadratic-inequalities': { explorerId: 'quadratic', explorerPanels: ['inequality'] },

  // Ch3 Polynomials
  '3-1-adding-subtracting-and-multiplying-polynomials': { explorerId: 'cubic', explorerPanels: ['factor'] },
  '3-adding-subtracting-and-multiplying-polynomials': { explorerId: 'cubic', explorerPanels: ['factor'] },
  '3-division-of-polynomials': { explorerId: 'poly-division' },
  '3-the-factor-theorem': { explorerId: 'cubic', explorerPanels: ['factor'] },
  '3-5-the-remainder-theorem-harder-topic': { explorerId: 'cubic', explorerPanels: ['factor'] },
  '3-the-remainder-theorem': { explorerId: 'cubic', explorerPanels: ['factor'] },
  '3-cubic-expressions-and-equations': { explorerId: 'cubic', explorerPanels: ['trace'] },

  // Ch5 Logs & exponentials
  '5-1-introduction-to-logarithms': { explorerId: 'log' },
  '5-2-laws-of-logarithms-harder-topic': { explorerId: 'log' },
  '5-change-of-base-of-logarithms': { explorerId: 'log' },
  '5-logarithmic-equations': { explorerId: 'log' },

  // Ch6 Coordinate geometry
  '6-equations-of-straight-lines': { explorerId: 'line-geometry', explorerPanels: ['forms'] },
  '6-midpoint-parallel-and-perpendicular-lines': { explorerId: 'line-geometry', explorerPanels: ['parallel'] },
  '6-linear-law-converting-non-linear-to-linear-for': { explorerId: 'linear-law' },

  // Ch8 Circular measure (canonical chapter topic)
  '8-arc-length-and-area-of-a-sector-radians': { explorerId: 'trig', explorerPanels: ['sector'] },

  // Ch10 P&C
  '10-1-factorial-notation': { explorerId: 'pnc-guide' },
  '10-3-permutations-harder-topic': { explorerId: 'pnc-guide' },

  // Ch11 Series
  '11-2-the-binomial-theorem-harder-topic': { explorerId: 'series-guide', explorerPanels: ['binomial'] },
  '11-6-further-arithmetic-and-geometric-series': { explorerId: 'series-guide', explorerPanels: ['ap', 'gp'] },

  // Ch12 Differentiation
  '12-2-the-chain-rule-harder-topic': { explorerId: 'differentiation-guide', explorerPanels: ['chain'] },
  '12-3-the-product-rule-harder-topic': { explorerId: 'differentiation-guide', explorerPanels: ['product'] },
  '12-4-the-quotient-rule-harder-topic': { explorerId: 'differentiation-guide', explorerPanels: ['quotient'] },
  '12-8-second-derivatives': { explorerId: 'differentiation-guide', explorerPanels: ['optimization'] },

  // Ch14 Transcendental derivatives
  '14-1-derivatives-of-exponential-functions': { explorerId: 'differentiation-guide', explorerPanels: ['exponential'] },
  '14-2-derivatives-of-logarithmic-functions-harder-topic': { explorerId: 'differentiation-guide', explorerPanels: ['logarithm'] },
  '14-3-derivatives-of-trigonometric-functions-harder-topic': { explorerId: 'differentiation-guide', explorerPanels: ['trig'] },
  '14-4-further-applications-of-differentiation-harder-topic': { explorerId: 'differentiation-guide', explorerPanels: ['optimization'] },

  // Ch15 Integration (truncated id in content)
  '15-6-integration-of': { explorerId: 'integration-guide', explorerPanels: ['indefinite'] },
}

export function resolveAddMaths0606Explorer(topicId) {
  return ADD_MATHS_0606_EXPLORERS[topicId] ?? null
}
