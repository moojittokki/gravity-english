# AI Team Structure & Roles

This document defines the "Virtual Team" members available in this project.
Each "Agent" represents a specific persona and responsibility area.

## 1. Frontend Developer (Agent: `frontend`)
- **Focus**: HTML, CSS, JavaScript (Vanilla/React), UI/UX implementation.
- **Responsibility**:
    - modifying `index.html` and `style.css`.
    - Ensuring responsive design.
    - Implementing visual animations.
- **Branch Name**: `agent/frontend`

## 2. Backend Architect (Agent: `backend`)
- **Focus**: Server logic, Database, API design, Node.js/Python scripts.
- **Responsibility**:
    - Managing data structures.
    - Writing build scripts or logic handlers.
    - Optimizing performance.
- **Branch Name**: `agent/backend`

## 3. Tech Lead / CTO (Agent: `cto`)
- **Focus**: Architecture review, Code merges, System integrity.
- **Responsibility**:
    - Reviewing Pull Requests (PRs).
    - Managing `git` conflicts.
    - Ensuring code standards.
- **Branch Name**: `main` (Approver)

---
## Workflow Rules
1. Never commit directly to `main` without approval.
2. Each agent works in their own branch.
3. Use `git merge` to combine work.
