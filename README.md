# Aether — Litigation Intelligence Platform

**AI-native case intelligence for complex litigation.** Aether transforms raw litigation data — pleadings, depositions, discovery productions, expert reports — into structured, actionable intelligence a decision-maker can consume in minutes.

Built as a full-stack production system with 14 integrated modules, 36+ API endpoints, multi-model AI routing, RAG-powered semantic search, and zero-trust security.

---

## What It Does

| Module | Capability |
|--------|-----------|
| **AI Legal Advisor** | Context-aware chat with full case data access — documents, parties, events, notes — plus RAG-powered document retrieval and persistent conversation memory |
| **War Room** | SWOT analysis: elemental breakdown, adversarial forecasting, win probability, strategic sequencing |
| **Red Team Audit** | Opposing counsel vulnerability matrix — severity scoring, exploit strategies, recommended defenses |
| **Discovery Generator** | Auto-generated interrogatories, RFPs, and RFAs tailored to case facts with strategic purpose annotations |
| **Document Drafting** | AI-generated motions, briefs, and correspondence with jurisdiction-specific formatting |
| **Citation Verification** | Hallucination detection for legal citations — flags suspicious or fabricated case law before filing |
| **Hearing Simulator** | Practice oral arguments against an AI judge with configurable persona |
| **Deposition Simulator** | Prepare for depositions against hostile AI opposing counsel |
| **Case Valuation** | Settlement value estimation with comparable case analysis |
| **Privilege Scanner** | Flags attorney-client privilege and work product before production |
| **Document Intelligence** | Vision-based document analysis with automatic text extraction, AI analysis, timeline event creation, and vector embedding generation |
| **Semantic Search** | RAG pipeline with vector embeddings — cosine similarity search across all case documents for context-aware AI responses |
| **Executive Case Brief** | One-screen posture summary: status, jurisdiction, critical deadlines with countdown, discovery status, document breakdown, risk signals, and recent activity |
| **Timeline Tracking** | Chronological event management with deadline alerting and source document traceability |
| **Case Management** | Multi-tenant case organization with party tracking, document management, and notes |

> **[Full feature documentation](FEATURES.md)**

## Architecture

Multi-model AI engine with task-based routing, RAG-powered semantic search, conversation memory with automatic summarization, multi-tenant data isolation, SSO authentication, and full audit trail. Deployed as a containerized service within a zero-trust infrastructure.

> **[System architecture with diagrams](ARCHITECTURE.md)** — includes data model, AI engine, RAG pipeline, request lifecycle, security model, and deployment topology.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL 16, pgvector extension |
| AI (Primary) | Google Gemini Pro (strategy, audit, drafting) · Gemini Flash (chat, simulation) |
| AI (Fallback) | Ollama + Llama 3.1 — local inference, offline capability |
| Embeddings | Google Embedding API (768-dimensional vectors) |
| Auth | Authentik SSO via Traefik ForwardAuth |
| Security | Cloudflare Tunnel (zero open ports), TLS 1.3, audit logging |
| Deployment | Docker, NAS-mounted storage |

## Repository Structure

This is a **public portfolio showcase**. It contains architecture documentation, system design diagrams, and feature descriptions demonstrating the platform's engineering and capabilities. The full production source code is maintained in a private repository and is available for live demonstration upon request.

```
├── README.md              ← Platform overview (this file)
├── ARCHITECTURE.md        ← System diagrams (Mermaid) & data model
├── FEATURES.md            ← Module documentation
├── LICENSE                ← Portfolio license
├── legal/                 ← Enterprise legal documents
│   ├── TERMS_OF_SERVICE.md
│   ├── PRIVACY_POLICY.md
│   ├── ACCEPTABLE_USE_POLICY.md
│   └── MASTER_SERVICES_AGREEMENT.md
└── public/                ← Brand assets
```

## About

Designed and built by **Jake Sadoway** — Stetson University '21, Orlando FL. Background in institutional development, grants compliance, and AI-driven workflow automation.

This platform was built to demonstrate that litigation intelligence is a solvable problem: raw case data in, structured strategic insight out.

**Interested in a live demo?** Reach out via [LinkedIn](https://www.linkedin.com/in/jakesadoway) or email.

## License

Copyright 2026 Jake Sadoway. All rights reserved. Portfolio demonstration only — no commercial use, reproduction, or derivative works without written permission. See [LICENSE](LICENSE).
