---
title: Binary Search
tags: [arrays, searching]
---

Binary search finds a target in a sorted array by halving the search space.

## Idea

Track `low` and `high`. Compare the middle element and move the bounds.

## Complexity

Time is O(log n). Space is O(1).