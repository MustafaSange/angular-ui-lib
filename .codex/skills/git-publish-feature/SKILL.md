---
name: git-publish-feature
description: Publish all current repository changes on a new feature branch with a meaningful branch name, commit subject and descriptive body, then push it with an upstream. Use when the user asks to create a feature branch, stage all changes, commit them with a proper title/description or message, and push the branch.
---

# Publish a Feature Branch

Inspect, package, and publish the repository's complete current working tree without altering the implementation.

## Workflow

1. Inspect repository state with `git status --short`, `git branch --show-current`, `git remote -v`, `git diff --stat`, and the relevant diffs. Include untracked files in the review.
2. Stop if there are no changes. Do not create an empty commit.
3. Check filenames and visible diff content for likely secrets, credentials, private keys, local environment files, or large generated artifacts. If any are present, stop before staging and ask the user how to proceed.
4. Derive a concise lowercase kebab-case branch summary from the dominant change. Create `feature/<summary>` from the current commit. If that branch already exists locally or remotely, choose a clear non-conflicting suffix unless reusing it is explicitly requested.
5. Stage the complete working tree with `git add -A`. “All changes” includes tracked modifications, deletions, and untracked files; preserve unrelated user changes rather than discarding them.
6. Review the staged result with `git status --short`, `git diff --cached --stat`, `git diff --cached --check`, and enough of `git diff --cached` to verify the proposed commit description. Stop if staging reveals sensitive or clearly unintended content.
7. Write a commit message with:
   - an imperative, specific subject of at most 72 characters;
   - a short body explaining the material changes and why they belong together;
   - an accurate validation note only when a check was actually run.
8. Commit once. Do not bypass hooks. If a hook fails or modifies files, inspect the result and resolve only issues within the requested scope before retrying.
9. Push with `git push -u origin <branch>`. Request execution or network approval when required; never force-push.
10. Verify and report the branch name, short commit hash, full commit subject, upstream, checks run, and whether the working tree is clean.

## Naming and Message Guidance

- Prefer branch names such as `feature/add-command-palette`.
- Prefer Conventional Commit subjects when they fit, such as `feat: add command palette`.
- Describe the actual diff; do not invent issue numbers, test results, reviewers, or release impact.
- A Git branch has no title or description metadata. Interpret those words as the commit subject and body unless the user explicitly asks for a pull request.

## Boundaries

- Do not amend, squash, rebase, merge, tag, open a pull request, or delete branches unless explicitly requested.
- Do not pull or modify the remote default branch as part of this workflow.
- Do not discard, reset, clean, or rewrite existing user changes.
- If the repository has no `origin`, authentication fails, or the push is rejected, preserve the local branch and commit and report the exact blocker.
