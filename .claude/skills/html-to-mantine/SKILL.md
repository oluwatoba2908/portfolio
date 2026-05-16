---
name: html-to-mantine
description: Convert HTML/CSS designs into Mantine v8 React components while preserving all functionality. Use when the user provides an HTML file to redesign, wants to convert a static HTML page to Mantine components, or asks to match a design using Mantine. Handles light and dark mode automatically.
---

# HTML to Mantine Converter

Convert HTML/CSS designs into Mantine v8 React components that work in both light and dark mode, using default Mantine components instead of custom CSS.

## Required Inputs

Both must be provided before starting conversion. If either is missing, ask the user.

1. **Source HTML file** - The wireframe/design HTML file path
2. **Target page/component** - The existing React component file path that this HTML will replace

If the target is unknown, search the codebase for the route/page that corresponds to the HTML design before proceeding.

## Pre-Flight Checklist

Before starting conversion:

- [ ] Read the source HTML file completely
- [ ] Read the target page/component that will be modified (from Required Inputs above)
- [ ] Read `utils/theme.ts` for project theme defaults
- [ ] Identify all interactive elements and their event handlers in the existing component
- [ ] List all state, hooks, and business logic in the existing component

## Core Rules

1. **Functionality is sacred** - Never remove, alter, or break existing event handlers, state, hooks, API calls, or business logic
2. **Mantine defaults first** - Use component props from `utils/theme.ts` defaults before adding custom props
3. **Zero custom CSS for layout** - Use `Stack`, `Group`, `Flex`, `Grid`, `SimpleGrid` for layout
4. **Zero hardcoded colors** - Use Mantine color tokens (`c="dimmed"`, `color="primary"`, `bg="var(--mantine-color-body)"`)
5. **Dark mode safe** - Never use raw hex/rgb colors. Always use Mantine's `light-dark()` CSS function or semantic color props
6. **No inline `style={{}}` for colors or spacing** - Use Mantine props (`p`, `m`, `gap`, `c`, `bg`, etc.)

## Conversion Workflow

### Step 1: Audit the HTML Design

Read the HTML file. Identify and document:

```
Design Audit:
- Layout structure (sidebar, header, content areas, grids)
- Typography (headings, body text, labels, captions)
- Interactive elements (buttons, inputs, dropdowns, toggles)
- Data display (tables, lists, cards, badges, stats)
- Feedback elements (alerts, notifications, progress, loading)
- Decorative elements (icons, dividers, borders, shadows)
- Color usage (backgrounds, text colors, borders, accents)
- Spacing patterns (padding, margins, gaps)
```

### Step 2: Audit the Existing Component

Read the target React component. Document ALL:

```
Functionality Audit:
- Props interface (every prop and its type)
- State variables (useState, useReducer)
- Effects (useEffect, useLayoutEffect)
- Callbacks and event handlers (onClick, onChange, onSubmit, etc.)
- Custom hooks (useQuery, useMutation, useForm, etc.)
- Context usage (useContext)
- Refs (useRef)
- Conditional rendering logic
- Data transformations / computed values
- Child component usage and their props
```

**CRITICAL**: Every item in this audit must be preserved in the final output.

### Step 3: Map HTML to Mantine Components

Use the component mapping reference in [COMPONENT-MAP.md](COMPONENT-MAP.md).

General approach:
- `<div>` layout containers → `Stack`, `Group`, `Flex`, `Grid`, `Box`
- `<div>` cards/sections → `Card`, `Paper`
- `<h1>`-`<h6>` → `Title order={1-6}`
- `<p>`, `<span>` → `Text`
- `<a>` → `Anchor`
- `<button>` → `Button`, `ActionIcon`
- `<input>` → `TextInput`, `NumberInput`, `PasswordInput`
- `<select>` → `Select`, `MultiSelect`
- `<textarea>` → `Textarea`
- `<table>` → `Table` or `mantine-react-table`
- `<ul>`/`<ol>` → `List`
- `<img>` → `Image`, `Avatar`
- Status indicators → `Badge`
- Notifications → `Alert`
- Navigation → `Tabs`, `NavLink`, `Breadcrumbs`

### Step 4: Handle Colors for Light/Dark Mode

