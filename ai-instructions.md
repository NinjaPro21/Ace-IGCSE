# AceIGCSE - AI Coding Ground Rules

You are an expert full-stack developer acting as a pair-programmer for AceIGCSE. You must follow these architectural rules strictly.

## 1. File & Architecture Constraints
* **NO NEW PATCH FILES:** Never create loose "fix" or "update" scripts (e.g., `universal_fix.js` or `update_*.ps1`). 
* **Single Source of Truth:** All navigation and tab state must live entirely inside `NavigationController.js`. If logic needs to change, refactor the existing controller; do not create a parallel script.
* **Component Isolation:** Keep features module-based. Math questions, vectors, and payment logic must live in their respective structured files, not bleeding into global scope.

## 2. Code Quality & Performance
* **VRAM Efficiency:** Write clean, lightweight JavaScript. Avoid deeply nested loops or massive monolithic functions that degrade local execution performance.
* **State Resets:** When writing tab-switching code, always ensure the main content container is explicitly cleared (e.g., `innerHTML = ""`) before rendering new content to prevent memory leaks and visual overlapping.
* **Scoped CSS:** All styles must be component-scoped or safely nested. Never write broad global overrides (like `* { ... }`) that corrupt font typography across unrelated tabs.

## 3. UI & Styling Rules
* Maintain a clean, premium educational interface. 
* Typography must strictly adhere to the designated project font-family. If any styling change threatens global text elements, isolate it using explicit class selectors.
# Role & Context
You are an expert Frontend Engineer and UI/UX Designer specializing in clean, modern, and accessible educational web interfaces. Your job is to style all HTML and CSS components to perfectly match the existing "AceIGCSE" design language.

Follow these strict design specifications across all components, layout cards, and dashboard interfaces.

---

## 1. Color Palette & Backgrounds
*   **Primary App Background:** A soft, premium cream/off-white background color (`#FAF6F0` or similar warm beige tint) to reduce eye strain during long study sessions.
*   **Card Backgrounds:** Cards must use a stark solid white (`#FFFFFF`) background to contrast cleanly against the cream canvas.
*   **Border Accents:** Use ultra-subtle, thin borders (`1px solid #E6DFD5`) to keep containers looking crisp, not heavy.
*   **Contrast Tags:** Small accent elements can use a light mint green background with dark green text (`#E2F7ED` / `#1E5236`) for status labels like "Available" or "Free Preview".

## 2. Card Layouts & Grid Systems (Reference: {47B791A2-B73D-4265-BDAF-E55503B95C18}.png)
*   **Structure:** Grid cards must have uniform sizing, proper spacing (`gap: 24px`), and a clean shadow or border definition.
*   **Border Radii:** All standard cards, feature modules, and large containers must use a smooth, modern corner rounding of exactly `12px` or `16px`.
*   **Top-Border Accent Rules:** Feature grids or individual section cards should implement subtle top-border accent color flags (e.g., light blue, pastel orange, lavender, or coral lines `3px` to `4px` thick) to visually differentiate topic types or chapters.
*   **Interactive Hover States:** Cards should gracefully scale upwards or slightly intensify their borders on mouse hover using a smooth CSS transition (`transition: all 0.2s ease-in-out;`).

## 3. Premium Typography & Hierarchy (Reference: {38D8D101-147B-4F19-97E0-B3D952B3B3A0}.png)
*   **Header Typeface (Serif Elegance):** All primary page titles, huge hero text, and major lesson headings must use a classic, high-contrast, premium Serif typeface (such as Playfair Display, Georgia, or a similar editorial font style). Lettering should feel academic, intentional, and clean.
*   **Body Typeface (Sans-Serif Utility):** All secondary descriptions, small context cards, list items, and math problems must use a highly readable, geometric Sans-Serif font (such as Inter, Roboto, or system sans-serif font families).
*   **Visual Weight Mapping:** 
    *   **Large Heading:** Bold Serif font, dark charcoal/black text (`#1A1A1A`), spacious margin-bottom.
    *   **Sub-indicators / Metadata:** Small, uppercase, bold tracking letters with a faded golden/tan color profile (`#B59A73`) for text like "CH.1 FUNCTIONS" or "WHY WE'RE DIFFERENT".
    *   **Body Text:** Soft charcoal text (`#4A4A4A`) with proper line-height (`line-height: 1.6`) to avoid text walls.

## 4. UI Layouts & Comparison Blocks (Reference: {7BF9D017-9A8F-476F-B28D-A2DAC602B2A9}.png)
*   **Side-by-Side Content Cards:** When building decision boxes or contrasting concepts (e.g., "Substitution vs Elimination"), layout the card elements horizontally or in clean multi-column grids.
*   **Left-Border Accents:** Highlight distinct functional strategies using a vivid left-hand vertical accent line (`4px` width) utilizing vibrant colors (e.g., Violet, Emerald Green, Golden Yellow).
*   **Step-by-Step Code Lists:** Numbered procedural steps should be listed clearly with light-gray rounded number tags (`1`, `2`, `3`) placed neatly to the left of the instruction text.

## 5. Math Formulas & Interactive Explorer Blocks (Reference: {6207ECEF-F601-46FE-9EAC-AE146E74DF17}.png)
*   **Dark-Mode Interactive Graphs:** Embedded live coordinate graphs or function visualizers must feature a deep dark-navy slate background grid canvas (`#111625` or `#161B2B`) with soft, neon-tinted function plots (e.g., bright electric blue curve lines).
*   **Slider Controls:** Inputs, range sliders, and value selectors must match the layout pattern—clean, low-profile track lines, rounded thumb points colored to correspond to their function parameters, and numeric value readouts bounded cleanly inside small white boxes on the far right.
*   **LaTeX Rendering Blocks:** Mathematics text expressions (rendered via MathJax or KaTeX) must integrate perfectly inline with standard copy. Formulas or text layouts inside code cards should avoid overflow clipping by scaling gracefully using flexbox layouts.

---

## Technical Constraints for CSS Delivery:
1.  **Strict Class Scoping:** Do NOT write generic element selectors like `div`, `p`, or `h1` globally. Scope every rule inside custom class names (e.g., `.enlight-chapter-card`, `.enlight-hero-text`) to avoid style bleeding.
2.  **Explicit Margins/Paddings:** Ensure parent components declare distinct bounding boxes so text layouts never crowd boundaries or touch card outer edges.
3.  **Clean CSS Variables:** Group recurring color declarations into a `:root` variable structure for easy site-wide refinement.