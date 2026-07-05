## Core idea

Bearings are directional navigation angles measured in degrees. They are always calculated starting from a reference line pointing due North, measured moving in a clockwise direction, and written using a three-digit format (e.g., $045^\circ$). Use bearings alongside scale drawings to map navigation paths, chart travel legs, and determine relative positions.

## Key formulas

$$
\text{Reverse bearing} = \text{Forward bearing} \pm 180^\circ
$$

(Add $180^\circ$ if the forward bearing is less than $180^\circ$; subtract $180^\circ$ if it is greater than $180^\circ$.)

$$
\text{Interior angle between two legs} = |\text{bearing}_2 - \text{back bearing of leg}_1|
$$

## Graphs & diagrams

<div class="enlight-physics-diagram"><svg viewBox="0 0 260 260" width="260" height="260" role="img" aria-label="Forward bearing measured clockwise from North">
      <circle cx="130" cy="140" r="90" fill="none" stroke="#e8e2d8"/>
      <line x1="130" y1="140" x2="130" y2="40" stroke="#5b8def" stroke-width="2"/>
      <text x="130" y="32" text-anchor="middle" font-size="12" fill="#5b8def" font-weight="700">N</text>
      <line x1="130" y1="140" x2="210" y2="90" stroke="#b59a73" stroke-width="2.5"/>
      <path d="M130 70 A70 70 0 0 1 186 98" fill="none" stroke="#b59a73" stroke-width="1.5"/>
      <text x="168" y="72" font-size="12" fill="#b59a73" font-weight="700">θ</text>
      <text x="175" y="118" font-size="11" fill="#b59a73">bearing</text>
      <circle cx="130" cy="140" r="4" fill="#a8a29e"/>
      <text x="130" y="250" text-anchor="middle" font-size="11" fill="#6b6b6b">Clockwise from North</text>
    </svg><p class="enlight-physics-diagram__caption">Forward bearing — always measured clockwise from North, written as three digits (e.g. $045°$).</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 380 260" width="380" height="260" role="img" aria-label="Forward and reverse bearings with parallel North lines">
      <line x1="70" y1="210" x2="70" y2="30" stroke="#5b8def" stroke-width="2"/>
      <text x="70" y="22" text-anchor="middle" font-size="12" fill="#5b8def" font-weight="700">N</text>
      <line x1="290" y1="70" x2="290" y2="20" stroke="#5b8def" stroke-width="2"/>
      <text x="290" y="14" text-anchor="middle" font-size="12" fill="#5b8def" font-weight="700">N</text>
      <line x1="70" y1="210" x2="290" y2="70" stroke="#b59a73" stroke-width="2.5"/>
      <circle cx="70" cy="210" r="4" fill="#a8a29e"/>
      <circle cx="290" cy="70" r="4" fill="#a8a29e"/>
      <text x="52" y="228" font-size="13" fill="#6b6b6b" font-weight="700">A</text>
      <text x="302" y="66" font-size="13" fill="#6b6b6b" font-weight="700">B</text>
      <!-- θ at A: clockwise from North to AB -->
      <path d="M70 160 A50 50 0 0 1 112 178" fill="none" stroke="#789671" stroke-width="2"/>
      <text x="92" y="152" font-size="13" fill="#789671" font-weight="700">θ</text>
      <!-- θ+180° at B: clockwise from North all the way to BA -->
      <path d="M290 30 A40 40 0 1 1 256 94" fill="none" stroke="#b59a73" stroke-width="2"/>
      <text x="318" y="120" font-size="12" fill="#b59a73" font-weight="700">θ+180°</text>
      <text x="190" y="248" text-anchor="middle" font-size="12" fill="#6b6b6b">A→B: θ · B→A: θ ± 180°</text>
    </svg><p class="enlight-physics-diagram__caption">Reverse (back) bearing — draw a North line at $B$, then use $\theta \pm 180°$. Parallel North lines make co-interior angles easy to read.</p></div>

