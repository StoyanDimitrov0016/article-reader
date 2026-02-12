---
title: Big O Basics
category: Algorithms
tags: [complexity, performance, asymptotics]
summary: A practical model for reasoning about how algorithm cost grows with input size.
order: 5
readMinutes: 8
---

## Start with use cases

You are choosing between two implementations for an API endpoint. Both pass tests. One works well on 1,000 records but slows down at 1,000,000. Big O helps you predict that behavior before production traffic exposes it.

The same issue appears in ranking feeds, processing logs, searching records, and generating recommendations. Small datasets hide bad growth. Bigger datasets punish it.

## What it is

Big O describes growth rate. It does not tell you exact runtime in milliseconds. It tells you how runtime or memory changes when input size increases.

If an algorithm is O(n), doubling input size roughly doubles work. If it is O(n^2), doubling input size roughly quadruples work.

## How it works internally

Big O is usually derived by counting dominant operations.

A single pass over n items is O(n).
A nested loop over n by n items is O(n^2).
Halving search space each step is O(log n).

The key idea is dominance. If one term grows much faster than another, the faster-growing term controls behavior at scale.

## Core operations and why they cost what they cost

When you scan a list once, each element is touched once, so cost grows linearly.

When you compare every item with many others, work multiplies, so cost becomes quadratic.

When you repeatedly cut the search range in half, number of steps grows with how many halvings it takes to reach one element, so cost is logarithmic.

For space complexity, the same logic applies. If you store one extra value per input element, space is O(n). If you only track a few counters, space is O(1).

## Where it shines

Big O is strongest when comparing candidate approaches early. It helps you avoid designs that cannot scale.

It is also strong for communication. Saying a pipeline is O(n log n) immediately sets expectations for how cost will evolve under growth.

## Where it is the wrong first choice

Big O alone is not enough for final performance decisions. Constant factors, memory locality, allocation behavior, and I/O can dominate real wall-clock time.

For small n, an algorithm with worse asymptotic growth can still be faster in practice.

## Common mistakes

One mistake is treating Big O as exact runtime. It is a growth model, not a stopwatch.

Another mistake is ignoring space complexity while optimizing time complexity.

A third mistake is choosing by notation only and skipping realistic benchmarking with production-like input distributions.

## Recall block

If input doubles, how does O(n), O(n log n), and O(n^2) typically change?

Why can two O(n) algorithms still have very different real runtime?

When is O(1) extra space preferable to a faster algorithm that allocates O(n) memory?

## 20-second summary

Big O tells you how algorithm cost grows, not exact runtime. Use it to compare scalability early, then validate with realistic benchmarks because constants, memory behavior, and I/O still matter in production.

