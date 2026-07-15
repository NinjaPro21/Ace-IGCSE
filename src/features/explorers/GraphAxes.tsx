import { GRAPH } from './graphTheme'

export interface GraphMapper {
  width: number
  height: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  toX: (x: number) => number
  toY: (y: number) => number
}

export function createGraphMapper(
  width: number,
  height: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): GraphMapper {
  return {
    width,
    height,
    xMin,
    xMax,
    yMin,
    yMax,
    toX: (x) => ((x - xMin) / (xMax - xMin)) * width,
    toY: (y) => height - ((y - yMin) / (yMax - yMin)) * height,
  }
}

function pickTicks(min: number, max: number, target = 5): number[] {
  const span = max - min
  if (span <= 0) return [0]
  let step = span / target
  const mag = 10 ** Math.floor(Math.log10(step))
  const norm = step / mag
  if (norm <= 1) step = mag
  else if (norm <= 2) step = 2 * mag
  else if (norm <= 5) step = 5 * mag
  else step = 10 * mag

  const ticks: number[] = []
  const start = Math.ceil(min / step) * step
  for (let v = start; v <= max + step * 0.01; v += step) {
    if (v >= min - step * 0.01 && v <= max + step * 0.01) {
      ticks.push(Math.abs(v) < 1e-9 ? 0 : Number(v.toFixed(6)))
    }
  }
  return ticks.length ? ticks : [0]
}

function formatTick(n: number): string {
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1).replace(/\.0$/, '')
}

interface GraphAxesProps {
  mapper: GraphMapper
  gridX?: number
  gridY?: number
}

/** Grid lines, x/y axes with arrow hints, axis labels, and numeric ticks. */
export function GraphAxes({ mapper, gridX = 10, gridY = 10 }: GraphAxesProps) {
  const { width, height, xMin, xMax, yMin, yMax, toX, toY } = mapper
  const xTicks = pickTicks(xMin, xMax)
  const yTicks = pickTicks(yMin, yMax)
  const originX = toX(0)
  const originY = toY(0)
  const originVisible = originX >= 0 && originX <= width && originY >= 0 && originY <= height

  return (
    <g className="ace-graph-axes">
      {[...Array(gridX + 1)].map((_, i) => {
        const x = xMin + (i * (xMax - xMin)) / gridX
        return (
          <line
            key={`gv${i}`}
            x1={toX(x)}
            y1={0}
            x2={toX(x)}
            y2={height}
            stroke={GRAPH.grid}
            strokeWidth={1}
          />
        )
      })}
      {[...Array(gridY + 1)].map((_, i) => {
        const y = yMin + (i * (yMax - yMin)) / gridY
        return (
          <line
            key={`gh${i}`}
            x1={0}
            y1={toY(y)}
            x2={width}
            y2={toY(y)}
            stroke={GRAPH.grid}
            strokeWidth={1}
          />
        )
      })}

      {originVisible && (
        <>
          <line x1={originX} y1={0} x2={originX} y2={height} stroke={GRAPH.axis} strokeWidth={1.5} />
          <line x1={0} y1={originY} x2={width} y2={originY} stroke={GRAPH.axis} strokeWidth={1.5} />
          <text x={originX + 6} y={12} fill={GRAPH.label} fontSize={11} fontWeight={600}>
            y
          </text>
          <text x={width - 10} y={originY - 6} fill={GRAPH.label} fontSize={11} fontWeight={600}>
            x
          </text>
        </>
      )}

      {xTicks
        .filter((n) => n !== 0)
        .map((n) => (
          <g key={`xt${n}`}>
            <line
              x1={toX(n)}
              y1={originVisible ? originY - 4 : height - 8}
              x2={toX(n)}
              y2={originVisible ? originY + 4 : height}
              stroke={GRAPH.axis}
              strokeWidth={1}
            />
            <text
              x={toX(n)}
              y={originVisible ? originY + 16 : height - 2}
              textAnchor="middle"
              fill={GRAPH.label}
              fontSize={9}
            >
              {formatTick(n)}
            </text>
          </g>
        ))}

      {yTicks
        .filter((n) => n !== 0)
        .map((n) => (
          <g key={`yt${n}`}>
            <line
              x1={originVisible ? originX - 4 : 0}
              y1={toY(n)}
              x2={originVisible ? originX + 4 : 8}
              y2={toY(n)}
              stroke={GRAPH.axis}
              strokeWidth={1}
            />
            <text
              x={originVisible ? originX - 8 : 4}
              y={toY(n) + 3}
              textAnchor="end"
              fill={GRAPH.label}
              fontSize={9}
            >
              {formatTick(n)}
            </text>
          </g>
        ))}

      {originVisible && (
        <text x={originX - 8} y={originY + 14} textAnchor="end" fill={GRAPH.label} fontSize={9}>
          0
        </text>
      )}
    </g>
  )
}
