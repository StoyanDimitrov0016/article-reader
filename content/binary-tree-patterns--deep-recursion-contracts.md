---
title: "Binary Tree Patterns Deep Dive: Recursion Contracts"
category: Data Structures
tags: [trees, recursion, dfs, deep-dive]
summary: How to design return contracts and global state so tree solutions stay correct.
order: 70.5
readMinutes: 8
---

## Why this deep dive matters

Tree questions look different on the surface, but many share one hidden requirement: a clean recursion contract. If that contract is ambiguous, implementation quality drops fast.

## Detailed model

A recursion contract is a promise about what a function returns for a subtree. For example, it may return subtree height, whether subtree is balanced, or best path sum through that subtree.

Two patterns dominate.

One pattern returns local summary data and combines child summaries at parent nodes.

Another pattern returns one value while also updating a global best value, such as tree diameter or maximum path sum.

Most bugs come from mixing these patterns unintentionally. If a function is supposed to return height, but sometimes returns a partial global answer, composition breaks.

## Tradeoffs in real systems

Recursive DFS is elegant, but deep skewed trees can pressure call stacks in some environments. Iterative traversal with explicit stacks can improve safety for untrusted or adversarial inputs.

BFS is often better for level-oriented outputs and shortest-level properties. DFS is usually better for subtree aggregation and post-order-style computations.

The right approach depends on output requirements, worst-case tree shape, and environment stack limits.

## Failure modes and debugging signals

Common failures include missing null base cases, incorrect merge logic, and stale global variables reused across test cases.

Debugging signals include wrong answers on empty trees, one-node trees, and severely skewed trees. Those cases quickly reveal base-case and contract mistakes.

When debugging, write the return meaning in one sentence and verify each branch preserves that meaning. This simple habit prevents many subtle bugs.

## Quick recap

Tree recursion is a contract design task first and a coding task second. Define what each call returns, keep global state separate from local returns, and choose DFS or BFS based on the required output shape.

