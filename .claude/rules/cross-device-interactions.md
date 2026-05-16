# Cross-Device Interactions

---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "**/*.module.css"
---

Rules for building interactions that work across desktop, tablet, and mobile.

> **Guiding lens:** Imagine you are a dumb human in 2026 trying to do this task for the first time — on a phone, on a tablet, with a trackpad, with a touchscreen. They will not know which interactions are "hover-only" vs "tap-only". Every interactive element must work the first time, on every device, without prior context.

## No JavaScript Hover Events

Never use `onMouseEnter` or `onMouseLeave` for visual hover effects. They don't work on touch devices and create inconsistent experiences.

```typescript
// WRONG — JavaScript hover events
<Card onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

// RIGHT — CSS-only hover via Mantine styles or CSS modules
<Card className={classes.card}>
// .card:hover { box-shadow: var(--mantine-shadow-md); }

// RIGHT — CSS-only via Mantine style prop
<Card style={{ "&:hover": { opacity: 0.8 } }}>
```

**Exception:** `onMouseEnter`/`onMouseLeave` are acceptable for non-visual logic like analytics tracking or prefetching.

## Responsive Layout Patterns

Use Mantine's responsive props with object syntax — mobile-first:

```typescript
// Grid columns — full width on mobile, split on desktop
<GridCol span={{ base: 12, lg: 6 }}>

// SimpleGrid — responsive column count
<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>

// Responsive image sizing
<Image w={{ base: "100%", md: "400px" }} />
```

### Navbar Collapse

Use Mantine AppShell's built-in responsive navbar:

```typescript
navbar={{
  width: 260,
  breakpoint: "md",
  collapsed: { mobile: !opened },
}}
```

### Breakpoints

| Name | Width | Use for |
|------|-------|---------|
| `base` | 0px+ | Mobile default |
| `sm` | 576px+ | Large phones |
| `md` | 768px+ | Tablets |
| `lg` | 992px+ | Desktop |
| `xl` | 1200px+ | Large desktop |

Always design **mobile-first** — `base` is the default, larger breakpoints add complexity.

## Touch Targets

- Minimum touch target: 44x44px (WCAG 2.5.5)
- Use Mantine's `size` prop on interactive elements — `"sm"` minimum for buttons
- Add adequate spacing between clickable elements on mobile

## Click Over Hover

All interactive states must be click/tap activated, not hover-dependent:

```typescript
// WRONG — content only visible on hover
<Tooltip label="Details" openEvents={{ hover: true }}>

// RIGHT — content accessible via click
<Popover>
  <Popover.Target>
    <ActionIcon><IconInfo /></ActionIcon>
  </Popover.Target>
  <Popover.Dropdown>Details here</Popover.Dropdown>
</Popover>
```

## CSS Hover Safety

When using CSS hover, wrap in `@media (hover: hover)` to prevent sticky hover on touch:

```css
@media (hover: hover) {
  .card:hover {
    box-shadow: var(--mantine-shadow-md);
  }
}
```

Or use Mantine's built-in component hover styles which handle this automatically.

## Cursor Management

Set appropriate cursors on interactive elements:

```typescript
// Already handled by theme defaults:
// - Card: cursor: "default"
// - Menu: cursor: "pointer"
// - UnstyledButton: hover opacity

// For custom interactive elements:
<Box style={{ cursor: "pointer" }} onClick={handleClick}>
```
