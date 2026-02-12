---
title: Merge Sort
category: Algorithms
tags: [sorting, divide-and-conquer, stability]
summary: A stable divide-and-conquer sorting algorithm with predictable O(n log n) time.
order: 45
readMinutes: 7
---

## Start with use cases

You need sorted records by one key while preserving previous order among equal keys from a prior sort. That stability requirement often makes merge-sort-style thinking relevant.

You also see merge patterns in external sorting of large datasets where data cannot fit in memory at once.

## What it is

Merge sort is a divide-and-conquer algorithm.

It recursively splits input into smaller halves, sorts those halves, then merges them into a sorted result.

## How it works internally

Splitting continues until segments are trivially sorted.

Merging combines two already sorted sequences by repeatedly selecting the smaller front element.

Because each merge step processes items in order, merge phase can preserve relative order among equal keys when merge policy is stable.

## Core operations and why they cost what they cost

Each recursion level processes all n elements during merge work.

Number of levels is logarithmic because input is repeatedly halved.

That gives O(n log n) time.

Typical array implementations use auxiliary storage for merging, often O(n) extra space.

## Where it shines

Merge sort shines when predictable worst-case time and stability are important.

It is also useful for linked-list sorting and large-data external merge workflows.

Real product example: generating ordered reports with stable tie handling across multiple sort criteria.

## Where it is the wrong first choice

If memory overhead is tightly constrained, O(n) auxiliary space can be a concern.

If in-place behavior is required and stability is not required, alternative algorithms may be preferred.

If dataset is tiny, simpler algorithms can be faster due to lower constant factors.

## Common mistakes

One mistake is incorrect split boundaries causing lost or duplicated elements.

Another is forgetting to append remaining tail after one half is exhausted during merge.

A third is breaking stability accidentally by choosing right-side equal elements before left-side equal elements.

## Recall block

Why does merge sort have O(n log n) time?

Where does its extra memory usage come from?

What does stable sorting mean in practical terms?

When is merge sort a better fit than quick one-pass in-place approaches?

## 20-second summary

Merge sort combines recursive halving with linear merging at each level, yielding predictable O(n log n) performance and stable ordering, usually at the cost of extra merge buffer memory.

