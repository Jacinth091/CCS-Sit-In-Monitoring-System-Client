# Design Philosophy & System Standards: CCS Sit-In Monitoring

This document outlines the visual identity and technical standards for the **CCS Sit-In Monitoring System**. It combines the core **Refined Professional** philosophy with the formal technical specifications defined in the `design-system-client` template.

---

## 1. Core Philosophy: "Refined Professional"

The application follows a **Refined Professional** aesthetic. It bridges the gap between playful "bubble" designs and clinical "boxy" interfaces. The goal is to provide a user experience that feels authoritative yet approachable, modern but grounded in institutional identity.

---

## 2. Light Mode Composition (The 60-30-10 Rule)

To prevent the UI from appearing "dominantly white" and to ensure a strong institutional presence, Light Mode must follow a strict color distribution strategy.

### 2.1 Color Distribution (Light Mode)
| Color Role | Proportion | Purpose | Implementation Examples |
| :--- | :--- | :--- | :--- |
| **Warm Base** | ~60% | Page Backgrounds | `bg-bg-secondary` (#faf8f5) — **Never pure white** for page backgrounds. |
| **Refined White** | ~25% | Card/Content Surfaces | `bg-white` (#FFFFFF) — Used for surface areas, modals, and input fields. |
| **Navy (Primary)** | ~10% | Authority & Hierarchy | `bg-primary` (#001F3F) — Hero headers, primary buttons, and headings. |
| **Sand/Ocean** | ~5% | Accents & Detail | `bg-brand-sand` and `bg-primary-hover` — Icons, hover states, and small details. |

---

## 3. Dark Mode Architecture (Deep Navy Midnight)

Dark Mode is not an inversion of light mode; it is a specialized theme built on a **Deep Navy Midnight** palette that maintains brand identity while maximizing contrast and modern appeal.

### 3.1 Dark Mode Palette
| Category | Token | Hex | Role |
| :--- | :--- | :--- | :--- |
| **Background** | `bg-secondary` | `#060D1A` | Deep Midnight: Main page background. |
| **Surface** | `bg-primary` | `#0F1D33` | Dark Navy: Card and container surfaces. |
| **Elevated** | `bg-tertiary` | `#16263F` | Lighter Navy: Floating elements and modals. |
| **Text (High)** | `text-primary` | `#F0F7FF` | Cloud White: Crisp, high-contrast primary text. |
| **Text (Low)** | `text-secondary`| `#94B8D1` | Muted Steel: De-emphasized metadata. |
| **Contrast** | `brand-sand` | `#DCC497` | Warm Gold: Selective high-contrast accents. |

### 3.2 Dark Mode Rules
- **No Inverted Gradients**: Gradients must transition from a darker Navy (`#112642`) to a deeper Midnight (`#091526`). Never use light-to-dark or saturated-to-muted inversions.
- **High Contrast Borders**: Use low-opacity Steel borders (`rgba(148, 184, 209, 0.12)`) to define card edges against the deep background.
- **Elevation through Tint**: Establish hierarchy by slightly lightening the Navy base for elevated surfaces (e.g., Modals), rather than using heavy drop shadows.

---

## 4. Sizing & Spacing Standards

We prioritize "just enough" spacing to ensure the interface feels breathable but compact and professional.

### 4.1 Card Geometry
- **Standard Padding**: `p-5` (20px). This provides enough breathing room without excessive whitespace.
- **Radius**: `radius.sm` (12px) for cards and modals.
- **Shadows**: Soft, multi-layered shadows (`shadow-md`) that avoid heavy, dark edges.

### 4.2 Typography Scale (The "Balanced View")
To avoid being "zoomed out" while maintaining a senior professional feel, we use a slightly larger base font with tighter line heights for headings.

| Token | Size | Weight | Application |
| :--- | :--- | :--- | :--- |
| **Base** | `14px` | 400 | Global body text (`line-height: 1.6`). |
| `font.size.xs` | `11px` | 900 | Micro-labels, metadata, status badges. |
| `font.size.sm` | `12px` | 900 | Card subtitles, form labels. |
| `font.size.md` | `14px` | 600/700 | Standard content, table cells. |
| `font.size.lg` | `18px` | 700 | Card titles, subsection headers. |
| `font.size.4xl` | `32px` | 900 | Hero headers and page titles. |

---

## 5. Implementation Checklist & Quality Gates

- [ ] **Background Check**: Does the page use the correct theme background (Light: #faf8f5 | Dark: #060d1a)?
- [ ] **Contrast Verification**: In Dark Mode, is the text crisp (`#F0F7FF`) against the Navy surface?
- [ ] **Gradient Check**: Are gradients following the Deep Navy-to-Midnight rule (No inversions)?
- [ ] **Padding Verification**: Are cards using `p-5`?
- [ ] **Typography Check**: Is the base text `14px`? Are card titles `text-lg` (18px)?
- [ ] **Navy Anchor**: Does the view contain at least one major Navy/Midnight element?
