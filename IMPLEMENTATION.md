# Implementation Details — Aether Technical Architecture

> This document summarizes the technical implementation of Aether's core systems. All information is derived from the system's documented architecture in [ARCHITECTURE.md](ARCHITECTURE.md) and [FEATURES.md](FEATURES.md).

---

## Table of Contents

- [Intelligence Layer](#intelligence-layer)
- [AI Engine](#ai-engine)
- [RAG Pipeline](#rag-pipeline)
- [Conversation Memory](#conversation-memory)
- [Document Processing](#document-processing)
- [API Design](#api-design)
- [Data Model](#data-model)
- [Deployment](#deployment)

---

## Intelligence Layer

The intelligence layer persists, versions, and interconnects all AI module outputs. Every analysis is stored as a `CaseAnalysis` record with full version chains, input hashing for deduplication, and signal snapshots for staleness detection.

### Context Assembly (8 Layers)

Every AI request builds an enriched context from 8 layers:

1. **Signal Header** — ~150 tokens of pre-computed metrics
2. **Case Metadata** — Status, jurisdiction, parties
3. **Rolling Artifacts** — Latest Strategy, Red Team, etc.
4. **Document Summaries** — Key facts from uploaded documents
5. **Parties + Timeline** — Case participants and chronological events
6. **Cross-Module Intelligence** — Dependency graph reads
7. **RAG Chunks** — Query-relevant document segments
8. **Previous Analysis** — For refinement continuity

### Signals Layer

Pre-computed case health metrics injected into every AI prompt:

| Signal Type | Examples | Source |
|------------|---------|--------|
| **QUERY** (DB aggregations) | Overdue deadlines, unverified events, document count, discovery status, vulnerability count | Direct database queries |
| **HEURISTIC** (weighted composites) | Risk level = overdue×30 + openVuln×20 + criticalVuln×15 + unverified×5 | Computed from QUERY signals |

### Persistence Model

- **Input Hash (SHA-256)** — Skip LLM if context unchanged
- **Atomic Versioning** — CURRENT → SUPERSEDED, new version created
- **Signal Snapshot** — Stored with each analysis for staleness detection

### Recalibration Engine

Reactive staleness detection triggered by data mutations:

- **Triggers:** Document upload, party edit, event change, note added
- **Process:** 60s debouncing → signal comparison → staleness marking
- **Levels:** MINOR_CHANGE · STALE · CRITICAL

### Cross-Module Dependencies

Each AI module reads from other modules' latest outputs:

| Module | Reads From |
|--------|-----------|
| **Strategy** | Red Team, Discovery Backlog, Valuation, Case Theory Map |
| **Red Team** | Strategy, Case Theory Map |
| **Discovery** | Strategy, Red Team, Key Exhibits |
| **Valuation** | Strategy, Red Team, Discovery Backlog |
| **Draft** | Strategy, Discovery, Case Theory Map |
| **Citation Check** | (standalone — no cross-module reads) |

### Knowledge Graph

A lightweight directed graph (`GraphEdge` table) connects case entities with typed relationships:

| Edge Type | Meaning |
|-----------|---------|
| SUPPORTS | Entity A provides evidence for Entity B |
| CONTRADICTS | Entity A conflicts with Entity B |
| MENTIONS | Entity A references Entity B |
| DERIVED_FROM | Entity A was generated based on Entity B |

---

## AI Engine

### Task-Based Model Routing

Each request type maps to the optimal model:

- **Gemini Pro** — strategy, draft, audit, valuate, analyze, discovery, citation-check (complex reasoning)
- **Gemini Flash** — chat, scan, simulate (low latency)
- **Ollama (Llama 3.1:8b)** — Local fallback for all tasks

### Cognitive Core

All AI agents share a unified **Cognitive Protocol** — a structured reasoning framework:

| Protocol | Function |
|----------|----------|
| Elemental Analysis | Break claims into elements, check satisfaction |
| Adversarial Reasoning | Predict opponent's next 3 moves |
| Strategy Sequencing | Sequence actions for momentum |
| Risk Intelligence | Measure procedural, evidentiary, narrative risk |
| Narrative Construction | Find the emotional anchor |
| Contradiction Detector | Spot inconsistencies in testimony/evidence |
| Precedent Mapping | Identify controlling precedent |
| Procedural Exploitation | Find missed deadlines, waived objections |
| Leverage Calibration | Calculate BATNA, settlement corridor |
| Evidence Chain | Map chain of custody, find weak links |
| Credibility Assessment | Evaluate witness reliability |
| Exit Strategy | Calculate settlement ranges |

### Rate Limiting & Graceful Degradation

Service-level rate limiting (not middleware) with sliding-window tracking and FIFO queues:

| Model | RPM | TPM | RPD |
|-------|-----|-----|-----|
| Gemini Pro | 25 | 1,000,000 | 250 |
| Gemini Flash | 2,000 | 4,000,000 | Unlimited |
| Embedding 001 | 3,000 | 1,000,000 | Unlimited |

- Interactive requests wait up to 5 seconds then fall back to Ollama
- Background processing waits up to 120 seconds
- Health endpoint exposes live RPM/TPM/RPD usage and queue depth

### JSON Extraction

Robust parsing pipeline: raw → fenced code block → balanced brace extraction

---

## RAG Pipeline

Documents are processed into vector embeddings for semantic retrieval.

### Document Ingestion

1. **Upload** — PDF, Office, text files up to 50MB
2. **Text Extraction** — Content extraction from supported formats
3. **Chunk Splitter** — Sentence-boundary aware with context overlap

### Embedding

- **Google Embedding API** — 768-dimensional vectors
- **pgvector Storage** — DocumentChunk table with cosine similarity index

### Query-Time Retrieval

1. **User Query** → Query Embedding
2. **Cosine Similarity** → Top-K retrieval
3. **Context Assembly** → Relevant chunks + case data

---

## Conversation Memory

The Case Chat Assistant maintains persistent memory using a hybrid approach:

- **Active Window** — Recent messages in full fidelity
- **Summarization** — Older messages compressed by AI
- **Storage** — ConversationSummary table per-case
- **Context Assembly** — Summary + recent messages for complete awareness

---

## Document Processing

Every document upload triggers an asynchronous background pipeline:

1. **Job Creation** — DocumentJob record created, jobId returned
2. **Text Extraction** — Content extracted from file
3. **AI Analysis** — Key facts, legal issues identified
4. **Timeline Events** — Auto-created, linked to source document
5. **Vector Embeddings** — Chunk + embed for RAG
6. **Recalibration** — Signal recompute + staleness check

**Job Lifecycle:** QUEUED → PROCESSING → COMPLETED/FAILED

**Current limitations:** No retry mechanism. No granular progress tracking. No page-level traceability.

---

## API Design

### Endpoint Organization

63 RESTful endpoints across 9 route modules:

| Module | Endpoints | Coverage |
|--------|-----------|----------|
| **Auth** | 1 | GET /auth/me |
| **Case Management** | 25 | CRUD for cases, parties, documents, events, notes |
| **AI Intelligence** | 9 | Chat, strategy, audit, discovery, draft, citations |
| **Intelligence Persistence** | 21 | Analyses, signals, graph, priorities, vulnerabilities, drafts, discovery, citations |
| **Simulation** | 3 | Hearing, deposition, transcribe |
| **Tools** | 3 | Document analysis, valuation, privilege scan |
| **Admin** | 3 | Demo mode, impersonation, reset |

### Request Lifecycle

1. **Identity Proxy** — Authentik SSO via ForwardAuth
2. **Auth Middleware** — Upsert user from headers
3. **Audit Log** — Record action
4. **Context Assembly** (AI endpoints only) — 8-layer enriched context
5. **Deduplication Check** — SHA-256 hash lookup
6. **LLM Call** (if new context) — Task-based routing
7. **Persistence** — Atomic versioning + signal snapshot
8. **Recalibration** (if mutation) — Debounced staleness check

### Validation

- All POST endpoints validated via Zod schemas
- CRUD mutations trigger recalibration engine
- Every mutating endpoint writes to audit log

---

## Data Model

Multi-tenant architecture with 25 Prisma models across 9 migrations:

### Core Entities

- **Firm** — Multi-tenant root
- **User** — SSO-based, with firm membership and role
- **Case** — Per-case data container with archiving

### Document & Search

- **Document** — Uploaded files with metadata and summary
- **DocumentChunk** — Text segments with 768-dim vector embeddings
- **DocumentJob** — Async processing lifecycle tracking

### Timeline & Parties

- **Event** — Chronological case events with verification and deadlines
- **Party** — Case participants with roles and contact info
- **Note** — Case notes storage

### AI Intelligence

- **CaseAnalysis** — Versioned AI outputs with input hash, signal snapshot, version chain
- **StrategicPriority** — Actionable items from Strategy module
- **Vulnerability** — Red Team findings with severity and status
- **DiscoveryRequest** — Generated interrogatories, RFPs, RFAs
- **LegalDraft** — Draft documents with versioning
- **CitationRecord** — Citation verification results

### Intelligence Layer

- **CaseSignal** — Pre-computed health metrics (QUERY + HEURISTIC)
- **GraphEdge** — Knowledge graph relationships
- **AnalysisJob** — Background job queue
- **AnalysisPatch** — Refinement tracking

### Conversation

- **ChatMessage** — Persistent chat history
- **ConversationSummary** — Compressed older conversations

### Simulation

- **SimulationSession** — Hearing/deposition practice sessions

### Audit

- **CaseEventLog** — Per-case data mutation log
- **AuditLog** — System-wide action audit trail

---

## Deployment

### Container Architecture

Single Docker container within Eola Gateway homelab stack:

- **Aether Container** — Node.js + React build, port 3000
- **Ollama** — Llama 3.1:8b, GPU-accelerated
- **PostgreSQL 16** — pgvector extension, persistent volume
- **Authentik** — SSO provider

### External Services

- **Google Gemini API** — Pro + Flash models
- **Google Embedding API** — 768-dim vectors
- **OpenAI Whisper API** — Speech-to-text
- **QNAP NAS** — Document storage via NFS mount

### Networking

- Containerized service deployed behind an identity proxy
- Not directly exposed — all traffic via ForwardAuth
- Header-based authentication (no JWT, no HMAC, no mTLS)

---

## Jurisdiction Engine

Multi-jurisdiction support with configurable legal constraints per case:

| Jurisdiction | Court System |
|-------------|-------------|
| **Florida** | 9th Circuit — Orange County |
| **Georgia** | Superior Court — Fulton County |
| **New York** | US District Court — Southern District |
| **Texas** | District Court — Harris County |

Each AI agent receives jurisdiction-aware system prompts with applicable statutes, procedural rules, and court conventions.

---

## Current Limitations

From [FEATURES.md](FEATURES.md):

- **No export** — AI-generated content viewable in UI only
- **Analysis versioning is backend-only** — No UI for version history
- **No external legal research** — LLM-generated citations only
- **Limited RBAC enforcement** — Only case deletion checks Admin role
- **No page-level traceability** — Events lack page numbers and quotes
- **No verification audit trail** — No record of who verified or when
- **No job retries** — Failed jobs require manual re-upload
- **Single-instance job processor** — In-process poller, not distributed queue
- **Knowledge graph is API-only** — No visual rendering in UI
- **Staleness badges not fully surfaced** — Backend tracks but UI incomplete

---

## Related Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Full system diagrams and data model
- **[FEATURES.md](FEATURES.md)** — Module documentation with limitations
- **[SECURITY.md](SECURITY.md)** — Security model and authentication
- **[TECHNICAL_DECISIONS.md](TECHNICAL_DECISIONS.md)** — Design decisions and trade-offs

---

## License

Copyright 2026 Jake Sadoway. All rights reserved. Portfolio demonstration only.
