## Core idea

Have you ever wondered why cars are designed with crumple zones or why you instinctively bend your knees when landing from a jump? These safety features are practical applications of the relationship between force, time, and momentum. By understanding how to manipulate the time over which a change in momentum occurs, we can significantly reduce the impact of forces in collisions, saving lives in real-world scenarios like car crashes or sports.

## Key definitions

- **Impulse**: The product of force and the period of time for which the force acts. (SI unit: newton second, N s).
- **Resultant Force**: The change in momentum per unit time. (SI unit: newton, N).
- **Momentum ($p$)**: The product of mass and velocity. (SI unit: kilogram metre per second, kg m/s).
- **Vector Quantity**: A quantity that has both magnitude and direction, such as momentum, impulse, and force.

## Key formulas

**Impulse**

$\text{Impulse} = F\Delta t$

Used to calculate the "kick" or "jolt" an object receives.

**Impulse–momentum relationship**

$$
F\Delta t = \Delta p
$$

Applies when a force acts over a time interval to change an object's momentum.

**Resultant force**

$F = \frac{\Delta p}{\Delta t}$

Used to find the average force acting on an object; this is equivalent to $F = ma$ when the mass is constant.

**Change in momentum**

$\Delta p = mv - mu$

Where $u$ is initial velocity and $v$ is final velocity.

## Graphs & diagrams

**Impulse and safety**

- A **large force** over a **short time** gives the same impulse as a **small force** over a **long time**.
- **Crumple zones** and **seatbelts** increase stopping time $\Delta t$, which reduces the average force $F$ for the same $\Delta p$.

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

## Steps / method

Method for solving impulse and force questions:

Identify the vectors: Note the direction of the initial and final velocities.

Assign signs: Choose one direction as positive (+) and the opposite as negative (–).

Calculate change in momentum ($\Delta p$): Use $\Delta p = m(v - u)$. Be careful with signs if the object bounces back.

Determine the unknown: Use $F\Delta t = \Delta p$ to solve for force ($F$) or time ($\Delta t$).

Analyze safety: If asked about safety features, explain that increasing $\Delta t$ for the same $\Delta p$ results in a smaller $F$.

## Common mistakes

Ignoring signs: Treating velocity as a scalar. If a ball hits a wall at $+5\ \text{m/s}$ and bounces back at $-5\ \text{m/s}$, the change is $10\ \text{m/s}$, not $0$.

Unit Units: Mixing up impulse (N s) and momentum (kg m/s). While numerically equivalent, always check which quantity the question asks for.

Force Misconception: Believing a "bigger impulse" always means a "bigger force." A small force acting for a long time can create the same impulse as a large force acting for a short time.

## Examiner tip

Safety Explanations: When explaining crumple zones or seatbelts, use the phrase "increases the time taken for the momentum to change to zero, which reduces the force".

Vector Symbols: Always include the direction or sign (+/–) when dealing with velocities in opposite directions to secure marks for vector handling.

Show formulae: Write $F = \Delta p / \Delta t$ before substituting to ensure partial credit.

## Quick check

What is the SI unit for impulse?

How is resultant force defined in terms of momentum?

Does increasing the stopping time of a car increase or decrease the average force acting on the passengers?

## Worked example — Kicking a Ball

Question: A boy kicks a stationary 0.4 kg ball with an average force of 100 N. The ball reaches 5 m/s. Calculate the time of contact between the boot and the ball.

1. Identify values: $m = 0.4\ \text{kg}$, $u = 0\ \text{m/s}$, $v = 5\ \text{m/s}$, $F = 100\ \text{N}$.

2. **Change in momentum:** $\Delta p = mv - mu = (0.4 \times 5) - 0 = 2\ \text{kg m/s}$.

3. **Rearrange:** $\Delta t =$\Delta p / F = 2 / 100 = 0.02\ \text{s}$.$

**Final answer:** $0.02\ \text{s}$.

## Worked example — The Car Crash (Multi-step)

Question: A $1250\ \text{kg}$ car travelling at $7.2\ \text{m/s}$ hits a wall and stops in $0.4\ \text{s}$. Calculate the average force. Take forward as positive (+).

1. **Initial momentum:** $p_{\text{initial}} = 1250 \times 7.2 = 90\,000\ \text{kg m/s}$.

2. **Change in momentum:** $\Delta p = 0 - 90\,000 = -90\,000\ \text{kg m/s}$.

3. **Average force:** $F =$\Delta p / \Delta t = -90\,000 / 0.4 = -225\,000\ \text{N}$.$

**Final answer:** $225\,000\ \text{N}$ backward (opposite to the car's motion).

### Common Trap

Students often forget the negative sign, which indicates the force acts opposite to the car's motion.
