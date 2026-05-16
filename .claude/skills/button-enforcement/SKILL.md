---
name: button-enforcement
description: >
  Enforces consistent button usage across the codebase by ensuring all button
  elements use the shared Button component from components/ui/Button.tsx. Trigger
  this skill when writing UI code that includes buttons, reviewing components for
  button consistency, adding click actions, creating forms, building toolbars,
  modals, dialogs, or any interactive element that uses a button. Also trigger when
  the user mentions "button audit", "button consistency", "fix buttons", "button
  component", "use shared button", or "standardize buttons".
---

# Button Enforcement — Shared Button Component Usage

All button elements in this codebase use the shared Button component from `components/ui/Button.tsx`. This ensures visual consistency, centralized theming, and predictable behavior across the entire application.

## Shared Button Variants

The shared component exports these semantic variants — each maps to a specific Mantine `variant` + `color` combination:

| Export | Use Case | Mantine Variant |
|--------|----------|-----------------|
| `PrimaryButton` | Primary actions (submit, save, create) | `variant="filled"` |
| `SecondaryButton` | Secondary actions (cancel, back, dismiss) | `variant="default"` |
| `DangerButton` | Destructive actions (delete, remove) | `variant="filled" color="red"` |
| `SubtleDangerButton` | Soft destructive actions | `variant="light" color="red"` |
| `TertiaryButton` | Tertiary actions (outline style) | `variant="outline"` |
| `SubtleButton` | Low-emphasis actions | `variant="subtle"` |
| `LightButton` | Light background actions | `variant="light"` |
| `BadgeButton` | Small badge-style buttons | Custom `color="border.6"` |
| `CancelButton` | Cancel with `onClose` prop | Wraps `SecondaryButton` |

All variants accept `ButtonComponentProps`:

```typescript
import { ButtonProps, MantineSize } from "@mantine/core";
import { IconRendererProps } from "@/types/local";

type ButtonComponentProps = ButtonProps &
  React.ComponentPropsWithoutRef<"button"> & {
    children: React.ReactNode;
    icon?: IconRendererProps;       // Left icon (Tabler icon name)
    iconSize?: number | MantineSize;
    rightIcon?: IconRendererProps;  // Right icon
    component?: any;               // Override rendered element
    href?: string;                 // For link-like buttons
  };
```

## Import Path

```typescript
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  SubtleDangerButton,
  TertiaryButton,
  SubtleButton,
  LightButton,
  BadgeButton,
  CancelButton,
} from "@/components/ui/Button";
```

## What to Use Instead

| Prohibited Pattern | Replacement |
|---|---|
| `<button>` (raw HTML) | Use the semantic variant that matches the action |
| `<Button>` from `@mantine/core` | Use the shared variant — it wraps Mantine internally |
| `<MantineButton>` or aliased Mantine imports | Use the shared variant |
| Inline `variant="filled"` on Mantine Button | Use `PrimaryButton` |
| Inline `variant="default"` on Mantine Button | Use `SecondaryButton` |
| Inline `variant="outline"` on Mantine Button | Use `TertiaryButton` |
| Inline `variant="subtle"` on Mantine Button | Use `SubtleButton` |
| Inline `variant="light"` on Mantine Button | Use `LightButton` |
| Inline `color="red"` button combinations | Use `DangerButton` or `SubtleDangerButton` |
| Custom styled `<div onClick>` acting as button | Use the semantic variant with appropriate props |
| `<ActionIcon>` for actions with text labels | Use the shared variant with `icon` prop |

## Choosing the Right Variant

Pick the variant based on the semantic role of the action, not visual preference:

- **Is this the primary action on the page/modal?** Use `PrimaryButton`.
- **Is this a secondary/dismissive action?** Use `SecondaryButton`.
- **Is this destructive (delete, remove, revoke)?** Use `DangerButton`. If it appears alongside other destructive actions or in a less prominent position, use `SubtleDangerButton`.
- **Is this a tertiary action with visible boundaries?** Use `TertiaryButton`.
- **Is this a low-emphasis supplementary action?** Use `SubtleButton`.
- **Is this a soft-background action?** Use `LightButton`.
- **Is this a small label-like button?** Use `BadgeButton`.
- **Is this specifically a cancel action with an `onClose` handler?** Use `CancelButton`.

## Icons

The shared Button supports icons through the `icon` and `rightIcon` props, which accept Tabler icon names (the `IconRendererProps` type). This eliminates the need to manually compose `leftSection` or `rightSection`:

```typescript
// Correct — use icon prop
<PrimaryButton icon="IconPlus">Create Campaign</PrimaryButton>

// Incorrect — manually composing sections
<Button leftSection={<IconPlus size={16} />} variant="filled">Create Campaign</Button>
```

## Loading State

The shared Button handles loading state with a spinner overlay. Pass `loading={true}`:

```typescript
<PrimaryButton loading={isSubmitting}>Save Changes</PrimaryButton>
```

This replaces the left icon with a spinner automatically — no need to conditionally render loaders.

## Exceptions

The only acceptable cases for not using the shared Button component:

1. **Inside `components/ui/Button.tsx` itself** — the base `Button` function wraps Mantine internally.
2. **`ActionIcon` for icon-only buttons** (no text label) — `ActionIcon` from Mantine is appropriate when there is no text, only an icon.
3. **Third-party component libraries** that render their own buttons internally (e.g., date pickers, rich text editors) — you cannot control these.

Everything else uses the shared variants.

## Audit Workflow

When asked to audit or fix button usage, follow these steps:

1. Search for raw `<button` tags, direct `@mantine/core` Button imports, and inline variant/color combinations.
2. For each violation, identify the semantic role of the action.
3. Replace with the matching shared variant.
4. Verify the import path is `@/components/ui/Button`.
5. Remove any now-unused Mantine Button imports.

Search patterns for finding violations:

```
# Raw HTML buttons
<button

# Direct Mantine Button imports (should only appear in components/ui/Button.tsx)
import { Button } from "@mantine/core"
import { Button, ... } from "@mantine/core"

# Inline variant usage on Mantine Button
<Button variant=

# Clickable divs acting as buttons
<div onClick
<span onClick
```