<div class="enlight-physics-diagram"><svg viewBox="0 0 340 290" width="340" height="290" role="img" aria-label="Two-leg journey and interior angle from bearings">
      <line x1="50" y1="190" x2="50" y2="28" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="50" y="20" text-anchor="middle" font-size="12" fill="#5b8def" font-weight="700">N</text>
      <line x1="170" y1="120" x2="170" y2="28" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="170" y="20" text-anchor="middle" font-size="12" fill="#5b8def" font-weight="700">N</text>
      <line x1="50" y1="190" x2="170" y2="120" stroke="#5b8def" stroke-width="2.5"/>
      <line x1="170" y1="120" x2="240" y2="241" stroke="#b59a73" stroke-width="2.5"/>
      <circle cx="50" cy="190" r="4" fill="#a8a29e"/>
      <circle cx="170" cy="120" r="4" fill="#a8a29e"/>
      <circle cx="240" cy="241" r="4" fill="#a8a29e"/>
      <text x="34" y="208" font-size="13" fill="#6b6b6b" font-weight="700">P</text>
      <text x="182" y="112" font-size="13" fill="#6b6b6b" font-weight="700">Q</text>
      <text x="250" y="252" font-size="13" fill="#6b6b6b" font-weight="700">R</text>
      <path d="M50 145 A45 45 0 0 1 89 168" fill="none" stroke="#5b8def" stroke-width="2"/>
      <text x="72" y="142" font-size="12" fill="#5b8def" font-weight="700">060°</text>
      <path d="M170 75 A45 45 0 0 1 193 159" fill="none" stroke="#b59a73" stroke-width="2"/>
      <text x="198" y="70" font-size="12" fill="#b59a73" font-weight="700">150°</text>
      <path d="M148 133 A26 26 0 0 1 183 143" fill="none" stroke="#789671" stroke-width="2"/>
      <text x="148" y="162" font-size="13" fill="#789671" font-weight="700">90°</text>
      <text x="170" y="278" text-anchor="middle" font-size="12" fill="#6b6b6b">Interior angle at Q from the two bearings</text>
    </svg><p class="enlight-physics-diagram__caption">Two-leg journey — at the turn point, find the interior angle of triangle $PQR$ from the bearings, then use Pythagoras, SOH CAH TOA, or the cosine rule for the direct distance $PR$.</p></div>

## Steps / method

Locate the starting point of the bearing calculation (the point following the word "from" in the question text) and draw a vertical line pointing due North at that position.

Place the center of a protractor on this starting point, align the $000^\circ$ mark with your North line, and measure the angle moving clockwise.

State all final bearings using a three-digit format, adding leading zeros if the angle is less than $100^\circ$ (e.g. $65^\circ$ becomes $065^\circ$).

To calculate a return or reverse bearing back to the start, add $180^\circ$ if the forward bearing is less than $180^\circ$, or subtract $180^\circ$ if it is greater than $180^\circ$.

## Examiner tip

Always look for the word "from" in bearing questions, as it tells you exactly where to draw your North line. Measuring from the wrong point is a very frequent error on Paper 2.

## Quick check

If the directional bearing from town $A$ to $B$ is $070^\circ$, the bearing of $A$ from $B$ is $250^\circ$.

## Worked example — Example 1 (June 2022 P22 Q2)

Ship $X$ is on a bearing of $042^\circ$ from $Y$. Determine the bearing of $Y$ from $X$.

Identify the given forward bearing: $\text{Bearing} = 042^\circ$.

Check if the angle is less than or greater than $180^\circ$: $42^\circ < 180^\circ$.

Apply the reverse bearing rule by adding $180^\circ$.

Calculate the sum to find the return bearing: $\text{Reverse Bearing} = 222^\circ$.

## Worked example — Example 2 (Nov 2023 P42 Q21)

A surveyor maps three posts. Post $B$ is on a bearing of $120^\circ$ from $A$, and $C$ is on a bearing of $210^\circ$ from $B$. Distance $AB = 5\text{ km}$ and $BC = 12\text{ km}$. Calculate the direct distance from $A$ to $C$.

Sketch the positions of the posts using parallel North lines at each point.

Find the interior angle $\angle ABC$: back bearing of $A$ from $B$ is $120^\circ + 180^\circ = 300^\circ$, and bearing $B$ to $C$ is $210^\circ$, so $\angle ABC = 300^\circ - 210^\circ = 90^\circ$.

Since triangle $ABC$ is right-angled at $B$, use $a^2 + b^2 = c^2$ to find $AC$.

Calculate the distance: $AC = \sqrt{5^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13\text{ km}$.
