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

Applies to any object in motion to calculate its individual momentum.

**Conservation of momentum (general)**

$\text{Total momentum before} = \text{Total momentum after}$

$$
m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2
$$

Applies to collisions where objects separate after impact.

**Conservation of momentum (sticking together)**

$m_1 u_1 + m_2 u_2 = (m_1 + m_2)v$

Applies when objects collide and move together as a single mass with common velocity $v$.

## Graphs & diagrams

**Newton's cradle**

- Ball A swings in and collides with stationary balls B–E.
- Momentum is transferred through the middle balls without them moving far.
- Ball F swings out with the same speed — total momentum is conserved.

<div class="ace-physics-diagram"><svg viewBox="0 0 440 200" width="440" height="200" role="img" aria-label="Newton's cradle">
      <line x1="30" y1="30" x2="410" y2="30" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="30" x2="80" y2="95" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="140" y1="30" x2="140" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="200" y1="30" x2="200" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="260" y1="30" x2="260" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="320" y1="30" x2="320" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="380" y1="30" x2="380" y2="95" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="80" cy="108" r="22" fill="#2563eb" stroke="#1e40af" stroke-width="1.5"/>
      <text x="80" y="113" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">A</text>
      <circle cx="140" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="140" y="93" text-anchor="middle" font-size="10" fill="#334155">B</text>
      <circle cx="200" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="200" y="93" text-anchor="middle" font-size="10" fill="#334155">C</text>
      <circle cx="260" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="260" y="93" text-anchor="middle" font-size="10" fill="#334155">D</text>
      <circle cx="320" cy="88" r="22" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="320" y="93" text-anchor="middle" font-size="10" fill="#334155">E</text>
      <circle cx="380" cy="108" r="22" fill="#16a34a" stroke="#15803d" stroke-width="1.5"/>
      <text x="380" y="113" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">F</text>
      <path d="M80 108 Q55 108 55 140" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#nc-arr)"/>
      <path d="M380 108 Q405 108 405 140" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#nc-arr2)"/>
      <text x="55" y="158" font-size="9" fill="#2563eb">swings in</text>
      <text x="405" y="158" text-anchor="end" font-size="9" fill="#16a34a">swings out</text>
      <text x="220" y="182" text-anchor="middle" font-size="10" fill="#475569">momentum transferred A → F; total momentum conserved</text>
      <defs>
        <marker id="nc-arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="nc-arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#16a34a"/></marker>
      </defs>
    </svg><p class="ace-physics-diagram__caption">Newton's cradle — momentum is transferred through stationary balls; the last ball swings out with the same speed.</p></div>

**Collision diagrams**

- Show masses and velocities **before** impact ($u$) and **after** ($v$).
- Choose a positive direction and use +/− signs for vector momentum.

<div class="ace-physics-diagram"><svg viewBox="0 0 440 200" width="440" height="200" role="img" aria-label="Collision before and after">
      <text x="220" y="22" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Before collision</text>
      <rect x="50" y="48" width="48" height="36" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
      <text x="74" y="70" text-anchor="middle" font-size="10" fill="#1e3a8a">m₁</text>
      <line x1="102" y1="66" x2="168" y2="66" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cu53)"/>
      <text x="135" y="58" text-anchor="middle" font-size="10" fill="#2563eb">u₁</text>
      <rect x="175" y="48" width="48" height="36" rx="4" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
      <text x="199" y="70" text-anchor="middle" font-size="10" fill="#166534">m₂</text>
      <line x1="227" y1="66" x2="275" y2="66" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="251" y="58" text-anchor="middle" font-size="9" fill="#64748b">u₂ = 0</text>
      <line x1="223" y1="48" x2="223" y2="90" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 2"/>
      <text x="223" y="100" text-anchor="middle" font-size="8" fill="#dc2626">contact</text>
      <line x1="40" y1="108" x2="400" y2="108" stroke="#cbd5e1" stroke-width="1"/>
      <text x="220" y="128" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">After collision</text>
      <rect x="70" y="140" width="48" height="36" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
      <text x="94" y="162" text-anchor="middle" font-size="10" fill="#1e3a8a">m₁</text>
      <line x1="122" y1="158" x2="175" y2="158" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv53)"/>
      <text x="148" y="150" text-anchor="middle" font-size="10" fill="#dc2626">v₁</text>
      <rect x="250" y="140" width="48" height="36" rx="4" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
      <text x="274" y="162" text-anchor="middle" font-size="10" fill="#166534">m₂</text>
      <line x1="302" y1="158" x2="365" y2="158" stroke="#dc2626" stroke-width="2.5" marker-end="url(#cv53)"/>
      <text x="333" y="150" text-anchor="middle" font-size="10" fill="#dc2626">v₂</text>
      <text x="220" y="192" text-anchor="middle" font-size="9" fill="#64748b">m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂</text>
      <defs>
        <marker id="cu53" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
        <marker id="cv53" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
      </defs>
    </svg><p class="ace-physics-diagram__caption">Collision diagram — masses and velocities before impact ($u$) and after ($v$); total momentum is conserved.</p></div>

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

1. **Momentum before:** $(2 \times 2) + (3 \times 0) = 4\ \text{kg m/s}$.

2. **Momentum after:** $(2 + 3) \times v = 5v$.

3. **Conserve momentum:** $5v = 4$

$$
v = 0.8\ \text{m/s}
$$

**Final answer:** $0.8\ \text{m/s}$ in the forward direction.

## Worked example — Recoil (Action and Reaction)

Question: Two ice skaters, A (80 kg) and B (50 kg), are stationary. They push off each other. Skater A moves right at 0.5 m/s. Calculate the velocity of Skater B.

1. **Momentum before:** $0$ (both at rest).

2. **Assign signs:** right is positive; $v_A = +0.5\ \text{m/s}$.

3. **Conserve momentum:** $0 = (80 \times 0.5) + (50 \times v_B)$.

4. **Solve:** $50v_B = -40$

$
v_B = -0.8\ \text{m/s}
$

**Final answer:** $0.8\ \text{m/s}$ to the left.
