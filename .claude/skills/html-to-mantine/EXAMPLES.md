# HTML to Mantine Conversion Examples

Before/after examples showing common conversion patterns in this project.

## Example 1: Settings Card

### HTML Source

```html
<div class="card" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
  <h3 style="margin: 0 0 8px; font-size: 18px; color: #333;">Account Settings</h3>
  <p style="color: #666; font-size: 14px; margin: 0 0 16px;">Manage your account preferences</p>
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
    <div>
      <span style="font-size: 14px; color: #333;">Email Notifications</span>
      <p style="font-size: 12px; color: #999; margin: 4px 0 0;">Receive updates via email</p>
    </div>
    <input type="checkbox" checked />
  </div>
  <div style="margin-top: 16px; display: flex; gap: 8px;">
    <button style="background: #5196fe; color: white; border: none; padding: 8px 16px; border-radius: 8px;">Save</button>
    <button style="background: none; border: 1px solid #ddd; padding: 8px 16px; border-radius: 8px; color: #333;">Cancel</button>
  </div>
</div>
```

### Mantine Output

```tsx
<Card>
  <Stack>
    <div>
      <Title order={5}>Account Settings</Title>
      <Text size="sm" c="dimmed">Manage your account preferences</Text>
    </div>

    <Divider />

    <Group justify="space-between">
      <div>
        <Text size="sm">Email Notifications</Text>
        <Text size="xs" c="dimmed">Receive updates via email</Text>
      </div>
      <Switch checked={emailEnabled} onChange={handleToggle} />
    </Group>

    <Group gap="sm" justify="flex-end">
      <Button onClick={handleSave}>Save</Button>
      <Button variant="default" onClick={handleCancel}>Cancel</Button>
    </Group>
  </Stack>
</Card>
```

**Key changes:**
- `<div class="card">` → `<Card>` (inherits theme defaults: border, radius, padding, shadow)
- Inline flex → `<Group>` and `<Stack>`
- Hardcoded colors → removed (theme handles light/dark)
- `<input type="checkbox">` → `<Switch>` (better UX for toggles)
- Button styles → `<Button>` and `<Button variant="default">`
- All event handlers preserved: `handleToggle`, `handleSave`, `handleCancel`

## Example 2: Stats Dashboard

### HTML Source

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
  <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px;">
    <p style="color: #888; font-size: 12px; text-transform: uppercase;">Total Users</p>
    <h2 style="margin: 4px 0; font-size: 28px; color: #333;">1,234</h2>
    <span style="color: green; font-size: 12px;">+12% from last month</span>
  </div>
  <!-- repeat for other stats -->
</div>
```

### Mantine Output

```tsx
<SimpleGrid cols={{ base: 1, sm: 3 }}>
  <Paper>
    <Stack gap="xs">
      <Text size="xs" c="dimmed" tt="uppercase">Total Users</Text>
      <Title order={2}>1,234</Title>
      <Text size="xs" c="success.6">+12% from last month</Text>
    </Stack>
  </Paper>
  {/* repeat for other stats */}
</SimpleGrid>
```

**Key changes:**
- CSS Grid → `<SimpleGrid>` with responsive columns
- Card divs → `<Paper>` (lighter than Card, appropriate for stats)
- Hardcoded green → `c="success.6"` (theme-aware)
- All color tokens adapt to dark mode automatically

## Example 3: Data Table with Actions

### HTML Source

```html
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="border-bottom: 2px solid #eee;">
      <th style="text-align: left; padding: 12px; color: #666;">Name</th>
      <th style="text-align: left; padding: 12px; color: #666;">Status</th>
      <th style="text-align: right; padding: 12px;">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f0f0f0;">
      <td style="padding: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="avatar.png" style="width: 32px; height: 32px; border-radius: 50%;" />
          <span>John Doe</span>
        </div>
      </td>
      <td style="padding: 12px;">
        <span style="background: #e6f7e6; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Active</span>
      </td>
      <td style="padding: 12px; text-align: right;">
        <button style="background: none; border: none; cursor: pointer;">⋮</button>
      </td>
    </tr>
  </tbody>
</table>
```

### Mantine Output

```tsx
<Table>
  <Table.Thead>
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Status</Table.Th>
      <Table.Th ta="right">Actions</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    {users.map((user) => (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Group gap="sm">
            <Avatar src={user.avatar} radius="xl" size="sm" />
            <Text size="sm">{user.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Badge color="success" variant="light">Active</Badge>
        </Table.Td>
        <Table.Td ta="right">
          <Menu>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => handleEdit(user.id)}>Edit</Menu.Item>
              <Menu.Item color="danger" onClick={() => handleDelete(user.id)}>Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    ))}
  </Table.Tbody>
</Table>
```

**Key changes:**
- Raw `<table>` → Mantine `<Table>` with subcomponents
- Inline avatar styles → `<Avatar>` with props
- Status span with hardcoded colors → `<Badge color="success" variant="light">`
- Plain button → `<Menu>` with `<ActionIcon>` trigger
- All handlers preserved: `handleEdit`, `handleDelete`

## Example 4: Form Section

### HTML Source

```html
<form style="max-width: 500px;">
  <div style="margin-bottom: 16px;">
    <label style="display: block; font-size: 14px; color: #333; margin-bottom: 4px;">Campaign Name</label>
    <input type="text" placeholder="Enter name..." style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px;" />
  </div>
  <div style="margin-bottom: 16px;">
    <label style="display: block; font-size: 14px; color: #333; margin-bottom: 4px;">Description</label>
    <textarea placeholder="Describe your campaign..." style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; min-height: 100px;"></textarea>
  </div>
  <div style="display: flex; gap: 12px; margin-bottom: 16px;">
    <div style="flex: 1;">
      <label>Start Date</label>
      <input type="date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;" />
    </div>
    <div style="flex: 1;">
      <label>Budget</label>
      <input type="number" placeholder="0.00" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;" />
    </div>
  </div>
  <button type="submit" style="background: #5196fe; color: white; padding: 10px 20px; border: none; border-radius: 8px; width: 100%;">Create Campaign</button>
</form>
```

### Mantine Output

```tsx
<form onSubmit={handleSubmit}>
  <Stack maw={500}>
    <TextInput
      label="Campaign Name"
      placeholder="Enter name..."
      value={name}
      onChange={(e) => setName(e.currentTarget.value)}
    />

    <Textarea
      label="Description"
      placeholder="Describe your campaign..."
      value={description}
      onChange={(e) => setDescription(e.currentTarget.value)}
    />

    <Group grow>
      <DatePickerInput
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
      />
      <NumberInput
        label="Budget"
        placeholder="0.00"
        value={budget}
        onChange={setBudget}
        prefix="$"
        decimalScale={2}
      />
    </Group>

    <Button type="submit" fullWidth>Create Campaign</Button>
  </Stack>
</form>
```

**Key changes:**
- Manual label + input → Mantine input with `label` prop
- Layout divs → `<Stack>` and `<Group grow>`
- `<input type="date">` → `<DatePickerInput>` (from `@mantine/dates`)
- `<input type="number">` → `<NumberInput>` with formatting
- All form state and `handleSubmit` preserved
- Inherits theme defaults for radius, size, width
