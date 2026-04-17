# Color System Reference

This file governs all color decisions. Always consult before defining or recommending colors.

---

## Step 1: Extract Existing Palette

Look for colors in this order of priority:

1. **CSS variables** — search for `:root { --color-* }` or `--primary`, `--accent`, etc.
2. **Tailwind config** — `tailwind.config.js` → `theme.extend.colors`
3. **Global stylesheet** — repeated hex/hsl values in `.css` or `<style>` blocks
4. **Component files** — inline styles or className patterns
5. **User-described brand** — "our brand is blue and white", "we use #1D4ED8"

If an existing palette is found:
- **Extract the 3–5 dominant colors**
- Map them to the token roles below
- Fill in missing roles by deriving from the existing colors (lighten/darken/desaturate)
- **Do not replace** the existing palette without explicit user permission

---

## Step 2: If No Palette Exists — Domain Recommendations

Choose a palette direction based on what the system does:

| System Type | Recommended Direction | Example Palette |
|---|---|---|
| Student/Education | Trustworthy, energetic | Royal Blue + Warm Amber + Off-white |
| Healthcare / Medical | Clean, calm, safe | Teal + Soft Green + Neutral White |
| Finance / Banking | Stable, professional | Deep Navy + Muted Gold + Light Gray |
| Event Management | Vibrant, exciting | Rich Purple + Electric Indigo + White |
| Repair / Trade Business | Reliable, grounded | Slate Blue + Orange accent + Charcoal |
| Food / Hospitality | Warm, appetizing | Terracotta + Cream + Forest Green |
| Tech / SaaS | Modern, crisp | Midnight Blue + Cyan accent + True White |
| Creative / Portfolio | Expressive, personal | Depends on personality — ask user |
| Admin Dashboard | Neutral, scannable | Zinc Gray + Blue accent + White |

When recommending, always provide:
1. The primary color (brand identity)
2. The accent color (CTAs, links, highlights)
3. The semantic colors (success, warning, error, info)
4. The surface colors (background layers)
5. The text colors (primary, secondary, tertiary, disabled)

---

## Step 3: Token Structure

Always output colors as this full token set in CSS custom properties:

```css
:root {
  /* ─── Brand ─── */
  --color-primary:        hsl(220, 90%, 56%);   /* Main brand color */
  --color-primary-light:  hsl(220, 90%, 72%);   /* Tints for hover/backgrounds */
  --color-primary-dark:   hsl(220, 90%, 40%);   /* Active/pressed states */
  --color-accent:         hsl(35, 95%, 55%);    /* Secondary brand / CTAs */

  /* ─── Semantic ─── */
  --color-success:        hsl(142, 71%, 45%);
  --color-success-bg:     hsl(142, 71%, 95%);
  --color-warning:        hsl(38, 92%, 50%);
  --color-warning-bg:     hsl(38, 92%, 95%);
  --color-error:          hsl(0, 72%, 51%);
  --color-error-bg:       hsl(0, 72%, 96%);
  --color-info:           hsl(200, 80%, 50%);
  --color-info-bg:        hsl(200, 80%, 95%);

  /* ─── Surfaces (Light Mode) ─── */
  --color-bg:             hsl(0, 0%, 98%);       /* Page background */
  --color-surface-1:      hsl(0, 0%, 100%);      /* Cards, panels */
  --color-surface-2:      hsl(220, 20%, 97%);    /* Inset sections */
  --color-surface-3:      hsl(220, 15%, 93%);    /* Dividers, separators */

  /* ─── Text (Light Mode) ─── */
  --color-label:          hsl(220, 15%, 10%);    /* Primary text */
  --color-secondary-label:hsl(220, 10%, 40%);    /* Secondary/supporting text */
  --color-tertiary-label: hsl(220, 8%, 60%);     /* Placeholder, disabled */
  --color-quaternary-label:hsl(220, 6%, 75%);    /* Very subtle labels */

  /* ─── Borders ─── */
  --color-border:         hsl(220, 15%, 88%);
  --color-border-strong:  hsl(220, 15%, 70%);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:             hsl(220, 15%, 8%);
    --color-surface-1:      hsl(220, 12%, 12%);
    --color-surface-2:      hsl(220, 10%, 16%);
    --color-surface-3:      hsl(220, 8%, 22%);

    --color-label:          hsl(0, 0%, 96%);
    --color-secondary-label:hsl(220, 5%, 65%);
    --color-tertiary-label: hsl(220, 5%, 45%);
    --color-quaternary-label:hsl(220, 5%, 30%);

    --color-border:         hsl(220, 10%, 22%);
    --color-border-strong:  hsl(220, 10%, 35%);

    /* Brand colors may shift slightly for dark mode legibility */
    --color-primary:        hsl(220, 90%, 65%);   /* Slightly lighter on dark */
    --color-primary-light:  hsl(220, 90%, 25%);   /* Now used as tinted bg */
  }
}
```

---

## Step 4: Palette Presentation Format

When presenting a palette recommendation to the user, format it clearly:

```
RECOMMENDED COLOR PALETTE
─────────────────────────────────────────
System Type : [e.g., Student Management App]
Direction   : [e.g., Trustworthy + Focused]

Primary     ■ #2563EB  — Royal Blue    (brand, links, primary buttons)
Accent      ■ #F59E0B  — Amber         (highlights, badges, secondary CTAs)
Success     ■ #16A34A  — Green         (confirmations, saved states)
Warning     ■ #D97706  — Orange        (caution notices)
Error       ■ #DC2626  — Red           (errors, destructive actions)
Surface     □ #F8FAFC  — Near-white    (page background)
Card        □ #FFFFFF  — White         (card/panel surfaces)
Text        ● #0F172A  — Near-black    (primary text)
Subtle      ● #64748B  — Slate         (secondary/caption text)
Border      – #E2E8F0  — Light gray    (dividers, input borders)

Contrast check:
  Primary on Surface   → 5.1:1 ✅ (WCAG AA)
  Text on Surface      → 15.8:1 ✅ (WCAG AAA)
  Accent on Surface    → 3.4:1 ✅ (WCAG AA for large text)
─────────────────────────────────────────
To customize: tell me the mood (warmer? cooler? more vibrant?)
or share your brand colors and I'll build around them.
```

---

## iOS System Color Equivalents (reference)

These match Apple's semantic naming. Use as guidance for mapping:

| iOS Name | Light Mode | Dark Mode | Role |
|---|---|---|---|
| systemBlue | #007AFF | #0A84FF | Primary interactive |
| systemGreen | #34C759 | #30D158 | Success |
| systemRed | #FF3B30 | #FF453A | Destructive/error |
| systemOrange | #FF9500 | #FF9F0A | Warning |
| systemBackground | #FFFFFF | #000000 | Root background |
| secondarySystemBackground | #F2F2F7 | #1C1C1E | Card/grouped bg |
| tertiarySystemBackground | #FFFFFF | #2C2C2E | Inset bg |
| label | #000000 | #FFFFFF | Primary text |
| secondaryLabel | rgba(60,60,67,0.6) | rgba(235,235,245,0.6) | Supporting text |
| separator | rgba(60,60,67,0.29) | rgba(84,84,88,0.65) | Dividers |