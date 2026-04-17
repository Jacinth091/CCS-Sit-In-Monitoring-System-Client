---
name: cedric-frontend-design
description: >
  Use this skill for ALL frontend design and UI/UX tasks — React components, pages, dashboards,
  forms, layouts, design systems, or any visual interface work. Triggers on: "design a...",
  "build a component", "create a UI", "make a page", "style this", "frontend for...",
  any mention of components, layouts, modals, cards, navbars, forms, or visual interface elements.
  Also triggers when the user asks about UI/UX best practices, design systems, component architecture,
  or wants an analysis/recommendation on how to approach a frontend problem. This skill enforces
  a Refined Minimalist design philosophy with reusable component thinking.
---

# Cedric's Frontend Design Skill

A personal design system guide and implementation reference. Read this fully before writing any code or making design decisions.

---

## Phase 1: Analyze Before You Design
...

---

## Phase 2: Design Philosophy

### The Core Principle: Functionality First
...

### Aesthetic Direction: Refined Minimalist

This is the personal style preference — apply it as the default unless the user specifies otherwise.

**Key qualities:**
- Clean, structured layouts with intentional whitespace
- Balanced geometry — avoids both the "bubble" look and the "sharp/boxy" look
- Refined Radius: `8px` for containers (cards, panels), `6px` for controls (buttons, inputs)
- Subtle depth — 1px borders combined with very soft, natural shadows
- Typography-led hierarchy — Inter or system geometric sans
- Pure white (#FFFFFF) backgrounds with #F9F9F9 for secondary surfaces

Read → `references/design-tokens.md` for the full token set.

### What "Refined Minimalist" Actually Means

Refined Minimalism is about intentional balance:
- Professional, not playful (avoiding heavy rounding)
- Approachable, not clinical (avoiding sharp boxiness)
- Every element has a reason to exist
- Hierarchy is clear through weight, size, and alignment

---

## Phase 3: Animation & Motion Rules
...

---

## Phase 4: Component Architecture
...

---

## Phase 5: UI/UX Standards & Best Practices

### Layout
- Use 8px grid for all spacing
- Max content width: 1440px
- Consistent horizontal padding: 16px (mobile), 32px (desktop)

### Typography Scale (Inter/Refined)
```
Large Title:  32px / 800 weight
Title 1:      24px / 700
Title 2:      18px / 600
Headline:     14px / 600
Body:         14px / 400
Footnote:     12px / 400
Caption:      11px / 500 (Uppercase)
```

### Color System
- Primary: Brand Navy (#001F3F)
- Neutrals: White, F9F9F9, Grays
- Borders: 1px solid rgba(0,0,0,0.08)

### Interaction Design
- Subtle hover states (background color shifts or micro-shadows)
- Visible focus rings in primary color
- Touch targets minimum 44×44px

---

## Phase 6: Implementation Checklist
...
