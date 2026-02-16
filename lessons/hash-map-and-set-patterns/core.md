## Start with use cases

You need to detect duplicate emails at signup, count word frequency in logs, or match transaction IDs quickly. These are key-based lookup problems, and hash maps or sets are usually first-class tools.

## What it is

A hash map stores key-to-value associations.

A hash set stores key existence only.

Both use hashing to place keys into buckets for near-constant average lookup.

## How it works internally

A key is transformed into a hash value, then mapped into storage buckets.

Different keys can share a bucket. That is a collision. Collision handling and resize policy determine real performance behavior.

As entries grow, structure may resize and redistribute keys to keep lookup efficient.

## Core operations and why they cost what they cost

Insert, lookup, and membership checks are O(1) average because bucket access is direct and probe paths are short under healthy load factors.

Worst-case can degrade with severe collisions, but robust implementations and good key distribution keep average behavior fast.

Space is O(k), where k is number of distinct keys stored.

Counting patterns use map values as counters.

Dedup patterns use set membership.

Complement patterns, like two-sum style logic, use map membership to replace nested loops.

## Where it shines

Hash structures shine when identity-based lookup is primary and ordering is secondary.

They are especially strong for frequency aggregation, deduplication, and joining data streams by key.

Real product example: request-rate limiting by user ID often uses key-based counters in hash maps for fast updates.

## Where it is the wrong first choice

If sorted order by key is required continuously, hash structures are not ideal without extra sorting.

If memory overhead must be minimal and key count is massive, hash metadata overhead may be significant.

If keys are mutable or equality semantics are unstable, correctness becomes fragile.

## Common mistakes

One mistake is poor key design, such as not normalizing case or whitespace in user identifiers.

Another is storing wrong value shape, for example last index when first index is required.

A third is assuming deterministic iteration order and accidentally coupling logic to runtime-specific behavior.

## Recall block

Why are hash operations usually O(1) average?

When should you choose set over map?

What key-normalization mistakes can break correctness in production?

Why can collisions still matter even if average complexity is constant?

## 20-second summary

Hash maps and sets are key-based acceleration tools. They convert many repeated searches into near-constant average lookups, making counting, deduplication, and complement matching dramatically simpler and faster.
