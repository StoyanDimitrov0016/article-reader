## Start with use cases

You need two records that combine to a target value, such as two transactions summing to a fraud threshold or two prices matching a budget constraint. Brute force compares many pairs. Two-sum pattern removes that repeated work.

## What it is

Two Sum asks for two elements whose values add to a target.

The core insight is complement lookup: for current value x, needed partner is target minus x.

## How it works internally

As you scan array once, maintain map of previously seen values.

At each step, compute complement and check map.

If complement exists, pair is found.

If not, store current value and continue.

Order matters: check first, then store, to avoid invalid self-matching in single-element cases.

## Core operations and why they cost what they cost

Each element is processed once, so traversal is O(n).

Each map check and insert is O(1) average.

Total expected time is O(n), replacing O(n^2) nested loops.

Space is O(n) for stored seen values.

## Where it shines

Pattern shines in unsorted arrays when one-pass speed matters more than memory minimization.

It also generalizes to many complement-style tasks beyond simple pair sums.

Real product example: matching pending debit and credit adjustments by balancing deltas in transaction reconciliation workflows.

## Where it is the wrong first choice

If data is already sorted and memory is constrained, two-pointer approach can solve in O(n) time with O(1) extra space.

If all pair combinations are required rather than one pair, duplicate handling and output strategy may need different design.

If values stream indefinitely, unlimited map growth may require retention policy.

## Common mistakes

One mistake is storing before checking and accidentally matching element with itself.

Another is confusing value pair versus index pair requirements.

A third is mishandling duplicates, especially cases like two identical values forming valid answer.

## Recall block

What is the complement for current value x?

Why does map-based two-sum reduce complexity from quadratic to linear?

When is two-pointer variant preferable?

What duplicate case must always be tested?

## 20-second summary

Two-sum is a complement-lookup pattern: scan once, check needed value in seen map, then store current value. It trades O(n) memory for major speedup from O(n^2) to O(n).
