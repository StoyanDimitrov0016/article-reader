---
title: DFS vs BFS
category: Algorithms
tags: [graphs, traversal, search]
summary: How traversal frontier strategy changes guarantees, memory profile, and best-use scenarios.
order: 55
readMinutes: 8
---

## Start with use cases

Suppose you need the fewest subway stops between two stations. You need level-by-level expansion, not arbitrary exploration. That points to BFS.

Suppose you need to detect cycles or fully explore connectivity. Depth-first traversal is often simpler. That points to DFS.

## What it is

DFS and BFS are graph traversal strategies.

DFS explores deep paths first, then backtracks.

BFS explores neighbors by distance layers from the start.

## How it works internally

The key difference is frontier policy.

DFS uses stack behavior, either explicit stack or call stack.

BFS uses queue behavior.

This small change creates major correctness differences for path-length-sensitive tasks.

## Core operations and why they cost what they cost

For standard adjacency-list representation, both traversals touch each vertex and edge at most once in connected component exploration. Time is O(V + E).

Space differs by frontier shape.

DFS stores current deep path plus unresolved branches.

BFS stores entire current wavefront, which can be large in high-branching graphs.

For unweighted shortest path, BFS is correct because first time a node is dequeued corresponds to minimum edge distance.

## Where it shines

DFS shines for:

topological style reasoning,
cycle detection patterns,
and backtracking-style exploration.

BFS shines for:

shortest path in unweighted graphs,
minimum-step transformations,
and level-order outputs.

## Where it is the wrong first choice

DFS is the wrong first choice when exact minimum number of edges is required in unweighted graphs.

BFS can be the wrong first choice in very wide graphs when memory is constrained and shortest-level guarantees are unnecessary.

## Common mistakes

A common mistake is marking visited too late and revisiting nodes unnecessarily.

Another mistake is accidentally using stack operations in intended BFS code or queue operations in intended DFS code.

A third mistake is ignoring disconnected components and assuming one traversal from one start covers all nodes.

## Recall block

Why does BFS guarantee shortest path in unweighted graphs?

What memory pattern difference appears between deep graphs and wide graphs?

When does DFS produce cleaner logic than BFS?

How do you adapt traversal to disconnected graphs?

## 20-second summary

DFS and BFS have similar big-picture complexity but different guarantees because of frontier order. Use BFS for unweighted shortest-distance tasks and DFS for depth-oriented structural exploration and backtracking patterns.

