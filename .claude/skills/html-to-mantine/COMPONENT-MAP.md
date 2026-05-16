# HTML to Mantine Component Map

Quick-reference mapping of HTML/CSS patterns to their Mantine v8 equivalents.

## Layout

| HTML/CSS Pattern | Mantine Component | Notes |
|-----------------|-------------------|-------|
| `display: flex; flex-direction: column` | `<Stack>` | Default `gap="sm"`, `w="100%"` |
| `display: flex; flex-direction: row` | `<Group>` | Default `gap="md"`, `wrap="nowrap"` |
| `display: flex` (complex) | `<Flex>` | Default `justify="space-between"`, `align="center"` |
| `display: grid` | `<SimpleGrid>` or `<Grid>` | SimpleGrid for equal cols, Grid for custom |
| Generic container | `<Box>` | No visual styling, just a div |
| Content wrapper | `<Container>` | Default `fluid`, `p={0}` |
| Full-page layout | `<AppShell>` | With `Navbar`, `Header`, `Main` |
| Centered content | `<Center>` | |
| Spacer | `<Space>` | `h="md"` for vertical, `w="md"` for horizontal |
| `<hr>` / divider | `<Divider>` | |

## Typography

| HTML | Mantine | Props |
|------|---------|-------|
| `<h1>` - `<h6>` | `<Title order={1-6}>` | |
| `<p>`, `<span>` | `<Text>` | `size`, `fw`, `c`, `tt` |
| Bold text | `<Text fw={700}>` | or `fw="bold"` |
| Muted/secondary text | `<Text c="dimmed">` | |
| Small text | `<Text size="sm">` | |
| Extra small | `<Text size="xs">` | |
| Link text | `<Anchor>` | Default `size="sm"` |
| Code | `<Code>` | |
| Highlighted text | `<Highlight>` | `highlight="search term"` |
| Blockquote | `<Blockquote>` | |

## Surfaces & Cards

| HTML/CSS Pattern | Mantine | Notes |
|-----------------|---------|-------|
| Card with border | `<Card>` | Defaults: `radius="md"`, `shadow="xs"`, `padding="lg"`, `withBorder` |
| Card section | `<Card.Section>` | Full-width section inside Card |
| Bordered container | `<Paper>` | Defaults: `radius="md"`, `p="md"`, `withBorder` |
| Elevated container | `<Paper shadow="sm">` | |
| No border card | `<Paper withBorder={false}>` | |

## Forms

| HTML | Mantine | Notes |
|------|---------|-------|
| `<input type="text">` | `<TextInput>` | Default `radius="md"`, `size="sm"` |
| `<input type="number">` | `<NumberInput>` | |
| `<input type="password">` | `<PasswordInput>` | |
| `<input type="email">` | `<TextInput type="email">` | |
| `<textarea>` | `<Textarea>` | Default `autosize`, `minRows=4` |
| `<select>` | `<Select>` | Searchable, clearable options |
| `<select multiple>` | `<MultiSelect>` | |
| `<input type="checkbox">` | `<Checkbox>` | |
| `<input type="radio">` | `<Radio>` | Wrap in `<Radio.Group>` |
| Toggle/switch | `<Switch>` | |
| Date picker | `<DateInput>` or `<DatePickerInput>` | |
| File upload | `<Dropzone>` | From `@mantine/dropzone` |
| Slider | `<Slider>` | |
| Form group with label | Use `label` prop on input | All inputs support `label`, `description`, `error` |

## Buttons & Actions

| HTML/CSS | Mantine | Notes |
|----------|---------|-------|
| `<button>` primary | `<Button>` | Default `size="sm"`, `radius={10}` |
| `<button>` secondary | `<Button variant="outline">` | or `variant="light"` |
| `<button>` ghost | `<Button variant="subtle">` | |
| `<button>` danger | `<Button color="danger">` | |
| Icon-only button | `<ActionIcon>` | Default `size="md"`, `radius="xl"` |
| Button group | `<Button.Group>` | |
| Link styled as button | `<Button component="a">` | |
| Unstyled clickable | `<UnstyledButton>` | |

## Data Display

| HTML/CSS | Mantine | Notes |
|----------|---------|-------|
| `<table>` | `<Table>` | Default `highlightOnHover` |
| Complex data table | `MantineReactTable` | From `mantine-react-table` |
| `<ul>`, `<ol>` | `<List>` | Default `size="xs"`, `spacing="sm"` |
| Status label | `<Badge>` | Default `size="md"`, `tt="none"` |
| Key-value pair | `<Group><Text>Label</Text><Text>Value</Text></Group>` | |
| Avatar/profile image | `<Avatar>` | Default `radius="sm"`, `size="md"` |
| `<img>` | `<Image>` | |
| Stat/metric | `<Text size="xl" fw={700}>` in a `<Stack>` | |
| Tooltip | `<Tooltip>` | Default `withArrow`, `multiline` |
| Accordion | `<Accordion>` | Default `variant="separated"` |
| Timeline | `<Timeline>` | |
| Progress bar | `<Progress>` | Default `size="sm"` |

## Feedback

| HTML/CSS | Mantine | Notes |
|----------|---------|-------|
| Alert/banner | `<Alert>` | Default `variant="light"` |
| Toast/notification | `notifications.show()` | From `@mantine/notifications` |
| Loading spinner | `<Loader>` | Default `size="sm"`, `type="dots"` |
| Loading overlay | `<LoadingOverlay>` | |
| Skeleton placeholder | `<Skeleton>` | |
| Empty state | `<Center>` + `<Stack>` + `<Text c="dimmed">` | |

## Navigation

| HTML/CSS | Mantine | Notes |
|----------|---------|-------|
| Tab navigation | `<Tabs>` | Default `keepMounted={false}` |
| Sidebar link | `<NavLink>` | |
| Breadcrumbs | `<Breadcrumbs>` | |
| Pagination | `<Pagination>` | |
| Stepper | `<Stepper>` | |

## Overlays

| HTML/CSS | Mantine | Notes |
|----------|---------|-------|
| Modal dialog | `<Modal>` | Default `centered`, `size="100%"`, max `550px` |
| Side drawer | `<Drawer>` | Default `position="right"`, max `553px` |
| Dropdown menu | `<Menu>` | Default `withArrow`, `position="bottom-end"` |
| Popover | `<Popover>` | |
| Hover card | `<HoverCard>` | |

## Color Tokens for Light/Dark

| Intent | Light Mode Approach | Dark Mode Approach | Universal Prop |
|--------|--------------------|--------------------|----------------|
| Primary text | Inherits from theme | Inherits from theme | (no prop needed) |
| Secondary text | gray.7 | gray.4 | `c="dimmed"` |
| Disabled text | gray.5 | dark.3 | `c="dimmed"` + `opacity` |
| Primary accent | primary.5 | primary.4 | `c="primary"` |
| Success | success.7 | success.4 | `color="success"` |
| Warning | warning.7 | warning.4 | `color="warning"` |
| Danger/Error | danger.5 | danger.4 | `color="danger"` |
| Page background | white | dark.7 | `var(--mantine-color-body)` |
| Card background | white | dark.6 | Use `Card` or `Paper` |
| Subtle background | gray.0 | dark.6 | `light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))` |
| Border | gray.3 | dark.4 | `withBorder` on Card/Paper |

## Responsive Patterns

```tsx
// Responsive columns
<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>

// Responsive visibility
<Box visibleFrom="sm">Desktop only</Box>
<Box hiddenFrom="sm">Mobile only</Box>

// Responsive spacing
<Stack gap={{ base: "sm", md: "lg" }}>
```
