# Zod Enum Patterns

## Never use `z.nativeEnum()`

Always use `z.enum()` instead.

## Prefer Canonical Zod Enum Schemas

When a Zod enum schema already exists, **reuse it directly**. Never recreate from an array.

```typescript
// BAD - Recreating from array with ugly cast
import { CHUNK_TYPES } from "./types";
const schema = z.object({
  chunk_type: z.enum(CHUNK_TYPES),
});

// GOOD - Reuse the canonical Zod schema
import { ChunkTypeEnum } from "./types";
const schema = z.object({
  chunk_type: ChunkTypeEnum,
});
```

## When to Define New Zod Enums

```typescript
// Define a canonical Zod schema alongside the values
export const StatusEnum = z.enum(["active", "inactive", "pending"]);
export type Status = z.infer<typeof StatusEnum>;
export const STATUS_VALUES = StatusEnum.options;

// For existing TS enums, create once and export
export const LegacyStatusValues = Object.values(LegacyStatus);
export const LegacyStatusEnum = z.enum(LegacyStatusValues);
```

## Rule Summary

1. **Zod schema exists** -> Import and use it directly
2. **Need new enum** -> Define canonical `z.enum()` schema, export it
3. **Never** inline `as [string, ...string[]]` casts in tool/API schemas
