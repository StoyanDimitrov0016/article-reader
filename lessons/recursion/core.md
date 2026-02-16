## Start with use cases

Recursion appears naturally in tree traversal, directory walking, expression evaluation, and divide-and-conquer algorithms.

It is useful when a problem can be described as smaller versions of itself.

## What it is

Recursion is a function calling itself on smaller subproblems.

A recursive solution has three essentials: base case, progress toward base case, and combination of returned sub-results.

## How it works internally

Each call creates a stack frame with local state and return address.

Calls accumulate until base cases are reached.

Then returns unwind in reverse order, combining results back upward.

This means recursion is conceptually simple but has real stack-memory cost proportional to depth.

## Core operations and why they cost what they cost

Time cost depends on recursion tree shape.

Single-branch depth n gives O(n).

Branching recursion can grow exponentially if subproblems repeat.

Memoization changes that by caching previously solved states, often reducing huge repeated work to manageable polynomial or linear behavior depending on state count.

Space cost includes call stack depth and optional memo cache.

## Where it shines

Recursion shines when problem structure is hierarchical and recursive contract is clearer than iterative bookkeeping.

It is also strong for divide-and-conquer algorithms where subproblems are independent and combine cleanly.

Real product example: recursively walking nested configuration trees to validate and normalize policy definitions.

## Where it is the wrong first choice

If input depth can be very large and stack limits are strict, iterative versions may be safer.

If recursion adds cognitive overhead without structural clarity, explicit loops can be more maintainable.

If repeated subproblems are large and memoization is omitted, recursion can become inefficient quickly.

## Common mistakes

One mistake is missing or weak base case, causing infinite recursion.

Another is recursive calls that do not strictly reduce problem size.

A third is unclear function contract, mixing local return value with global side effects.

## Recall block

What are the three non-negotiable parts of a recursive solution?

Why can recursion overflow stack on deep inputs?

How does memoization change complexity?

When should you prefer iterative translation over recursion?

## 20-second summary

Recursion is a control-flow model for self-similar problems. It is powerful when contracts are clear and subproblems shrink reliably, but stack depth and repeated-state costs must be managed with care.
