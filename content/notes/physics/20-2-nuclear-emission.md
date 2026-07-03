## Core idea

Whether it is a smoke detector in your hallway or a scanner in a hospital, nuclear emissions play a vital role in modern safety and medicine. These emissions—alpha, beta, and gamma—are the results of unstable nuclei seeking stability. By understanding their unique "personalities," such as how easily they turn atoms into ions or what materials are needed to stop them, you can master the principles of nuclear safety and predict how radiation behaves in electric and magnetic fields.

## Key definitions

- **Ionising Radiation**: Radiation with high energies that can knock off electrons from atoms to form ions.
- **Alpha ($\alpha$) particle**: A particle consisting of two protons and two neutrons tightly bound together without any orbiting electrons; it is identical to a helium nucleus.
- **Beta ($\beta$) particle**: A fast-moving electron ejected from a radioactive nucleus.
- **Gamma ($\gamma$) ray**: High-energy electromagnetic radiation emitted by a nucleus with excess energy.
- **Penetrating Ability**: A measure of how far radiation can travel through a material before being absorbed.

**Table 20.2 — Properties of alpha, beta and gamma radiation**

| Emission Type | Nature | Relative Charge | Relative Mass | Ionising Effect | Penetrating Ability |
|---|---|---|---|---|---|
| Alpha ($\alpha$) | Helium nucleus | $+2$ | $4$ | Highest | Least (stopped by paper) |
| Beta ($\beta$) | Fast electron | $-1$ | $\frac{1}{2000}$ | Medium | Medium (stopped by few mm Al) |
| Gamma ($\gamma$) | EM wave | $0$ | $0$ | Least | Highest (stopped by cm of lead) |

## Graphs & diagrams

**Penetration diagram (Table 20.2)**

- $\alpha$ is stopped by a thin sheet of paper.
- $\beta$ passes through paper but is stopped by 3–5 mm of aluminium.
- $\gamma$ passes through both but is significantly reduced by several cm of lead or thick concrete.

<div class="enlight-physics-diagram enlight-physics-diagram--hero"><svg viewBox="0 0 520 220" width="520" height="220" role="img" aria-label="Penetration of alpha beta and gamma radiation">
      <defs>
        <marker id="pen-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker>
        <marker id="pen-stop" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M2,2 L8,8 M8,2 L2,8" stroke="#dc2626" stroke-width="2" fill="none"/></marker>
      </defs>
      <text x="260" y="18" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">Penetrating power — α, β and γ</text>
      <circle cx="36" cy="110" r="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <text x="36" y="114" text-anchor="middle" font-size="8" fill="#854d0e">source</text>
      <line x1="56" y1="52" x2="128" y2="52" stroke="#dc2626" stroke-width="3" marker-end="url(#pen-stop)"/>
      <text x="68" y="44" font-size="11" fill="#dc2626" font-weight="600">α</text>
      <rect x="132" y="38" width="8" height="28" rx="1" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
      <text x="136" y="78" text-anchor="middle" font-size="9" fill="#64748b">paper</text>
      <text x="148" y="56" font-size="8" fill="#dc2626">stopped</text>
      <line x1="56" y1="110" x2="208" y2="110" stroke="#2563eb" stroke-width="3" marker-end="url(#pen-stop)"/>
      <text x="68" y="102" font-size="11" fill="#2563eb" font-weight="600">β</text>
      <rect x="132" y="96" width="8" height="28" rx="1" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" opacity="0.5"/>
      <rect x="212" y="94" width="12" height="32" rx="1" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <text x="218" y="140" text-anchor="middle" font-size="9" fill="#64748b">Al</text>
      <text x="232" y="114" font-size="8" fill="#2563eb">stopped</text>
      <line x1="56" y1="168" x2="500" y2="168" stroke="#7c3aed" stroke-width="3" marker-end="url(#pen-arr)"/>
      <text x="68" y="160" font-size="11" fill="#7c3aed" font-weight="600">γ</text>
      <rect x="132" y="154" width="8" height="28" rx="1" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" opacity="0.35"/>
      <rect x="212" y="152" width="12" height="32" rx="1" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5" opacity="0.35"/>
      <rect x="360" y="146" width="22" height="44" rx="2" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
      <text x="371" y="202" text-anchor="middle" font-size="9" fill="#64748b">lead</text>
      <line x1="382" y1="168" x2="500" y2="168" stroke="#7c3aed" stroke-width="2" stroke-dasharray="6 4" opacity="0.55"/>
      <text x="430" y="158" font-size="8" fill="#7c3aed">reduced</text>
    </svg><p class="enlight-physics-diagram__caption">Penetrating power — α stopped by paper; β by a few mm of aluminium; γ reduced by thick lead or concrete.</p></div>

