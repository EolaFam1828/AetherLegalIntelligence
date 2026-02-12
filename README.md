# Aether — Litigation Intelligence Platform

**AI-native case intelligence for complex litigation.** Aether transforms raw litigation data — pleadings, depositions, discovery productions, expert reports — into structured, actionable intelligence a decision-maker can consume in minutes.

Built as a full-stack production system with 13 integrated modules, 34 API endpoints, multi-model AI routing, and zero-trust security.

---

<!--
## Screenshots

> Add 4-6 screenshots here showing the platform in action.
> Recommended: Dashboard, War Room SWOT output, Red Team Audit,
> Discovery Generator, Deposition Simulator, Evidence Grid.

| Dashboard | War Room Analysis |
|-----------|-------------------|
| ![Dashboard](screenshots/dashboard.png) | ![War Room](screenshots/war-room.png) |

| Red Team Audit | Discovery Generator |
|----------------|---------------------|
| ![Red Team](screenshots/red-team.png) | ![Discovery](screenshots/discovery.png) |

-->

## What It Does

| Module | Capability |
|--------|-----------|
| **AI Legal Advisor** | Context-aware chat with full case data access — documents, parties, events, notes |
| **War Room** | SWOT analysis: elemental breakdown, adversarial forecasting, win probability, strategic sequencing |
| **Red Team Audit** | Opposing counsel vulnerability matrix — severity scoring, exploit strategies, recommended defenses |
| **Discovery Generator** | Auto-generated interrogatories, RFPs, and RFAs tailored to case facts with strategic purpose annotations |
| **Document Drafting** | AI-generated motions, briefs, and correspondence with jurisdiction-specific formatting |
| **Citation Verification** | Hallucination detection for legal citations — flags suspicious or fabricated case law before filing |
| **Hearing Simulator** | Practice oral arguments against an AI judge with configurable persona |
| **Deposition Simulator** | Prepare for depositions against hostile AI opposing counsel |
| **Case Valuation** | Settlement value estimation with comparable case analysis |
| **Privilege Scanner** | Flags attorney-client privilege and work product before production |
| **Document Intelligence** | Vision-based document analysis — upload PDFs, images, and text for AI processing |
| **Timeline Tracking** | Chronological event management with deadline alerting |
| **Case Management** | Multi-tenant case organization with party tracking, document management, and notes |

→ **[Full feature documentation](FEATURES.md)**

## Architecture

Multi-model AI engine with task-based routing, multi-tenant data isolation, SSO authentication, and full audit trail. Deployed as a containerized service within a zero-trust infrastructure.

→ **[System architecture with diagrams](ARCHITECTURE.md)** — includes data model, API surface, request lifecycle, security model, and deployment topology.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| AI (Primary) | Google Gemini 3 Pro (strategy, audit, drafting) · Gemini 3 Flash (chat, simulation) |
| AI (Fallback) | Ollama + Llama 3.1 — local inference, offline capability |
| Auth | Authentik SSO via Traefik ForwardAuth |
| Security | Cloudflare Tunnel (zero open ports), TLS 1.3, audit logging |
| Deployment | Docker, NAS-mounted storage |

## Repository Structure

This is a **public portfolio showcase**. It contains architecture documentation, data models, and feature descriptions demonstrating the system design and capabilities. The full production source code is maintained in a private repository and is available for live demonstration upon request.

```
├── ARCHITECTURE.md        ← System diagrams (Mermaid)
├── FEATURES.md            ← Module documentation
├── prisma/schema.prisma   ← Data model (9 tables)
├── types.ts               ← TypeScript type definitions
├── Dockerfile             ← Production container config
├── package.json           ← Dependency manifest
├── public/                ← Legal docs, policies
└── [config files]         ← Vite, Tailwind, TypeScript, PostCSS
```

## About

Designed and built by **Jake** — Stetson University '21, Orlando FL. Background in institutional development, grants compliance, and AI-driven workflow automation.

This platform was built to demonstrate that litigation intelligence is a solvable problem: raw case data in, structured strategic insight out.

**Interested in a live demo?** Reach out via [LinkedIn](#) or email.

## License

© 2026 Jake. All rights reserved. Portfolio demonstration only — no commercial use, reproduction, or derivative works without written permission. See [LICENSE](LICENSE).
