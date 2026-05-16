---
name: validate
description: Comprehensive validation pipeline - build, runtime, and integration testing
argument-hint: "[build|runtime|integration|all]"

---

# Validate: Runtime & Build Verification

Run comprehensive validation checks on the codebase, including build, runtime, and integration testing. Use this to verify code quality before commits or to diagnose issues.

**Input:** $ARGUMENTS (optional) — Validation scope: `build`, `runtime`, `integration`, or `all` (default)

---

## Step 1: Determine Validation Scope

Parse `$ARGUMENTS` to determine what to validate:

- **`build`** — Build & compile validation only
- **`runtime`** — Runtime error detection only
- **`integration`** — Integration testing only
- **`all`** or no arguments — Run all three (recommended)

---

## Step 2: Run Validations

Based on scope, spawn the appropriate validation agents **in parallel**:

### Build Validation (if scope includes `build` or `all`)

```
Task(
  description: "Validate build & compile",
  subagent_type: "build-validator",
  model: "haiku",
  prompt: "Run full build validation. Check TypeScript, ESLint, production build, and dependencies. Report all errors and warnings."
)
```

### Runtime Validation (if scope includes `runtime` or `all`)

```
Task(
  description: "Monitor runtime errors",
  subagent_type: "dev-server-monitor",
  model: "haiku",
  prompt: "Start dev server, monitor for runtime errors, and validate critical pages load successfully. Report all console errors and page load failures."
)
```

### Integration Testing (if scope includes `integration` or `all`)

```
Task(
  description: "Test integration flows",
  subagent_type: "integration-tester",
  model: "sonnet",
  prompt: "Test API routes and user flows. Verify end-to-end integration. Report all failures with full context."
)
```

**IMPORTANT:** Launch all applicable agents in parallel (single message with multiple Task tool calls) for speed.

---

## Step 3: Consolidate Results

After all agents complete, consolidate their reports:

```markdown
# Validation Report

## Overall Status: ✅ PASS | ⚠️ WARNINGS | ❌ FAIL

---

## Build Validation
[Results from build-validator]

---

## Runtime Validation
[Results from dev-server-monitor]

---

## Integration Testing
[Results from integration-tester]

---

## Summary

### Errors
- Build Errors: [count]
- Runtime Errors: [count]
- Integration Failures: [count]

### Warnings
- Build Warnings: [count]
- Runtime Warnings: [count]

### Recommendations
[If failures, list priority fixes]

---

## Next Steps

- ✅ All validations passed → Ready to commit
- ⚠️ Warnings only → Review warnings, consider fixing
- ❌ Failures detected → Fix errors before committing
```

---

## Usage Examples

### Validate Everything (Recommended)
```
/validate
```
or
```
/validate all
```

### Validate Build Only (Quick Check)
```
/validate build
```

### Validate Runtime Only (After Code Changes)
```
/validate runtime
```

### Validate Integration Only (After API Changes)
```
/validate integration
```

---

## When to Use

- **Before commits** — Catch errors before they enter git history
- **After refactoring** — Verify nothing broke
- **Before PR creation** — Ensure production readiness
- **Debugging runtime errors** — Systematically identify issues
- **After dependency updates** — Verify compatibility

---

## Critical Rules

- **PARALLEL EXECUTION** — Run all agents in parallel when scope is `all`
- **REPORT ONLY** — Validation agents never modify code
- **COMPREHENSIVE** — Include full context for all failures
- **ACTIONABLE** — Provide clear next steps for fixing issues
