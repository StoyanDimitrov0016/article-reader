---
title: Queue and Deque Patterns
category: Data Structures
tags: [queue, deque, bfs, window-processing]
summary: FIFO and double-ended processing patterns for level order and sliding windows.
order: 50
readMinutes: 8
---

## Start with use cases

Queues appear in ticketing systems, background job workers, and BFS traversal where first-arrived items should be processed first.

Deques appear in rolling analytics, especially window max or min calculations over streams.

## What it is

A queue is first-in first-out.

A deque is double-ended queue, allowing operations at both front and back.

These structures are about processing order guarantees.

## How it works internally

Queue maintains arrival order. Oldest pending item is processed next.

Deque maintains both ends, enabling expiry from one side and candidate insertion/removal from the other.

In monotonic deque patterns, order inside deque is maintained intentionally so front always represents current extreme candidate.

## Core operations and why they cost what they cost

Enqueue and dequeue are O(1) with proper queue implementation.

BFS on adjacency lists is O(V + E) because each node and edge is processed at most once.

Sliding-window max with monotonic deque is O(n) because each index enters deque once and leaves once.

Space depends on active frontier size for queues and active candidate count for deques.

## Where it shines

Queues shine when fairness and level order are required.

Deques shine when both boundary expiration and extreme-value tracking matter.

Real product example: near-real-time monitoring dashboards often compute rolling maxima with deque-based windows to avoid expensive rescans.

## Where it is the wrong first choice

If latest item must be processed first, stack is a better fit.

If you need direct key lookup, hash structures are better.

If order guarantees are not important and random access dominates, array-centric approaches may be simpler.

## Common mistakes

One mistake is using data structures where front removal is O(n), silently degrading performance.

Another is storing values instead of indices in window algorithms, which breaks expiry logic.

A third is forgetting to remove out-of-window indices before reading current answer.

## Recall block

Why does BFS require queue semantics?

Why do window max algorithms usually store indices in deque?

What makes monotonic deque processing linear?

When is queue the wrong structure even if data is sequential?

## 20-second summary

Queues enforce FIFO order for fair or level-based processing. Deques add two-ended control and enable linear-time window extrema by preserving candidate invariants across sliding boundaries.

