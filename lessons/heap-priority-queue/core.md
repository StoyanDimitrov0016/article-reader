## Start with use cases

You run a job scheduler and need to execute the highest-priority task next. You process a stream and keep only top-k largest items. Both are priority problems, not full-sorting problems.

## What it is

A heap is a partially ordered tree structure, usually stored in an array.

A priority queue is an interface built on that structure for pushing items and repeatedly extracting the highest or lowest priority item.

## How it works internally

Heap property is local.

In a min-heap, parent priority is less than or equal to children.

In a max-heap, parent priority is greater than or equal to children.

Only root is guaranteed extreme. Internal nodes are not globally sorted.

## Core operations and why they cost what they cost

Peek root is O(1) because root location is fixed.

Insert is O(log n) because element bubbles up along tree height.

Extract root is O(log n) because last element moves to root and bubbles down.

Build heap from unsorted array can be O(n) with bottom-up heapify.

For top-k streaming, using a bounded heap of size k gives O(n log k), often far better than full sorting O(n log n) when k is small relative to n.

## Where it shines

Heaps shine when you repeatedly need the current extreme value under ongoing updates.

They are strong for top-k queries, task scheduling, merging multiple sorted streams, and median-like streaming variants.

Real product example: selecting top trending posts in near real time can be modeled with bounded heaps over score updates.

## Where it is the wrong first choice

If you need fast lookup or removal of arbitrary non-root elements, heap is not ideal.

If you need fully sorted output once and no further updates, a one-time sort may be simpler.

If ordering rules are complex and unstable, comparator errors can cause subtle bugs.

## Common mistakes

One mistake is choosing wrong heap type for eviction logic in top-k.

Another is assuming heap array itself is sorted.

A third is comparator ambiguity when priorities tie, leading to unstable or incorrect behavior.

## Recall block

Why is root access O(1) but insertion O(log n)?

Why does top-k often use a bounded heap instead of full sorting?

What does heap guarantee and what does it not guarantee?

When should you use min-heap versus max-heap?

## 20-second summary

Heaps are for dynamic priority selection, not full sorting. They give cheap root access and logarithmic updates, making them ideal for top-k and scheduling workloads where priorities change over time.
