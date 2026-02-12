---
title: Binary Tree Patterns
category: Data Structures
tags: [trees, dfs, bfs, recursion]
summary: Practical traversal and aggregation patterns for hierarchical data.
order: 70
readMinutes: 9
---

## Start with use cases

Binary-tree thinking appears in many domains: expression parsing, file-system style hierarchies, decision trees, and index structures used by storage engines.

In interviews, tree problems test whether you can reason from local node behavior to global result.

## What it is

A binary tree is a hierarchical structure where each node has at most two children, usually called left and right.

Unlike arrays, relationship is structural, not positional by fixed offset.

## How it works internally

Most tree algorithms rely on traversal order and state flow.

Depth-first traversal follows one branch deeply before backtracking.

Breadth-first traversal explores level by level.

Recursive DFS treats each node as root of a smaller subproblem. The crucial step is defining what a call returns for its subtree.

## Core operations and why they cost what they cost

Traversal visits each node at most once in typical problems, so base time is O(n).

DFS space cost is usually O(h), where h is tree height, because of recursion stack or explicit stack.

BFS space cost is usually O(w), where w is maximum width, because queue stores frontier of a level.

Operations like insert/search in a plain binary tree depend on shape. Balanced shape gives near logarithmic path lengths. Skewed shape degrades toward linear.

## Where it shines

Trees shine when data is naturally hierarchical and when queries depend on substructure, depth, ancestry, or path properties.

They also shine when divide-and-combine logic is natural, such as computing subtree metrics.

## Where it is the wrong first choice

If workload is primarily random index access by position, arrays are simpler.

If graph edges can form cycles or multiple arbitrary connections, general graph models are more accurate than tree assumptions.

If ordering by key with strong balancing guarantees is required, specialized balanced trees or alternative indexes are usually better than plain binary trees.

## Common mistakes

One mistake is unclear recursion contract, mixing return value meaning across branches.

Another mistake is forgetting null base cases and crashing on leaf boundaries.

A third mistake is using DFS where BFS is required for level-order or shortest-level tasks.

## Recall block

What does your recursive function return for each subtree?

When is BFS preferable to DFS?

How do height and width affect space usage differently?

Why can plain binary tree search degrade to O(n)?

## 20-second summary

Binary tree algorithms are traversal-plus-contract problems. Define the subtree return meaning clearly, choose DFS or BFS based on output needs, and remember complexity depends on tree shape as well as node count.

