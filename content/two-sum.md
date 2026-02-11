---
title: Two Sum
category: Algorithms
tags: [arrays, hashing]
---

Two Sum asks for two indices that add up to a target.

## Idea

Scan once, keep a hash map of values you have already seen.
When you are at value `x`, check whether `target - x` exists.

## Complexity

Time is O(n). Space is O(n).

```js
// Example approach
const seen = new Map();
for (let i = 0; i < nums.length; i += 1) {
  const needed = target - nums[i];
  if (seen.has(needed)) return [seen.get(needed), i];
  seen.set(nums[i], i);
}
```
