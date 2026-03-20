---
name: goal-driven-task-planner
description: Plans work from a user-provided goal: derives a short mnemonic, creates tasks/[mnemonic] with individual task markdown files and an index.md describing task ordering. Use when the user describes a goal and asks to plan it, break it into tasks, or create an execution plan.
---

# Goal-Driven Task Planner

Plan work from a user-provided goal. Create a mnemonic, a dedicated task folder, individual task files, and an index that describes execution order. The user supplies the goal; the agent may inspect the codebase to gather information for planning.

## Workflow

### 1. Derive a mnemonic

From the user's goal, create a short mnemonic (lowercase, hyphens, 2–4 words) that captures the goal. Examples:

- "Add user login feautue" → `user-login-feature`
- "Implement cart and checkout" → `cart-checkout`

### 2. Create the task folder

Create `tasks/[mnemonic]/` if it does not exist.

### 3. Inspect the codebase if needed (for planning)

Explore the repository as needed to understand how to accomplish the goal:

- Locate relevant code, tests, and documentation
- Identify patterns, interfaces, or extension points to follow
- Note dependencies, file locations, and any constraints

Use this context to inform the task breakdown.

If repository doesn't have any code yet, or if the goal is more research-oriented, app design, you can skip this step and proceed to planning based on general knowledge, assumptions and best industry practices.

**Surface major problems**: If inspection or initial thinking reveals issues that would prevent accomplishing the goal in a reasonable number of steps (e.g., missing foundations, architectural blockers, conflicting designs), report them to the user before or alongside the plan. Do not proceed with a plan that is likely infeasible without flagging these problems.

### 4. Plan the tasks

Break the goal into discrete, actionable tasks. Each task should be:

- **Actionable**: Clear enough for an agent to execute without ambiguity
- **Scoped**: Completable in a single session
- **Ordered**: Dependencies respected (prerequisites first)
- **Testable**: Has clear acceptance criteria for completion. Add tests for functional changes.

### 5. Write individual task files

Create one markdown file per task in `tasks/[mnemonic]/`. Use the task-runner format. **Keep descriptions succinct.**

**File naming**: `01-short-title.md`, `02-next-step.md`, etc. (numbered for ordering; index.md documents dependencies.)

```markdown
---
title: Short descriptive title
progress: pending
---

# Short descriptive title

<Succinct description of what to do, why, and context.>

## Scope

- Files or areas this task touches

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

### 6. Create index.md

Create `tasks/[mnemonic]/index.md` that describes the plan and task ordering:

```markdown
# [Mnemonic]: [Goal summary]

## Overview

<One or two sentences on the goal.>

## Task order

1. `01-first-task.md` — prerequisite / foundation
2. `02-second-task.md` — depends on 01
3. `03-third-task.md` — depends on 02
...
```

Keep the index short. The numbered list is the execution order; note dependencies only when non-obvious.

## Example

**User goal**: "Add user login feature with email and password authentication, including frontend form, backend API, and database integration."

**Mnemonic**: `user-login-feature`

**Folder**: `tasks/user-login-feature/`

**Task files**:
- `01-add-frotend-form.md` — Make login form with email/password fields and validation. UI testing should happen via Chrome DevTools or similar.
- `02-add-backend-api.md` — Create API endpoint for login, validate credentials.

**index.md**:
```markdown
# user-login-feature: Add user login feature with email and password authentication.

## Overview

Adds user login functionality, including a frontend form for input and a backend API for authentication. This enables users to securely access their accounts.

## Task order

1. `01-add-frotend-form.md` — Make login form with email/password fields and validation. UI testing should happen via Chrome DevTools or similar.
2. `02-add-backend-api.md` — Create API endpoint for login, validate credentials.
```

## After creating the plan

Stop after creating the task files and index. **Do not** launch task-runner agents unless the user explicitly asks to run or execute the tasks. Wait for the user to specify whether to proceed with execution.
