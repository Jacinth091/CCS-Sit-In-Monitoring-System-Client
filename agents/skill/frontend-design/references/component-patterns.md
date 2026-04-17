# Component Patterns Reference

Refined Minimalist component recipes.

---

## Buttons (Refined)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 6px; /* Comfortably refined */
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.15s ease-in-out;
  border: 1px solid var(--color-primary);
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
```

---

## Cards (Refined)

```css
.card {
  background: var(--color-bg-primary);
  border-radius: 8px; /* Balanced rounding */
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}
.card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
}
```

---

## Inputs (Refined)

```css
.field-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-bg-primary);
  transition: border-color 0.15s ease;
}
.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}
```