**Electric field deflection**

- In a strong electric field, $\alpha$-particles ($+2$) are attracted toward the negative plate; $\beta$-particles ($-1$) are attracted toward the positive plate.
- $\beta$-particles deflect more than $\alpha$-particles because they have a much smaller mass.
- $\gamma$-rays carry no charge and travel straight through.

<div class="enlight-physics-diagram"><svg viewBox="0 0 480 200" width="480" height="200" role="img" aria-label="Electric field deflection of alpha and beta">
      <rect x="60" y="28" width="360" height="8" rx="2" fill="#fecaca" stroke="#dc2626"/>
      <text x="240" y="24" text-anchor="middle" font-size="10" fill="#dc2626" font-weight="600">+ plate</text>
      <rect x="60" y="164" width="360" height="8" rx="2" fill="#bfdbfe" stroke="#2563eb"/>
      <text x="240" y="188" text-anchor="middle" font-size="10" fill="#2563eb" font-weight="600">− plate</text>
      <line x1="20" y1="100" x2="80" y2="100" stroke="#64748b" stroke-width="2"/>
      <text x="12" y="104" font-size="8" fill="#64748b">beam</text>
      <path d="M80 100 Q200 128 420 148" fill="none" stroke="#dc2626" stroke-width="2.5" marker-end="url(#ef-arr)"/>
      <text x="300" y="142" font-size="10" fill="#dc2626" font-weight="600">α → − plate</text>
      <path d="M80 100 Q200 72 420 52" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#ef-arr)"/>
      <text x="300" y="58" font-size="10" fill="#2563eb" font-weight="600">β → + plate</text>
      <line x1="80" y1="100" x2="420" y2="100" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.7"/>
      <text x="430" y="104" font-size="9" fill="#7c3aed">γ</text>
      <defs><marker id="ef-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg><p class="enlight-physics-diagram__caption">Electric field — charged α and β curve toward opposite plates; γ (uncharged) is undeflected.</p></div>

**Magnetic field deflection**

- $\alpha$ and $\beta$ particles are deflected in opposite directions in a magnetic field.
- Use Fleming's Left-Hand Rule: for $\beta$ (an electron), the conventional current is opposite to its motion.
- $\beta$ has a much sharper curve than $\alpha$ because it is far less massive.

<div class="enlight-physics-diagram"><svg viewBox="0 0 480 220" width="480" height="220" role="img" aria-label="Magnetic field deflection of alpha and beta">
      <text x="240" y="22" text-anchor="middle" font-size="11" fill="#334155" font-weight="700">B into page ⊗</text>
      <circle cx="90" cy="70" r="3" fill="#64748b"/><circle cx="130" cy="55" r="3" fill="#64748b"/><circle cx="170" cy="80" r="3" fill="#64748b"/>
      <circle cx="210" cy="60" r="3" fill="#64748b"/><circle cx="250" cy="85" r="3" fill="#64748b"/><circle cx="290" cy="65" r="3" fill="#64748b"/>
      <circle cx="330" cy="75" r="3" fill="#64748b"/><circle cx="370" cy="58" r="3" fill="#64748b"/><circle cx="410" cy="82" r="3" fill="#64748b"/>
      <circle cx="90" cy="150" r="3" fill="#64748b"/><circle cx="130" cy="165" r="3" fill="#64748b"/><circle cx="170" cy="140" r="3" fill="#64748b"/>
      <circle cx="210" cy="160" r="3" fill="#64748b"/><circle cx="250" cy="135" r="3" fill="#64748b"/><circle cx="290" cy="155" r="3" fill="#64748b"/>
      <circle cx="330" cy="145" r="3" fill="#64748b"/><circle cx="370" cy="162" r="3" fill="#64748b"/><circle cx="410" cy="138" r="3" fill="#64748b"/>
      <line x1="24" y1="110" x2="70" y2="110" stroke="#64748b" stroke-width="2"/>
      <path d="M70 110 Q120 60 200 48" fill="none" stroke="#dc2626" stroke-width="2.5" marker-end="url(#mf-arr)"/>
      <text x="155" y="42" font-size="10" fill="#dc2626" font-weight="600">α</text>
      <path d="M70 110 Q120 175 220 188" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#mf-arr)"/>
      <text x="195" y="198" font-size="10" fill="#2563eb" font-weight="600">β (sharper curve)</text>
      <line x1="70" y1="110" x2="420" y2="110" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.65"/>
      <text x="430" y="114" font-size="9" fill="#7c3aed">γ</text>
      <defs><marker id="mf-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg><p class="enlight-physics-diagram__caption">Magnetic field — α and β curve in opposite directions; β deflects more; γ is undeflected.</p></div>

