# Component Architecture Reference

## The Mental Model: Build a Library, Not Pages

Every component you write should feel like it belongs in a design system — not like it was cut from a specific page and pasted into a file. The question to always ask is:

> "If someone found this component in isolation, could they use it for something else?"

If the answer is yes, you're building right.

---

## Folder Structure

All components live under `src/components/` (or `components/` in smaller projects):

```
components/
├── ui/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.constants.js (if complex)
│   │   └── index.js
│   ├── Input/
│   ├── Badge/
│   ├── Avatar/
│   ├── Icon/
│   └── index.js              ← barrel export for all ui primitives
│
├── layout/
│   ├── Container/
│   ├── Stack/
│   ├── Grid/
│   ├── Divider/
│   └── index.js
│
├── composite/
│   ├── Card/
│   ├── Modal/
│   ├── Navbar/
│   ├── Sidebar/
│   ├── Drawer/
│   ├── Dropdown/
│   └── index.js
│
├── feedback/
│   ├── Alert/
│   ├── Toast/
│   ├── Skeleton/
│   ├── Spinner/
│   ├── EmptyState/
│   └── index.js
│
├── data/
│   ├── Table/
│   ├── List/
│   ├── StatCard/
│   ├── Timeline/
│   └── index.js
│
└── index.js                  ← master barrel (optional)
```

### Why Folders Per Component?

A component folder lets you co-locate:
- The component file
- Constants/Helpers (if large)
- Tests
- Stories (if using Storybook)
- Sub-components (e.g., `Card/CardHeader.jsx`)

It also makes imports clean:
```js
import { Card } from '@/components/composite/Card'
// not: import Card from '@/components/composite/Card/Card'
```

---

## The 5 Categories Explained

### `ui/` — Primitives
The atoms of your design system. They render one thing, accept many variants, and have no business logic.

**Examples**: Button, Input, Checkbox, Radio, Select, Textarea, Badge, Tag, Avatar, Icon, Tooltip, Divider, Spinner

**Rules**:
- Must accept `className` for style overrides
- Must expose variant/size/color props
- Must handle all interaction states (hover, focus, disabled, loading)
- Must never fetch data
- Must never contain layout logic

```jsx
// Good primitive
<Button variant="primary" size="md" disabled={isLoading} loading={isLoading}>
  Save
</Button>

// Bad primitive (hardcoded, not reusable)
<button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
  Save Profile
</button>
```

---

### `layout/` — Structure
Controls how other components are arranged. Has no visual appearance of its own (no background, no border by default).

**Examples**: Container (max-width wrapper), Stack (vertical/horizontal flex), Grid (CSS grid wrapper), Spacer, AspectRatio

**Rules**:
- No colors, shadows, or decorative styles
- Only controls spacing, alignment, and dimension
- Always passes through `children`

```jsx
// Good layout usage
<Stack direction="vertical" gap={4}>
  <Headline>Recent Activity</Headline>
  <List items={activities} />
</Stack>
```

---

### `composite/` — Combinations
Components that combine primitives and layout into meaningful UI patterns. They have their own visual identity.

**Examples**: Card, Modal, Navbar, Sidebar, Accordion, Tabs, Dropdown Menu, Dialog, Sheet/Drawer, CommandPalette

**Rules**:
- Accept slot-style children (Header, Body, Footer sub-components) for flexibility
- Do not hardcode content — receive everything via props or children
- Handle their own open/close state OR accept controlled `open`/`onClose` props

```jsx
// Good composite with slots
<Card>
  <Card.Header title="Enrollment Stats" action={<Button size="sm">Export</Button>} />
  <Card.Body>
    <StatGrid stats={enrollmentData} />
  </Card.Body>
  <Card.Footer>
    <Text variant="caption">Updated 2 hours ago</Text>
  </Card.Footer>
</Card>
```

---

### `feedback/` — Status Communication
Components that tell the user what's happening. Critical for perceived performance and error recovery.

**Examples**: Alert (persistent status message), Toast (transient notification), Skeleton (loading placeholder), Spinner (inline loading), EmptyState (no data), ErrorBoundary display, ProgressBar

**Rules**:
- Skeleton components mirror the layout of the content they replace — don't use a generic rectangle
- Toast should be managed via a context/provider, not rendered inline
- EmptyState always has: an icon/illustration, a title, a description, and optionally a CTA button

```jsx
// Good empty state
<EmptyState
  icon={<UsersIcon />}
  title="No students enrolled"
  description="Add students to get started with your class roster."
  action={<Button variant="primary" onClick={onAddStudent}>Add Student</Button>}
/>
```

---

### `data/` — Information Display
Components that render structured data. They separate the data format from the visual rendering.

**Examples**: Table (with sort, filter, pagination), List, StatCard, Timeline, DataGrid, Chart wrapper

**Rules**:
- Accept data as props — never fetch internally (unless it's a top-level "smart" variant explicitly named as such, e.g., `StudentTablePage`)
- Provide column/field configuration via props, not hardcoded
- Handle loading, empty, and error states internally

```jsx
// Good data component
<Table
  data={students}
  columns={studentColumns}
  isLoading={isLoading}
  emptyMessage="No students found"
  onRowClick={(student) => navigate(`/students/${student.id}`)}
/>
```

---

## Reusability Decision Framework

When about to create a new component, run this check:

**Step 1: Does this already exist?**
Check your `ui/`, `composite/`, and `data/` folders first. A `UserCard` might just be a `Card` with specific props.

**Step 2: Is this truly unique?**
If the component has design or behavior that applies *only* to one specific page with no conceivable other use, it's a page-level component — put it in the page folder:
```
pages/
└── Dashboard/
    ├── DashboardPage.jsx
    └── components/         ← page-specific only
        └── ActivityFeed.jsx
```

**Step 3: Can I generalize this with props?**
Usually yes. A `StudentStatCard` is really a `StatCard` with different data. Generalize it.

```jsx
// Too specific
<StudentStatCard enrolledCount={42} />

// Properly generalized
<StatCard
  label="Enrolled Students"
  value={42}
  icon={<UsersIcon />}
  trend={{ direction: "up", value: "12%", label: "this month" }}
/>
```

**Step 4: What are 2 other places this could be used?**
If you can name 2 other realistic uses in the same app, it belongs in `components/`. If you can't, it belongs in the page folder.

---

## Props Design Patterns

### Always include
Ensure every component accepts standard props for flexibility:
- `className`: for style overrides
- `children`: for content slots
- `id`: for accessibility / testing

### Slot pattern for composites
```jsx
// Instead of flat props:
<Card title="Hello" subtitle="World" footer="Done" />

// Use slot children:
<Card>
  <Card.Header>Hello</Card.Header>
  <Card.Body>World</Card.Body>
  <Card.Footer>Done</Card.Footer>
</Card>
```

### Controlled vs. uncontrolled
Offer both when it makes sense (especially for modals, dropdowns, inputs):
- **Controlled**: `open`, `onClose`
- **Uncontrolled**: `defaultOpen`

---

## Index / Barrel Exports

Each category folder has an `index.js`:

```js
// components/ui/index.js
export { Button } from './Button'
export { Input } from './Input'
export { Badge } from './Badge'
export { Avatar } from './Avatar'
```

This gives clean imports throughout the app:
```js
import { Button, Badge, Avatar } from '@/components/ui'
import { Card, Modal } from '@/components/composite'
import { StatCard, Table } from '@/components/data'
```