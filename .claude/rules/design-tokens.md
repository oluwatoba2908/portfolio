# Design Tokens

---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "**/*.module.css"
  - "utils/theme.ts"
---

Rules for using the Airstride design token system. All tokens are defined in `utils/theme.ts` via Mantine's `createTheme`.

> **Guiding lens:** Imagine you are a dumb human in 2026 trying to do this task for the first time. They cannot tell the difference between `#3B82F6` and `primary.5` — but they will absolutely notice when a button looks "off", contrast fails in dark mode, or spacing feels uneven. Tokens exist so a first-time user always gets the polished, consistent experience without you thinking about it.

## Color System

Use semantic color names, never raw hex values:

```typescript
// WRONG — hardcoded hex
<Text style={{ color: "#3B82F6" }}>

// RIGHT — semantic token via Mantine prop
<Text c="primary.5">
<Badge color="success.5">
<Alert color="danger">

// RIGHT — CSS variable in stylesheets
.label { color: var(--mantine-color-primary-5); }
```

### Available Color Families

Each family has 10 shades (0=lightest, 9=darkest):

| Token | Purpose |
|-------|---------|
| `primary` | Brand blue — primary actions, links, focus |
| `secondary` | Dark grays/blacks — text, headers |
| `grey` | Neutral grays — borders, backgrounds |
| `success` | Green — success states, positive indicators |
| `warning` | Amber — warning states, caution |
| `danger` | Red — error states, destructive actions |
| `tertiary` | Accent color |
| `foundation` | Background foundations |
| `skyblue` | Informational highlights |
| `gold` | Premium/featured indicators |

### Shade Usage Convention

| Shade | Use for |
|-------|---------|
| 0-1 | Subtle backgrounds |
| 2-3 | Borders, disabled states |
| 4-5 | **Default** — icons, secondary text |
| 6-7 | Primary actions, interactive elements |
| 8-9 | High contrast, headers |

## Typography

**Font family:** `var(--font-inter)` (Inter via Next.js font loading)

```typescript
// Heading sizes (defined in theme)
h1: { fontSize: "36px", lineHeight: "1.2" }
h2: { fontSize: "30px", lineHeight: "1.2" }
h3: { fontSize: "24px", lineHeight: "1.2" }
h4: { fontSize: "22px", lineHeight: "1.2" }

// Body text sizes
sm: "14px"
md: "16px"  // default
lg: "18px"
```

Use Mantine's `fz` and `fw` props:

```typescript
<Text fz="sm">Small text</Text>
<Text fz="md" fw={600}>Medium bold</Text>
```

## Spacing Scale

| Token | Value | Use for |
|-------|-------|---------|
| `xs` | 4px | Tight gaps, icon margins |
| `sm` | 8px | Compact spacing |
| `md` | 16px | Default content spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Major section breaks |

```typescript
<Stack gap="md">       // 16px vertical gap
<Group gap="sm">       // 8px horizontal gap
<Paper p="lg">         // 24px padding
<Container py="xl">    // 32px vertical padding
```

## Component Defaults

These are set in the theme — don't override unless you have a specific reason:

| Component | Defaults |
|-----------|----------|
| `Button` | `radius: 10px`, `size: "sm"`, `fz: "md"` |
| `Card` / `Paper` | `radius: "md"`, `shadow: "xs"`, `p: "lg"` |
| `Modal` | `centered`, `size: "100%"`, `maw: "550px"` |
| `Drawer` | `position: "right"`, `maw: "553px"` |
| `Menu` | `width: 262`, `shadow: "md"`, `position: "bottom-end"` |

## State Patterns

Use consistent UI state components:

```typescript
// Loading — skeleton wrapper
import { WithSkeletonWrapper } from "@/components/ui/WithSkeletonWrapper";
<WithSkeletonWrapper isLoading={isLoading}>{children}</WithSkeletonWrapper>

// Loading with text
import { LoaderWithText } from "@/components/ui/LoaderWithText";
<LoaderWithText title="Section" loaderText="Loading..." icon={icon} />

// Empty state
import { EmptyState } from "@/components/ui/EmptyState";
<EmptyState title="No data" description="Add your first item" withBorder />

// Error
{error && <Text c="red">{error}</Text>}

// Button loading
<Button loading={isSubmitting}>Save</Button>
```

## Light & Dark Mode

Mantine color shades (e.g., `grey.0`, `primary.9`) are **static** — they do not flip between light and dark mode. Using them for backgrounds or text creates contrast failures in the opposite scheme.

**Use Mantine's built-in props and variants instead of explicit shade-based colors for backgrounds and surfaces.** These adapt automatically:

```typescript
// WRONG — shade is static, invisible in dark mode
<Paper bg="grey.0">
<Box bg="grey.1">
<Paper bg="primary.0">

// RIGHT — Mantine variant props handle light/dark automatically
<Paper withBorder>                          // border provides contrast in both modes
<Paper bg="var(--mantine-color-default-hover)">  // adaptive subtle background
<ThemeIcon variant="light">                 // light variant adapts to scheme
<Badge variant="light" color="primary">     // light variant with color adapts
<Alert variant="light">                     // built-in scheme awareness

// RIGHT — CSS variables that auto-adapt
bg="var(--mantine-color-body)"              // page background
bg="var(--mantine-color-default)"           // component default background
bg="var(--mantine-color-default-hover)"     // subtle elevated background
c="var(--mantine-color-text)"               // primary text
c="var(--mantine-color-dimmed)"             // secondary text
```

### When shades are acceptable

Color shades (`primary.5`, `success.7`) are fine for:
- **Component `color` props** — `<Badge color="primary">`, `<ThemeIcon color="success">` — Mantine uses the shade with its own variant logic that handles both modes
- **Accent/brand elements** — where the color itself is the point (icons, status indicators)
- **Text color on known backgrounds** — e.g., white text on a primary-colored button

Shades are **not** acceptable for:
- **Surface backgrounds** (`bg` prop on Paper, Box, Card, Stack) — use adaptive CSS variables or `withBorder`
- **Page/section backgrounds** — use `var(--mantine-color-body)` or `var(--mantine-color-default)`
- **Text on auto-themed surfaces** — use `c="dimmed"` or omit for default

## Rules

1. **Never hardcode colors** — use Mantine color props or CSS variables
2. **Never hardcode spacing** — use Mantine spacing tokens (`xs`, `sm`, `md`, `lg`, `xl`)
3. **Never set custom font-family** — the theme handles it globally
4. **Use component defaults** — don't override radius, shadow, size unless necessary
5. **Use semantic state components** — `WithSkeletonWrapper`, `EmptyState`, `LoaderWithText`
6. **Dark mode ready** — use Mantine adaptive props/variables for surfaces, never static shades for backgrounds
