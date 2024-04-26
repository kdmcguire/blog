---
title: "Commitlint and GitHub merge queue"
publishDate: "26 April 2024"
description: "Checking commits one last time to catch mistakes added in squash merges"
tags: ["dev", "devops", "github", "work"]
---

I'm writing this post because I was looking for something like this and couldn't find it, so maybe it will help someone else one day.

## Context

In my work, our dev -> release pipeline is surprisingly dependent on commitlint, the conventional commits standard, and semantic release. This system ensures we have good, structured commit messages that can be reliably understood for a 100% automated release workflow, including good release notes based on those commits. I'm not going to dive into that system in detail here because explaining that well would take more brain power than I have right now.

This post is about a specific problem I encountered when we turned on GitHub's merge queue feature. As an extra benefit, this solution will also avoid another problem we risked encountering every time we used the squash merge method and wrote our own commit message.

## The intent

In our CI workflow, which runs when a Pull Request (PR) is opened or updated, we have a `step` that runs commitlint to audit all of the new commits in the branch. It looks like this:

```yaml
- name: PR Commitlint
  run: pnpm exec commitlint --from ${{ github.event.pull_request.head.sha }}~${{ github.event.pull_request.commits }} --to ${{ github.event.pull_request.head.sha }} --verbose
```

(Note that this is a `step` in a `job` because that dictates the formatting. If yours is a `job` then it will look different.)

When we enabled the merge queue feature, I wanted our CI workflow to be used again to check that everything in the queue played nicely together.

## The error

The first time I tried to send a batch of merges through the merge queue, I got this error:

```bash
Run pnpm exec commitlint --from ~ --to  --verbose
file:///home/runner/work/web-platform/web-platform/node_modules/.pnpm/@commitlint+cli@19.2.2_@types+node@20.12.7_typescript@5.3.3/node_modules/@commitlint/cli/lib/cli.js:127
        throw err;
        ^

Error: fatal: ambiguous argument '/home/runner..HEAD': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'

    at Transform.transform [as _transform] (/home/runner/work/web-platform/web-platform/node_modules/.pnpm/git-raw-commits@4.0.0/node_modules/git-raw-commits/index.js:100:36)
    at Transform._write (node:internal/streams/transform:171:8)
    at writeOrBuffer (node:internal/streams/writable:564:12)
    at _write (node:internal/streams/writable:493:10)
    at Writable.write (node:internal/streams/writable:502:10)
    at Socket.ondata (node:internal/streams/readable:1007:22)
    at Socket.emit (node:events:530:35)
    at addChunk (node:internal/streams/readable:559:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
    at Readable.push (node:internal/streams/readable:390:5)

Node.js v20.12.2
```

The key parts of this error are `Run pnpm exec commitlint --from ~ --to  --verbose` and `Error: fatal: ambiguous argument '/home/runner..HEAD': unknown revision or path not in the working tree.`

## The problem

My translation of the error above is this: the variables we used in our CI workflow to represent the 'from' and 'to' reference points for commitlint were not available. When the CI workflow is used in the merge queue, it is in a new context - a new, temporary branch where the merge has already happened; it is **not** the PR.

## New objectives

- I want to run commitlint on all commits in a PR to ensure they all have good formatting.
- I want to run commitlint on the merge queue in case we used a squash merge, with a commit message written manually, which would also need checking.
- I want the whole CI workflow to remain required in both contexts.
- The different commitlint checks should not run in the wrong context and cause the whole CI workflow to fail.

## The solution

Fortunately, this is easy with the `if` conditional! We can have two separate commitlint steps, one for each context. They'll be skipped when it's not the right context and won't cause the whole workflow to fail.

My version looks like this:

```yaml
- name: PR Commitlint
  if: ${{ github.event_name == 'pull_request' }}
  run: pnpm exec commitlint --from ${{ github.event.pull_request.head.sha }}~${{ github.event.pull_request.commits }} --to ${{ github.event.pull_request.head.sha }} --verbose
- name: Merge Queue Commitlint
  if: ${{ github.event_name == 'merge_group' }}
  run: pnpm exec commitlint --last --verbose
```

The commitlint check that runs in the merge group only checks the last commit because the PR check would have already validated everything in the PR, so we're only looking for the occasional squash merge. I can't count the number of times I've put a space in the wrong place when manually writing a squash merge message and caused the release workflow to fail, so having this extra check in place to catch that is a big relief.
