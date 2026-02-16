## Start with use cases

You have a sorted list of user IDs and need to check membership fast. You also see this pattern in feature rollout thresholds, pricing tiers, and answer-space optimization problems where you search the smallest value that satisfies a condition.

## What it is

Binary search is a divide-and-conquer method for ordered domains. Each comparison removes half of the remaining candidates.

It is not only for exact value search. It is also for finding boundaries in monotonic conditions.

## How it works internally

The algorithm maintains an interval that still may contain the answer.

At each step, it inspects the middle point and decides which half can be safely discarded while preserving the interval invariant.

The invariant is the core. If invariant is clear, pointer updates become mechanical.

## Core operations and why they cost what they cost

The central operation is midpoint evaluation.

Each evaluation shrinks candidate space by about half.

After k steps, candidate space is about n divided by 2^k. Solving that relationship gives logarithmic step count, so runtime is O(log n).

Space is O(1) for iterative implementations because only a few indices and temporary values are tracked.

## Where it shines

Binary search is excellent when:

data is sorted or monotonic,
random access is cheap,
and decision logic is deterministic.

It also shines for first-true or last-true style boundary problems.

## Where it is the wrong first choice

If data is unsorted and single-query volume is low, linear scan can be simpler and often good enough.

If each predicate check is extremely expensive, the logarithmic reduction may not dominate total runtime.

If monotonicity is not guaranteed, binary search assumptions break.

## Common mistakes

One mistake is mixing interval conventions, such as closed bounds in one branch and half-open logic in another.

Another mistake is wrong move direction on equality when searching first or last occurrence.

A third mistake is not testing edge cases like empty input, one element, all duplicates, and no-match scenarios.

## Recall block

What invariant does your current interval represent?

Why does halving lead to logarithmic complexity?

How is searching first occurrence different from searching any occurrence?

When is binary search on answer space valid?

## 20-second summary

Binary search is an invariant-based boundary method. It works by repeatedly halving valid candidates in ordered or monotonic domains, giving O(log n) time when assumptions hold.
