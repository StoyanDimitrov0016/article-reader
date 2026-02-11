---
title: System Design Basics
category: System Design
tags: [scalability, availability, reliability]
---

System design is the practice of choosing components and tradeoffs to meet product goals.

## Core pillars

- Scalability: the system can handle growth in users and traffic.
- Availability: the system stays up and usable during failures.
- Reliability: the system behaves correctly and consistently.

## Typical building blocks

- Clients, API servers, databases, caches, queues, and background workers.
- Load balancers for traffic distribution.
- Monitoring, logging, and alerting for operations.

## How to reason in interviews

1. Clarify functional and non-functional requirements.
2. Estimate scale (requests per second, storage growth, peak traffic).
3. Sketch a high-level architecture.
4. Identify bottlenecks and propose improvements.
