---
name: frontend-design
description: >
  Expert frontend UI/UX design skill that produces modern, refined, professional interfaces.
  Use this skill whenever the user wants to build, design, redesign, review, or improve any frontend
  component, page, screen, layout, dashboard, form, app UI, or web interface. This skill enforces
  the "Refined Professional" aesthetic: high-contrast brand colors (Navy/Sand), Poppins typography,
  and balanced rounding (6px-12px).
---

# Frontend Design Skill (Refined Professional)

A comprehensive guide for producing modern, balanced, and functionally sound UI/UX.

---

## Phase 2: Aesthetic Direction — Refined Professional

The visual language for this skill is **Refined Professional**. It bridges the gap between playful "bubble" design and clinical "boxy" design.

### Core Visual Principles
- **Brand-Driven Contrast** — uses the core CCS palette: **Navy (#001F3F)** for authority and **Sand (#EAD8B1)** for warmth.
- **Balanced Geometry** — avoids sharp 0px corners and excessive rounded-full bubbles. Standard container radius is **10px**; controls are **6px**.
- **Poppins Typography** — uses Poppins for its geometric clarity and approachability.
- **Warm Minimalist Backgrounds** — uses off-whites and sand tints (`#FDFBF7`) instead of cold pure white.
- **Natural Depth** — uses thin navy-tinted borders and very soft shadows for hierarchy.

### Radius System (The Balanced Standard)
```css
--radius-none:   0px;    
--radius-sm:     4px;    /* Micro-labels, tags */
--radius-md:     6px;    /* Buttons, Inputs, Selects */
--radius-lg:     10px;   /* Standard Cards, Content Sections */
--radius-xl:     16px;   /* Hero sections, Modals, Onboarding cards */
```

### Color Palette (CCS Identity)
- **Primary**: Navy (#001F3F) — Headers, CTA backgrounds, Primary text.
- **Accent**: Ocean (#3A6D8C) — Hover states, Sub-headers.
- **Tertiary**: Steel (#6A9AB0) — Secondary text, Borders.
- **Base**: Sand (#EAD8B1) — Background tints, accent borders, secondary buttons.

---

## Phase 3: Implementation Strategy

1. **Containers**: Use `rounded-lg` (10px) with `border border-border` and `bg-white`.
2. **Layouts**: Use `bg-bg-secondary` (warm tint) for page backgrounds to provide contrast for white cards.
3. **Typography**: Headings should be `font-extrabold text-primary` (Navy). Secondary text `text-primary-light` (Steel).
4. **Interactive**: Buttons should be `rounded-md` (6px). Use `bg-primary` for primary and `bg-brand-sand` for secondary.
