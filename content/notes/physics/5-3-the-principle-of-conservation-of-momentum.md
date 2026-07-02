## Core idea

Whether it is a train collision, a game of billiards, or the rhythmic clicking of a Newton’s cradle, the interactions between colliding objects follow a fundamental law of nature. The Principle of Conservation of Momentum allows us to predict the speeds and directions of objects after they hit each other, providing essential data for everything from accident reconstruction to space exploration.

## Key definitions

- **Momentum ($p$)**: The product of an object's mass and its velocity (SI unit: kilogram metre per second, kg m/s).
- **The Principle of Conservation of Momentum**: When two or more objects collide, the total momentum of the objects just before the collision is the same as the total momentum immediately after the collision, provided no external force acts on the system.
- **Vector Quantity**: A physical quantity that has both magnitude and direction, such as momentum or velocity.
- **Mass ($m$)**: A measure of the quantity of matter in an object at rest relative to the observer (SI unit: kg).
- **Velocity ($v$)**: Speed in a specified direction (SI unit: m/s).

## Key formulas

**Momentum of a single object**

$p = mv$

Applies to any object in motion to calculate its individual momentum2

**Conservation of Momentum (General)**

$\text{Total momentum before} = \text{Total momentum after}$

m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2

$$

Applies to collisions where objects separate after impact.

**Conservation of Momentum (Sticking together)**

$m_1 u_1 + m_2 u_2 = (m_1 + m_2)v$

Applies when objects collide and move together as a single mass with a common velocity ($v$).

## Graphs & diagrams

- **Newton's Cradle**: A classic demonstration where the momentum of a falling ball (Ball A) is transferred through stationary balls (B, C, D) to lift the final ball (Ball E). This shows that momentum is conserved and transferred through a system.
- **Collision Diagrams**: These usually show objects before impact with initial velocities ($u$) and after impact with final velocities ($v$).

<div class="enlight-physics-diagram"><svg viewBox="0 0 440 160" width="440" height="160" role="img" aria-label="Momentum vector diagram">
      <rect x="30" y="55" width="50" height="50" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="55" y="85" text-anchor="middle" font-size="11" fill="#1e3a8a">m</text>
      <line x1="90" y1="80" x2="200" y2="80" stroke="#2563eb" stroke-width="3" marker-end="url(#mv)"/>
      <text x="145" y="72" text-anchor="middle" font-size="11" fill="#2563eb">v</text>
      <line x1="210" y1="80" x2="340" y2="80" stroke="#dc2626" stroke-width="4" marker-end="url(#mp)"/>
      <text x="275" y="72" text-anchor="middle" font-size="12" fill="#dc2626" font-weight="600">p = mv</text>
      <text x="55" y="130" text-anchor="middle" font-size="10" fill="#64748b">object</text>
      <defs>
        <marker id="mv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="mp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
      </defs>
    </svg><p class="enlight-physics-diagram__caption">Momentum is a vector — $p = mv$ in the direction of velocity. Larger mass or speed means larger momentum.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 420 180" width="420" height="180" role="img" aria-label="Collision before and after">
      <text x="210" y="22" text-anchor="middle" font-size="11" fill="#334155">Before collision</text>
      <rect x="40" y="45" width="45" height="35" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="62" y="67" text-anchor="middle" font-size="10" fill="#1e3a8a">m₁</text>
      <line x1="95" y1="62" x2="155" y2="62" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cu)"/>
      <text x="125" y="55" font-size="10" fill="#2563eb">u₁</text>
      <rect x="170" y="45" width="45" height="35" rx="4" fill="#bbf7d0" stroke="#16a34a"/>
      <text x="192" y="67" text-anchor="middle" font-size="10" fill="#166534">m₂</text>
      <line x1="225" y1="62" x2="285" y2="62" stroke="#16a34a" stroke-width="2.5" marker-end="url(#cu)"/>
      <text x="255" y="55" font-size="10" fill="#16a34a">u₂</text>
      <text x="210" y="105" text-anchor="middle" font-size="11" fill="#334155">After collision</text>
      <rect x="60" y="125" width="45" height="35" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <line x1="115" y1="142" x2="175" y2="142" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv)"/>
      <text x="145" y="135" font-size="10" fill="#dc2626">v₁</text>
      <rect x="220" y="125" width="45" height="35" rx="4" fill="#bbf7d0" stroke="#16a34a"/>
      <line x1="275" y1="142" x2="335" y2="142" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv)"/>
      <text x="305" y="135" font-size="10" fill="#dc2626">v₂</text>
      <defs>
        <marker id="cu" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="cv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
      </defs>
    </svg><p class="enlight-physics-diagram__caption">Collision diagram — masses and velocities before impact ($u$) and after ($v$); total momentum is conserved.</p></div>

## Steps / method

Method for solving conservation of momentum problems:

Identify the system: Note the masses ($m$) and initial velocities ($u$) of all objects before the collision.

Assign directions: Because momentum is a vector, you must choose one direction (e.g., right) as positive (+). The opposite direction (left) must be negative (–).

Calculate total momentum before: Sum the individual momentums ($p = mu$) for all objects.

Express total momentum after: Write an expression using final velocities ($v$), keeping in mind if the objects stick together or move separately.

Equate and solve: Set "Total momentum before = Total momentum after" and solve for the unknown variable.

## Common mistakes

Ignoring Signs: Adding velocities together without considering direction (e.g., treating a leftward velocity as positive).

Sticking vs. Bouncing: Using the wrong formula for the "after" state (forgetting to combine masses if they stick).

External Forces: Forgetting that momentum is only conserved if there are no external forces like friction or air resistance acting on the objects.

## Examiner tip

Vector Notation: Always state your chosen positive direction at the start of your calculation to show the examiner you understand momentum is a vector.

Working Marks: Even if you get the final velocity wrong, you can earn marks for correctly stating the "total momentum before" or correctly applying the principle.

Units: Always provide the final unit. Velocity is in m/s; momentum is in kg m/s.

## Quick check

What is the standard SI unit for momentum?

Does the principle of conservation of momentum apply if an external force is acting on the objects?

If a 10 kg object moving at 2 m/s hits a wall and stops, was its momentum conserved within the object alone?

## Worked example — Objects Sticking Together

Question: Trolley A (2 kg) travelling at 2 m/s collides with stationary Trolley B (3 kg). They stick together. Calculate their final velocity.

1. Total momentum before = $(2\ \text{kg} \times 2\ \text{m/s}) + (3\ \text{kg} \times 0\ \text{m/s}) = 4\ \text{kg m/s}$.
2. Let final velocity be $v$. $(2 + 3)\ \text{kg} \times v = 5v$.
3. $5v = 4

$$\Rightarrow$  $2.

**Final answer:** $0.8\ \text{m/s}$ in the forward direction.

## Worked example — Recoil (Action and Reaction)

Question: Two ice skaters, A (80 kg) and B (50 kg), are stationary. They push off each other. Skater A moves right at 0.5 m/s. Calculate the velocity of Skater B.

1. (Identify) Total momentum before is zero because both are at rest.
2. (Assign signs) Right is positive (+). Skater A velocity = $+0.5\ \text{m/s}$.
3. (Calculate) $0 = (80 \times 0.5) + (50 \times v_B)

$$
\Rightarrow
$$2.
4. (Solve) $50v_B = -40 =

$$\Rightarrow$2.$

**Final answer:** $0.8\ \text{m/s}$ to the left (negative sign indicates opposite direction).
