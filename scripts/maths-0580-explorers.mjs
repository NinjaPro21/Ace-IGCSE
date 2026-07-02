/**
 * Curated explorer wiring for IGCSE Mathematics 0580.
 * Only where an interactive tool clearly matches the syllabus — not reused from unrelated topics.
 */
export const MATHS_0580_EXPLORERS = {
  // Calculator chapter (interactive by design)
  '0580-calc-key-layout': { explorerId: 'calculator-guide', explorerPanels: ['layout'] },
  '0580-calc-angle-modes': { explorerId: 'calculator-guide', explorerPanels: ['setup', 'modes'] },
  '0580-calc-logs-and-exam-tips': { explorerId: 'calculator-guide', explorerPanels: ['logs', 'tools'] },
  '1-9-calculator': { explorerId: 'calculator-guide', explorerPanels: ['layout', 'tools'] },

  // Algebra & graphs — direct match
  '1-4-sequences': { explorerId: 'series-guide', explorerPanels: ['ap', 'gp'] },
  '2-5-2-6-simultaneous-equations': { explorerId: 'line-geometry', explorerPanels: ['intersect'] },
  '6-1-factorising': { explorerId: 'quadratic', explorerPanels: ['graph'] },
  '6-2-6-3-quadratic-equations': { explorerId: 'discriminant' },
  '6-4-nonlinear-simultaneous-equations': { explorerId: 'line-intersection' },
  '8-3-proportion': { explorerId: 'linear-law' },
  '8-5-inequalities': { explorerId: 'quadratic', explorerPanels: ['inequality'] },

  // Trigonometry
  '4-1-pythagoras-theorem': { explorerId: 'right-triangle-guide', explorerPanels: ['pythagoras'] },
  '4-2-trigonometry': { explorerId: 'right-triangle-guide', explorerPanels: ['sohcahtoa'] },
  '4-3-4-5-bearings-scale-drawing': { explorerId: 'right-triangle-guide', explorerPanels: ['sohcahtoa'] },
  '4-6-three-dimensional-trigonometry': { explorerId: 'right-triangle-guide', explorerPanels: ['sine-rule', 'cosine-rule'] },
  '10-1-any-angle': { explorerId: 'cast' },
  '10-2-10-3-sine-cosine-rules': {
    explorerId: 'right-triangle-guide',
    explorerPanels: ['sine-rule', 'cosine-rule'],
  },

  // Mensuration & geometry
  '5-1-5-2-area-circles': { explorerId: 'shoelace' },
  '5-3-5-4-sector-segment-analysis': { explorerId: 'trig', explorerPanels: ['sector-deg'] },
  '7-3-circle-theorems': { explorerId: 'circle-line' },

  // Coordinate geometry & curves
  '9-1-linear-graphs': { explorerId: 'line-geometry', explorerPanels: ['forms'] },
  '9-3-equations-of-straight-lines': { explorerId: 'line-geometry', explorerPanels: ['parallel'] },
  '9-4-plotting-curves': {
    explorerId: 'curves-guide',
    explorerPanels: ['quadratic', 'cubic', 'exponential', 'reciprocal'],
  },
  '9-6-graphical-solutions': { explorerId: 'cubic', explorerPanels: ['trace'] },
  '9-7-differentiation': { explorerId: 'differentiation-guide', explorerPanels: ['gradient', 'tangent'] },
  '12-1-12-3-vectors': { explorerId: 'vectors-guide', explorerPanels: ['displacement', 'magnitude'] },

  // Sets, functions, statistics
  '11-1-11-2-sets-venn-diagrams': { explorerId: 'stats-guide', explorerPanels: ['venn'] },
  '11-3-11-4-functions': {
    explorerId: 'functions-guide',
    explorerPanels: ['types', 'mapping', 'composite', 'inverse'],
  },
  '13-1-13-3-data-displays-histograms': { explorerId: 'stats-guide', explorerPanels: ['histogram'] },
  '13-2-13-6-averages-comparison': { explorerId: 'stats-guide', explorerPanels: ['grouped-mean'] },
  '13-4-scatter-diagrams': { explorerId: 'stats-guide', explorerPanels: ['scatter'] },
  '13-5-cumulative-frequency-box-plots': { explorerId: 'stats-guide', explorerPanels: ['cumulative', 'boxplot'] },
  '14-1-14-3-probability-rules': { explorerId: 'stats-guide', explorerPanels: ['tree'] },
  '14-4-tree-diagrams': { explorerId: 'stats-guide', explorerPanels: ['tree'] },
  '14-5-14-6-advanced-probability': { explorerId: 'stats-guide', explorerPanels: ['tree'] },
}

export function resolveMaths0580Explorer(topicId) {
  return MATHS_0580_EXPLORERS[topicId] ?? null
}