**NEVER use raw colors.** Use these patterns:

```tsx
// Text colors
<Text c="dimmed">Secondary text</Text>
<Text c="primary">Accent text</Text>
<Text>Default text (inherits)</Text>

// Backgrounds - use Mantine CSS variables
<Box bg="var(--mantine-color-body)">Default bg</Box>
<Paper>Has border + bg by default</Paper>
<Card>Has border + bg + shadow by default</Card>

// For theme-aware custom colors, use light-dark()
<Box bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
  Adapts to color scheme
</Box>

// Conditional per-scheme styling
<Text c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4))">
  Different shade per mode
</Text>

// Project custom colors (from theme.ts)
<Badge color="success">Active</Badge>
<Badge color="danger">Failed</Badge>
<Badge color="warning">Pending</Badge>
<Badge color="tertiary">New</Badge>
```

### Step 5: Handle Spacing

Use Mantine spacing props instead of CSS:

```tsx
// Padding and margin
<Box p="md" m="sm" />

// Component-specific
<Stack gap="lg">       // vertical gap
<Group gap="sm">       // horizontal gap

// Spacing scale (from theme.ts):
// xs=4px, sm=8px, md=16px, lg=24px, xl=32px
```

### Step 6: Rebuild the Component

1. Keep the exact same component signature (name, props, exports)
2. Keep ALL state, hooks, effects, callbacks unchanged
3. Replace only the JSX return with Mantine components
4. Preserve all conditional rendering logic
5. Preserve all event handler bindings
6. Preserve all data-testid or aria attributes

### Step 7: Validate

Run these checks:

```
Validation Checklist:
- [ ] Every event handler from Step 2 audit is still bound
- [ ] Every state variable is still used
- [ ] Every hook is still called
- [ ] Every prop is still consumed
- [ ] No raw hex/rgb colors remain
- [ ] No inline style={{}} for layout, spacing, or colors
- [ ] No custom CSS classes for things Mantine handles
- [ ] Component renders identically in light and dark mode (no invisible text, no contrast issues)
- [ ] All conditional rendering paths still work
- [ ] Child components still receive their props
```

Then run:
```bash
yarn eslint . --quiet
yarn typecheck
```

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| `style={{ color: '#333' }}` | `c="dimmed"` or `c="dark.7"` |
| `style={{ backgroundColor: '#fff' }}` | `bg="var(--mantine-color-body)"` or use `Paper`/`Card` |
| `style={{ display: 'flex', gap: 8 }}` | `<Group gap="sm">` or `<Flex gap="sm">` |
| `style={{ padding: '16px' }}` | `p="md"` |
| `style={{ marginTop: '24px' }}` | `mt="lg"` |
| `className="custom-card"` | `<Card>` or `<Paper>` |
| `<div className="header">` | `<Group>` or `<Flex>` with proper layout |
| Custom CSS grid | `<SimpleGrid cols={{ base: 1, sm: 2 }}>` |
| `color: white` in dark mode | Let Mantine handle via theme |
| Removing an `onClick` | Keep ALL handlers |

## Project-Specific Defaults

The project theme (`utils/theme.ts`) already sets defaults. **Do not re-specify these:**

- `Button`: `size="sm"`, `radius={10}`
- `Card`: `radius="md"`, `shadow="xs"`, `padding="lg"`, `withBorder`, `w="100%"`
- `Paper`: `radius="md"`, `p="md"`, `withBorder`
- `Stack`: `gap="sm"`, `w="100%"`
- `Group`: `gap="md"`, `wrap="nowrap"`, `align="center"`
- `Badge`: `size="md"`, `radius="md"`, `tt="none"`
- `TextInput`: `radius="md"`, `size="sm"`, `w="100%"`
- `Modal`: `centered`, `radius="md"`
- `Tooltip`: `withArrow`, `multiline`
- `Text`: `lh={1.2}`
- `Alert`: `variant="light"`

Only add props that override these defaults.

## Additional Resources

- For complete HTML → Mantine component mapping, see [COMPONENT-MAP.md](COMPONENT-MAP.md)
- For before/after conversion examples, see [EXAMPLES.md](EXAMPLES.md)
