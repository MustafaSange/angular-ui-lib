---
name: review-and-optimize-code
description: Review code for correctness, readability, maintainability, edge cases, duplication, naming, complexity, error handling, testability, performance, and project gaps. Use when asked to review, audit, optimize, safely refactor, review-and-fix, or assess code quality. Support review-only and explicitly authorized review-and-apply modes while preserving existing behavior.
---

# Review and Optimize Code

Perform an evidence-based review. Make only changes with a clear practical benefit; never refactor merely to express a preference.

## Inputs

- **Required:** review target (files, diff, commit range, PR, or repository area). Infer the target from context when clear.
- **Mode:** default to review-only. Use review-and-apply only when the user explicitly asks to fix, improve, refactor, or optimize.
- **Optional:** intended behavior, acceptance criteria, comparison base, constraints, priorities, exclusions, and validation commands.

Inspect available context before asking questions. Ask only when missing information would materially change the result; otherwise state the assumption.

## Workflow

1. Read applicable repository instructions, version-control state, and only the target, contracts, consumers, and tests needed to understand behavior. Preserve unrelated changes.
2. Establish intended behavior and relevant validation commands from requirements, types, tests, callers, documentation, and project patterns. Note pre-existing failures.
3. Review for:
   - correctness, state/contract violations, races, leaks, and logic errors;
   - empty, null, boundary, malformed, large, concurrent, retry, cancellation, partial-failure, locale, and time-zone cases when relevant;
   - unclear control flow, misleading names, hidden side effects, stale comments, duplication, coupling, fragile conditionals, and unnecessary complexity;
   - swallowed errors, unsafe fallbacks, lost context, incomplete cleanup, poor diagnostics, and weak validation;
   - nondeterminism, hard-coded dependencies, excessive global state, and other testability problems;
   - demonstrated or high-probability performance problems, never speculative micro-optimizations;
   - missing tests, documentation, dependencies, configuration, validation, migration/compatibility support, and architectural boundaries.
4. Trace important findings through callers and tests. Cite locations, evidence, impact, and a concrete remedy. Omit style preferences and unsupported speculation.
5. Classify each finding once:
   - **Critical fixes:** correctness, security, data loss, severe reliability, broken contracts, or release blockers.
   - **Recommended improvements:** practical benefits that outweigh regression risk, complexity, and churn.
   - **Optional suggestions:** useful low-priority polish or future work.
6. In review-only mode, make no edits or external mutations. In review-and-apply mode, apply in-scope critical fixes and worthwhile recommended improvements using the smallest coherent change; leave optional items unapplied unless requested.
7. Review the final diff and run proportionate tests, type checks, lint, builds, integration checks, or benchmarks. Exercise affected happy, error, boundary, and compatibility paths. Report exactly what passed, failed, or was not run.
8. Produce the concise report below. If no actionable issues exist, say so rather than inventing findings.

## Safety Rules

- Preserve observable behavior, public APIs, wire/persistence formats, side effects, accessibility, compatibility, and project conventions unless explicitly authorized otherwise.
- Do not discard, overwrite, reformat, or broaden into unrelated user work.
- Do not change dependencies, lockfiles, generated files, schemas, configuration, deployment, or architecture without clear need and authorization.
- Do not weaken validation, silence errors, remove safeguards, or delete tests to make checks pass.
- Stop before destructive actions, credentials, external coordination, breaking changes, or materially broader product decisions.
- Distinguish facts, inferences, and assumptions. Never claim unrun verification.

## Output Format

Omit empty sections except Summary and Verification.

```markdown
## Summary
<Scope, assessment, and outcome in 2–5 sentences.>

## Critical fixes
- **[Severity] Finding** — `path:line`: <evidence, impact, and fix/recommendation>

## Recommended improvements
- **Finding** — `path:line`: <evidence, benefit, and change/recommendation>

## Optional suggestions
- **Suggestion** — `path:line`: <benefit and why optional>

## Changes made
- <Only changes actually applied.>

## Gaps
- **Tests | Documentation | Dependencies | Configuration | Validation | Architecture:** <gap and consequence>

## Verification
- Passed/failed/not run: `<command or scenario>` — <result or reason>

## Assumptions, risks, and remaining issues
- <Only material items.>
```

## Acceptance Criteria

- Cover correctness, clarity, maintainability, relevant edge cases, error handling, testability, and project gaps.
- Include only evidence-backed, practically useful findings separated into critical, recommended, and optional groups.
- Keep applied changes behavior-preserving, minimal, scoped, convention-aligned, and free of unrelated churn.
- Verify affected behavior proportionately and report exact checks and limitations.
- Summarize findings, changes, assumptions, risks, and remaining issues concisely.

## Examples

```text
Use $review-and-optimize-code in review-only mode on the authentication service. Focus on correctness, error handling, and missing tests. Do not edit files.
```

```text
Use $review-and-optimize-code to review and safely improve this branch. Apply critical fixes and worthwhile recommended improvements, preserve behavior, and run existing checks.
```

```markdown
## Summary
Reviewed invoice proration in review-only mode. One boundary defect can undercharge invoices; no files were changed.

## Critical fixes
- **[High] Final billing day excluded** — `src/billing/proration.ts:48`: Exclusive end-date logic omits a covered day. Use the documented inclusive interval and add boundary tests.

## Gaps
- **Tests:** Missing one-day, leap-day, and month-end coverage.

## Verification
- Passed: `npm test -- billing`

## Assumptions, risks, and remaining issues
- Assumed billing periods are inclusive based on the API contract and callers.
```
