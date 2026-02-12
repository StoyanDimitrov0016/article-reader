# Commute Lesson Spec

Use this template for audio-first DSA and system design lessons.

## Goals

Make lessons easy to replay during commuting without visual dependence.

Teach transfer patterns, not isolated facts.

End each lesson with a concise recap and recall prompts.

## Target Length

Twelve to eighteen minutes spoken.

Roughly twelve hundred to two thousand words.

One lesson should focus on one primary pattern.

## Required Sections

1. Why this matters
Explain practical impact in interviews and real systems.

2. When to use it
Give trigger cues in plain language.

3. Core mental model
State one invariant or key principle.

4. Template
Describe the operational flow in words. Use pseudocode only if the idea is unclear without it.

5. Worked example
Walk one example end to end with state transitions explained in speech-friendly language.

6. Pitfalls
Explain top mistakes and how to detect them quickly.

7. Complexity and tradeoffs
Cover time, space, and alternatives, and explain why costs arise.

8. Variants
Include common variants and when each is preferred.

9. Recall block
Add short retrieval questions.

10. Closing recap
Summarize when to use and when to avoid.

## Frontmatter Fields (Article Markdown)

`title`: non-empty string.

`category`: non-empty string.

`tags`: string array.

`summary`: short optional string.

`order`: optional number for listing order.

`readMinutes`: optional positive number. If omitted, app can estimate it automatically from content.

## Writing Rules

Use narrative-first prose. Prefer paragraphs over dense bullet lists.

Define each technical term once, then restate it in simpler words.

Assume the listener may not see the screen. Do not rely on symbol-heavy notation or variable names to carry core meaning.

Minimize code snippets. If included, keep them short and optional for understanding.

When discussing complexity, always explain the mechanical reason behind the cost.

Use concrete product examples so the concept maps to real workloads.

Keep wording rhythm audio-friendly: short sentences, explicit transitions, clear recap lines.

End with a 20-second summary that states when to use and when to avoid the structure or pattern.

For data structure lessons, include memory-model depth where relevant:

Amortization behavior and common growth multipliers.

Whether internal backing references change during resize.

How element representation affects slot size and offsets.

How out-of-bounds access behaves in checked versus unchecked environments.

## Recommended Metadata Additions

These can be written in section headers or prose labels without expanding frontmatter.

`Prerequisites`

`Replay schedule` (optional)

`Difficulty`

`Action bridge` (optional)
