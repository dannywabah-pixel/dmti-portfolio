# DMTI — Distributed Merchant Trading Infrastructure

## Overview

DMTI is a resilient, modular transactional system designed to demonstrate stable backend architecture, runtime safety, and operational discipline in distributed environments.

This repository includes a production-style system and a single-page engineering portfolio that documents its structure and operational state.

---

## Purpose

The goal of DMTI is not feature complexity, but system reliability.

It focuses on:

- Runtime stability under failure conditions
- Clear architectural boundaries
- Safe execution and recovery patterns
- Observability and controlled behavior
- Transactional integrity

---

## System Architecture

DMTI is structured into layered components:

- Transport Layer (Telegram interface)
- Application Layer (Business logic)
- Execution Layer (Transactional operations)
- Infrastructure Layer (Redis, DB, caching)
- Runtime Layer (boot, shutdown, orchestration)

Each layer operates with strict responsibility separation.

---

## Portfolio

A static engineering portfolio is included in:


It presents:

- System overview
- Architecture explanation
- Technology stack
- Operational status
- Engineering philosophy

---

## Tech Stack

- Node.js
- Redis
- PostgreSQL
- Telegram Bot API
- PM2
- GitHub
- Ubuntu / WSL

---

## Current Status

- Architecture: Complete
- Runtime Resilience: Complete
- Telegram Integration: Operational
- Redis Stability: Stabilized
- System Certification: In Progress

---

## Engineering Philosophy

- Stability over complexity
- Evidence over assumptions
- Validation over refactoring
- Operational trust over feature expansion

---

## License

This project is intended for engineering demonstration and system design exploration.
