---
name: git-committer
description: Automates git commit workflows specifically for backend code changes, enforcing standardized commit message formats.
---

# Git Committer - Backend Workflow

This skill streamlines the git commit process for the backend. Use this whenever you are asked to commit backend changes.

## Commit Message Format

All backend commits must follow the `feat[Jacinth]: <description>` or `fix[Jacinth]: <description>` format.

- **feat**: For new backend functionality (e.g., adding new helper methods, endpoints).
- **fix**: For bug fixes (e.g., resolving database pathing issues).

## Workflow

1.  **Stage files:** Only stage the specific files changed (e.g., `git add src/models/Student.php`). Never use `git add .`.
2.  **Verify status:** Run `git status` to ensure only the correct files are staged.
3.  **Commit:** Execute `git commit -m "type[Jacinth]: description"` using the required format.
4.  **Confirm:** Run `git status` after the commit to confirm it was successful.

## Example

```bash
git add src/models/Student.php
git status
git commit -m "feat[Jacinth]: add getDetailsByStudentId method to Student model"
git status
```
