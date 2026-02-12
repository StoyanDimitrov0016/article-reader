---
title: Linked List Fundamentals
category: Data Structures
tags: [linked-list, pointers, fast-slow, in-place]
summary: Pointer-based sequence structure focused on local rewiring and traversal contracts.
order: 30
readMinutes: 9
---

## Start with use cases

Linked lists appear in interview settings, custom allocators, LRU internals, and systems where local insertion or deletion is frequent and node references are already available.

## What it is

A linked list is a sequence of nodes connected by references.

Each node holds value plus link to next node, and sometimes previous node.

Unlike arrays, elements are not required to be contiguous in memory.

## How it works internally

Traversal follows references node by node.

This makes positional access linear, because you walk links until reaching target.

Local insertion and deletion can be constant-time if you already hold reference to the surrounding nodes.

Pointer update order is critical. Losing a reference before preserving next node can disconnect part of the list.

## Core operations and why they cost what they cost

Read by index is O(n) because traversal is sequential.

Insert or remove near known node is O(1) because only a few references are rewired.

Search by value is O(n).

Reversal is O(n) because each node link is rewritten once.

Fast-slow pointer techniques work by moving one pointer twice as fast, enabling cycle detection and midpoint discovery without extra memory.

## Where it shines

Linked lists shine when local structural edits dominate and random index access is not central.

They are also useful in interview problems that test pointer reasoning and in-place mutation discipline.

Real product example: a doubly linked list is often used in cache eviction policies where moving items to front and removing least-recently-used entries must be cheap.

## Where it is the wrong first choice

If workload depends on frequent random indexing or cache-friendly scans, arrays are usually better.

If memory overhead per element must stay low, pointer metadata can be expensive.

If pointer safety is difficult in your environment, linked-list mutation bugs can be costly to debug.

## Common mistakes

One mistake is not using a dummy node when head may change, leading to fragile edge-case code.

Another is incorrect mutation order that loses remaining list.

A third is missing null guards in fast-slow loops and dereferencing invalid references.

## Recall block

Why is random index access slow in linked lists?

When can insertion or deletion be O(1)?

What problem does a dummy node solve?

Why does fast-slow movement detect cycles?

## 20-second summary

Linked lists trade fast positional access for flexible local rewiring. They are strong for pointer-centric edits and structural patterns, but weak for index-heavy workloads where contiguous arrays perform better.

