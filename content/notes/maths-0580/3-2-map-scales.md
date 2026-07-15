## Core idea

Map scales establish the mathematical ratio that links dimensions on a scaled drawing or map to their actual real-world distances and geographic areas. Linear scale factors alter distances directly, whereas area scale factors change in proportion to the square of the linear scale factor. Use these relationships when converting scaled map paths to true navigation distances or calculating real territorial areas from structural map grids.

## Key formulas

$$
\text{Linear Scale Ratio:} \quad 1 : n \implies 1\text{ cm on map} = n\text{ cm in reality}
$$
$$
\text{Area Scale Relationship:} \quad (\text{Linear Scale Factor})^2 = \text{Area Scale Factor} \implies 1 : n^2
$$
$$
\text{Unit Conversions:} \quad 1\text{ km} = 100000\text{ cm}, \quad 1\text{ km}^2 = 10000000000\text{ cm}^2
$$

## Graphs & diagrams

<div class="ace-physics-diagram"><svg viewBox="0 0 360 100" width="360" height="100" role="img" aria-label="Map scale bar">
      <rect x="40" y="40" width="120" height="20" rx="3" fill="#f5edd8" stroke="#b59a73"/>
      <text x="100" y="55" text-anchor="middle" font-size="10" fill="#1a1a1a">2 cm on map</text>
      <text x="200" y="55" font-size="14" fill="#6b6b6b">→</text>
      <text x="280" y="55" text-anchor="middle" font-size="10" fill="#1a1a1a">1 km real</text>
      <text x="180" y="85" text-anchor="middle" font-size="10" fill="#6b6b6b">scale 1 : 50 000</text>
    </svg><p class="ace-physics-diagram__caption">Map scale — measure on the map, multiply by the scale factor to get real distance.</p></div>

## Steps / method

Identify the given linear map scale ratio, ensuring both sides are written using identical base units (usually centimeters).

To compute actual ground distances from map measurements, multiply the map distance by the linear scale factor $n$ and convert the resulting value into meters or kilometers.

To compute actual territorial areas from map areas, square the linear scale factor to obtain the area scale factor ($n^2$).

Multiply the map area by $n^2$, then convert the large raw value into real-world units like square meters ($\text{m}^2$) or square kilometers ($\text{km}^2$).

## Examiner tip

A common mistake on Paper 4 is multiplying a map area directly by the linear scale factor instead of its square. If a map scale is $1 : 50000$, then a $1\text{ cm}^2$ area on the map represents $50000^2\text{ cm}^2$ in reality, not $50000\text{ cm}^2$. Always square the linear scale before converting area units.

## Quick check

If a map scale is $1 : 20000$, then a map distance of $5\text{ cm}$ represents an actual real-world distance of exactly $1\text{ km}$.

## Worked example — Example 1 (June 2021 P41 Q3a)

A map has a linear scale of $1 : 25000$. Calculate the actual real-world distance, in kilometers, represented by a line measuring $8.4\text{ cm}$ on the map.

Multiply the map distance by the linear scale factor: $8.4 \times 25000 = 210000\text{ cm}$.

Convert centimeters to meters by dividing by $100$: $210000 \div 100 = 2100\text{ m}$.

Convert meters to kilometers by dividing by $1000$: $2100 \div 1000 = 2.1\text{ km}$.

## Worked example — Example 2 (Nov 2023 P42 Q5c)

A farm has an actual real-world area of $4.5\text{ km}^2$. On a map, this farm is represented by an area of $18\text{ cm}^2$. Find the linear scale of the map in the form $1 : n$.

Set up the raw area scale relationship: $18\text{ cm}^2 = 4.5\text{ km}^2$.

Simplify the relationship to find what $1\text{ cm}^2$ represents: $1\text{ cm}^2 = \frac{4.5}{18} = 0.25\text{ km}^2$.

Convert the real-world area units from square kilometers to square centimeters:$0.25\text{ km}^2 \times 1000000\text{ m}^2/\text{km}^2 \times 10000\text{ cm}^2/\text{m}^2 = 2500000000\text{ cm}^2$.

State the complete area scale ratio: $1\text{ cm}^2 : 2500000000\text{ cm}^2$.

Take the square root of both sides of the area scale ratio to find the linear scale factor $n$ when $2$. State the final linear scale: $1 : 50000$.
