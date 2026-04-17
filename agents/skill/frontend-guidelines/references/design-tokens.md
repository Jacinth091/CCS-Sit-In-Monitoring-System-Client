# Design Tokens Reference

A complete token set for the Refined Minimalist design system.

---

## Border Radius (The "Goldilocks" Balance)

```css
:root {
  --radius-none:   0px;
  --radius-sm:     4px;    /* Micro-elements, tags, badges */
  --radius-md:     6px;    /* Standard for Buttons, Inputs, and Form Controls */
  --radius-lg:     8px;    /* Standard for Cards and small sections */
  --radius-xl:     12px;   /* Large Panels, Modals, and Popovers */
  --radius-full:   9999px; /* Only for true Circles (Avatars) */
}
```

---

## Shadows / Elevation (Refined Depth)

Soft, natural depth that avoids both "too flat" and "too heavy".

```css
:root {
  /* No elevation */
  --shadow-none: none;

  /* Subtle card lift — preferred default for interactive cards */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04), 
               0 1px 4px rgba(0, 0, 0, 0.04);

  /* Hover state / Standard Popover */
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06), 
               0 0 1px rgba(0, 0, 0, 0.1);

  /* Modals / Large Sheets */
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.12),
               0 0 1px rgba(0, 0, 0, 0.1);
}
```

---

## Component-Specific Tokens

### Button
```css
:root {
  --btn-radius:      var(--radius-md);      /* 6px */
  --btn-shadow:      var(--shadow-none);    /* Flat by default */
  --btn-shadow-hover:var(--shadow-sm);      /* Slight lift on hover */
}
```

### Input / Form
```css
:root {
  --input-radius:    var(--radius-md);      /* 6px */
  --input-border:    1px solid var(--color-border-strong);
  --input-focus:     0 0 0 2px var(--color-bg-primary), 0 0 0 4px var(--color-primary);
}
```

### Card
```css
:root {
  --card-radius:     var(--radius-lg);     /* 8px */
  --card-border:     1px solid var(--color-border);
  --card-shadow:     var(--shadow-none);   /* Flat by default */
}
```
