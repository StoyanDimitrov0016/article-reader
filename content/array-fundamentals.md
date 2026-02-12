---
title: Array Fundamentals
category: Data Structures
tags: [arrays, memory-layout, indexing, amortization]
summary: The foundational sequence structure, with practical intuition for memory layout, indexing, and resize behavior.
order: 10
readMinutes: 11
---

## Start with use cases

Arrays appear in almost every product surface. A feed is an array of posts in rank order. A playlist is an array of tracks. A dashboard chart is an array of time-series points.

The common trait is simple: ordered collections where position matters.

## What it is

An array is a linear sequence. Linear means elements are arranged one after another, not branching like trees or graphs.

Most importantly, arrays are usually contiguous in memory. Contiguous means neighboring elements are stored in neighboring slots.

## How it works internally

A useful model is base address plus index multiplied by slot size.

If slot size is fixed, the runtime can compute location directly. That is why random access by index is fast.

A practical analogy is cars parked in marked street slots. If you know where slot zero starts, slot one is one slot ahead, slot two is two slots ahead, and so on. You do not search the whole neighborhood to find the seventh car.

Zero-based indexing follows this model naturally. Index is offset from the start. First element has offset zero.

## Core operations and why they cost what they cost

Read by index is O(1) because location is direct arithmetic.

Update by index is O(1) for the same reason.

Append on dynamic arrays is amortized O(1). Most appends use free capacity. Occasionally a resize allocates a bigger block and copies elements.

Insert or delete in the middle is O(n) because elements after the edit point are shifted to preserve order and contiguity.

Search by value without extra index structures is O(n) because values are compared until match or end.

The resize story is important. With geometric growth, like around 2x or 1.5x, expensive copies happen infrequently enough that average append cost stays constant over long runs. Larger growth factors reduce resize frequency but increase spare memory.

## Where it shines

Arrays are excellent for:

ordered reads,
range scans,
cache-friendly traversal,
and scenarios where index-based access is frequent.

They are also a strong base for higher-level patterns like sliding window, two pointers, prefix sums, and binary search.

## Where it is the wrong first choice

If your workload does frequent arbitrary middle inserts and deletes, arrays can become expensive due to repeated shifts.

If your main lookup key is identity rather than position, hash-based structures are usually a better first choice.

If structure is inherently hierarchical, tree-like representations may model the problem more naturally.

## Common mistakes

A common mistake is assuming contiguous means every language stores payload objects contiguously. Often arrays store contiguous references while objects themselves live elsewhere.

Another mistake is ignoring out-of-bounds behavior. Some runtimes throw, some return sentinel values, and low-level unchecked contexts can corrupt memory.

A third mistake is mixing inclusive and exclusive index contracts inside the same algorithm, causing off-by-one bugs.

## Recall block

Why does zero-based indexing map naturally to offsets?

Why is append amortized O(1) but middle insertion O(n)?

What changes internally when a dynamic array grows?

In your own words, what does contiguous storage buy you in practice?

## 20-second summary

An array is a linear, position-driven structure with fast index access because locations are computed by offset. It is ideal for ordered scans and random index reads, but frequent middle edits are costly because contiguous layout must be preserved.

