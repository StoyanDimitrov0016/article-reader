## Start with use cases

You need longest substring without repeats, minimum subarray meeting a threshold, or rolling behavior over contiguous ranges. These problems usually reward sliding-window reasoning.

## What it is

Sliding window maintains a contiguous interval with two boundaries that move forward over time.

The key is incremental updates. You avoid recomputing from scratch for every candidate range.

## How it works internally

Window expands by moving right boundary.

State is updated with the new element.

If validity constraint breaks, window contracts by moving left boundary until valid again.

The validity rule is the invariant. It determines correctness and update timing.

## Core operations and why they cost what they cost

Each index is added at most once and removed at most once in canonical implementations.

That gives O(n) time for many window problems.

Space depends on state representation.

Simple running sums can be O(1) space.

Frequency maps for distinct constraints can be O(k), where k is number of distinct tracked keys.

## Where it shines

Sliding window shines for contiguous substring and subarray constraints with incremental validity checks.

It is especially strong for longest-valid, shortest-valid, and fixed-window aggregate problems.

Real product example: detecting unusual request bursts over rolling time windows in API monitoring.

## Where it is the wrong first choice

If solution requires non-contiguous selection, sliding window is usually wrong.

If validity requires global recomputation each step, linear window benefits can disappear.

If data is tree or graph structured, window semantics may not apply directly.

## Common mistakes

One mistake is shrinking only once when multiple shrink steps are needed.

Another is updating answer before restoring validity for longest-valid style tasks.

A third is off-by-one window size errors from inconsistent boundary interpretation.

## Recall block

What invariant defines your window validity?

Why is sliding window often O(n) despite inner while loops?

When is fixed-size window different from variable-size window?

What signals that sliding window is the wrong pattern?

## 20-second summary

Sliding window is an invariant-driven method for contiguous ranges. By updating state as boundaries move, it often turns brute-force quadratic scans into linear-time solutions.
