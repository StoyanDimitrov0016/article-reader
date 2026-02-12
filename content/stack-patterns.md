---
title: Stack Patterns
category: Data Structures
tags: [stack, lifo, monotonic-stack, parsing]
summary: Last-in-first-out reasoning for structural matching and boundary discovery.
order: 40
readMinutes: 8
---

## Start with use cases

You need to validate nested brackets, implement undo behavior, or find next greater elements efficiently. These are classic stack-friendly tasks.

## What it is

A stack is a last-in first-out structure.

The most recently pushed item is the first one popped.

It models unresolved recent context.

## How it works internally

Push adds unresolved work.

Pop resolves most recent unresolved work.

Peek inspects what must be resolved next.

In monotonic stack patterns, stack content follows an ordering invariant so incoming elements can resolve multiple pending items efficiently.

## Core operations and why they cost what they cost

Push, pop, and peek are O(1).

Parser-style validations are usually O(n) because each token is pushed or popped once.

Monotonic stack solutions are usually O(n) amortized because each index enters stack once and leaves once.

Space is O(n) in worst case when many unresolved items remain on stack.

## Where it shines

Stacks shine when recent context must be resolved before older context.

They are ideal for balanced symbol checks, depth-first traversal mechanics, expression handling, and nearest-greater or nearest-smaller boundary questions.

Real product example: undo history in editors naturally follows last action first reversal.

## Where it is the wrong first choice

If fairness by arrival order is required, queue is better.

If direct key lookup dominates, hash structures are better.

If problem is primarily random index access, arrays may be simpler.

## Common mistakes

One mistake is popping without checking emptiness.

Another is storing values when indices are required for boundary computations.

A third is wrong monotonic direction, which quietly produces incorrect boundary answers.

## Recall block

What problem signal usually suggests a stack?

Why can monotonic-stack algorithms stay O(n)?

When should you store indices instead of values?

Why is stack unsuitable for FIFO workloads?

## 20-second summary

Stacks model unresolved recent context with LIFO behavior. They are excellent for nesting validation and monotonic boundary problems, especially when each item is pushed and popped at most once.

