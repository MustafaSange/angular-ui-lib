---
name: git-commit-and-push
description: Stage all current repository changes, create one commit with a concise accurate message, and push the current branch. Use when the user asks to stage everything, commit with a proper brief message, and push without creating a new branch.
---

# Commit and Push Changes

1. Inspect `git status --short`, the current branch/upstream, remotes, `git diff --stat`, relevant diffs, and untracked files. Stop if there are no changes.
2. Stop and ask before staging likely secrets, credentials, private keys, local environment files, or large generated artifacts. If on the remote default branch, require explicit confirmation before committing unless the user already named that branch.
3. Stage the complete working tree with `git add -A`, preserving all user changes.
4. Review `git status --short`, `git diff --cached --stat`, `git diff --cached --check`, and enough of the staged diff to verify intent. Stop on sensitive or clearly unintended content.
5. Derive one imperative, specific commit subject of at most 72 characters. Prefer Conventional Commits when they fit; do not invent issue numbers or validation results.
6. Commit once without bypassing hooks. If a hook fails or changes files, inspect the result before retrying.
7. Push the current branch with `git push` when it has an upstream; otherwise use `git push -u origin <current-branch>`. Never force-push.
8. Report the branch, short commit hash, subject, upstream, checks actually run, and final working-tree state.

Do not create, rename, merge, rebase, amend, tag, or delete branches; open a pull request; discard changes; or modify unrelated implementation.
