---
title: "Binary Search Deep Dive: Invariants and Boundaries"
category: Algorithms
tags: [binary-search, invariants, boundaries, deep-dive]
summary: Why binary search succeeds or fails based on interval contracts and monotonic predicates.
readMinutes: 8
---

## Why this deep dive matters

Most binary search bugs are not math bugs. They are contract bugs. The core contract is your invariant: what remains true about the current search interval after every step.

## Detailed model

Binary search is not only for exact matches in sorted arrays. The deeper abstraction is searching a monotonic condition. You define a predicate that transitions once, such as false then true, and find the boundary index where transition occurs.

To keep correctness, interval semantics must stay consistent. Choose either closed interval or half-open interval and never mix rules mid-loop.

Midpoint computation also matters in systems contexts. In fixed-width integer arithmetic, the classic low plus high divided by two can overflow. Safer midpoint formulas avoid that overflow path.

Stopping condition must align with goal. Finding any match, first match, last match, first true, and last false are related but distinct problems. Each needs slightly different bound movement.

## Tradeoffs in real systems

Binary search shines when random access is cheap and predicate checks are moderate. It is less effective when data lives in high-latency storage and each access is expensive, or when predicate evaluation dominates runtime.

It also appears as answer-space search in optimization problems. Instead of searching an array, you search possible numeric answers and use feasibility checks. This is powerful but easy to misuse when monotonicity is not proven.

## Failure modes and debugging signals

Classic failures include infinite loops from wrong bound updates, off-by-one returns, and forgetting to preserve the candidate answer when searching boundaries.

Debugging signal: the same input sizes fail around boundary cases such as empty arrays, single-element arrays, all-true or all-false predicates, and duplicates. Those cases expose invariant violations quickly.

## Quick recap

Binary search is an invariant-maintenance algorithm. If your monotonic property and boundary contract are precise, the implementation becomes mechanical and reliable.