**Emission types at a glance**

- **Alpha**: nucleus loses 2 protons and 2 neutrons ($^{4}_{2}\alpha$).
- **Beta**: neutron → proton + electron; proton number increases by 1.
- **Gamma**: excess energy released; no change in proton number.

<div class="enlight-physics-diagram"><svg viewBox="0 0 440 130" width="440" height="130" role="img" aria-label="Types of nuclear emission">
      <circle cx="75" cy="65" r="30" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
      <text x="75" y="60" text-anchor="middle" font-size="10" fill="#1e3a8a" font-weight="600">parent</text>
      <text x="75" y="74" text-anchor="middle" font-size="8" fill="#64748b">nucleus</text>
      <line x1="108" y1="65" x2="148" y2="65" stroke="#64748b" stroke-width="2" marker-end="url(#nd20)"/>
      <circle cx="188" cy="65" r="24" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
      <text x="188" y="69" text-anchor="middle" font-size="10" fill="#166534" font-weight="600">daughter</text>
      <rect x="268" y="28" width="155" height="74" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="280" y="48" font-size="10" fill="#dc2626" font-weight="600">α: Z − 2, A − 4</text>
      <text x="280" y="68" font-size="10" fill="#2563eb" font-weight="600">β: Z + 1, A unchanged</text>
      <text x="280" y="88" font-size="10" fill="#7c3aed" font-weight="600">γ: Z and A unchanged</text>
      <defs><marker id="nd20" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/></marker></defs>
    </svg><p class="enlight-physics-diagram__caption">Nuclear emission — alpha (2p + 2n), beta (neutron → proton + electron), gamma (no change in proton number).</p></div>

## Steps / method

Exam Method for Identifying Unknown Radiation:

Measure Background: Record the count rate with no source present.

Measure Source: Place the source near the detector and record the new count rate.

Test with Paper: Place a sheet of paper between the source and detector. A large drop in count rate identifies Alpha radiation.

Test with Aluminium: Replace the paper with 3 mm of aluminium. A drop from the previous reading identifies Beta radiation.

Test for Gamma: If radiation is still detected after the aluminium (and is significantly above background), Gamma radiation is present.

## Common mistakes

Confusing Ionisation and Penetration: Thinking that because Gamma is the most penetrating, it must also be the most ionising. Actually, Alpha is the most ionising because of its large +2 charge and high kinetic energy.

Beta Source: Believing Beta particles come from the electron shells. They are actually ejected from the nucleus when a neutron changes into a proton.

Gamma Deflection: Attempting to deflect Gamma rays in fields. They are EM waves with no charge, so they are never deflected.

## Examiner tip

Nature of Alpha: If asked for the nature of Alpha, always state it is a helium nucleus rather than just "helium".

Ionising Explanation: Link the strong ionising effect of Alpha to its large charge (+2) and high kinetic energy.

Randomness: Always use the terms "spontaneous" and "random" when describing the emission of radiation from a nucleus.

## Quick check

Which type of radiation has a relative charge of $-1$?

Why does Alpha radiation have the shortest range in air?

Name a material thick enough to significantly reduce Gamma radiation.

## Worked example — Absorber Identification

Question: A source has a count rate of 4200 counts/min. With a paper absorber, the rate is 4180 counts/min. With 3 mm of aluminium, the rate drops to 1200 counts/min. Identify the emissions.

Check Alpha: The paper caused almost no change (4200 to 4180), so no Alpha is present.

Check Beta: The aluminium caused a massive drop (4180 to 1200), meaning Beta was being blocked.

Check Gamma: 1200 counts/min is still far above the typical background (e.g., 25 counts/min), so Gamma rays are passing through the aluminium. Final Answer: The source emits Beta and Gamma radiation.

## Worked example — Magnetic Deflection

Question: A beam of Alpha particles and a beam of Beta particles enter a magnetic field directed into the page. Compare their deflections.

Alpha: Using Fleming's Left-Hand Rule (Field = into page, Current = Alpha direction), the force is upward.

Beta: Since Beta is negative, the "current" is opposite to its motion. The force is downward.

Magnitude: The Beta particles will have a much larger deflection (sharper curve) because they are much lighter than the massive Alpha particles.

### Trap

Students often forget that Beta is an electron and deflects in the opposite direction to what they expect if they treat it as a positive charge.
