# Aether — System Architecture

> AI-native litigation intelligence platform. Case briefing, adversarial analysis, discovery automation, and trial preparation — built for speed.

---

## System Overview

Aether is a full-stack litigation intelligence platform designed to turn raw case data (pleadings, depositions, discovery productions, expert reports) into structured, actionable intelligence. The system runs as a containerized service within a zero-trust homelab infrastructure.

```mermaid
flowchart TB
    subgraph CLIENT["Client Layer"]
        UI["React 19 + TypeScript SPA"]
    end

    subgraph EDGE["Edge & Auth"]
        CF["Cloudflare Tunnel<br/><i>Zero open ports</i>"]
        TF["Traefik v3<br/><i>TLS 1.3 · Rate Limiting</i>"]
        AK["Authentik SSO<br/><i>ForwardAuth Middleware</i>"]
    end

    subgraph API["Application Layer"]
        EX["Express.js API Server<br/><i>TypeScript · 34 endpoints</i>"]
        MW["Middleware Stack<br/><i>Auth · Audit · Validation</i>"]
    end

    subgraph AI["AI Engine"]
        RT["Model Router<br/><i>Task-based model selection</i>"]
        G3P["Gemini 3 Pro<br/><i>Strategy · Drafting · Audit<br/>Valuation · Discovery</i>"]
        G3F["Gemini 3 Flash<br/><i>Chat · Scans · Simulation</i>"]
        OL["Ollama (Local)<br/><i>Llama 3.1 · Fallback</i>"]
    end

    subgraph DATA["Data Layer"]
        PG["PostgreSQL 16<br/><i>Prisma ORM · 9 models</i>"]
        FS["NAS-Mounted Storage<br/><i>Document files · Uploads</i>"]
    end

    UI -->|HTTPS| CF --> TF
    TF -->|ForwardAuth| AK
    TF --> EX
    EX --> MW --> RT
    RT --> G3P & G3F & OL
    EX --> PG & FS

    style CLIENT fill:#1e293b,stroke:#3b82f6,color:#e2e8f0
    style EDGE fill:#1e293b,stroke:#f59e0b,color:#e2e8f0
    style API fill:#1e293b,stroke:#10b981,color:#e2e8f0
    style AI fill:#1e293b,stroke:#8b5cf6,color:#e2e8f0
    style DATA fill:#1e293b,stroke:#ef4444,color:#e2e8f0
```

---

## AI Engine Architecture

The AI layer uses **task-based model routing** — each request type maps to the optimal model for that task. Complex reasoning (strategy, audits, drafting) routes to the most capable model. Lighter tasks (chat, scans, simulations) route to a faster model. Local Ollama provides an always-available fallback.

```mermaid
flowchart LR
    REQ["Incoming<br/>Request"] --> ROUTER{"Task-Type<br/>Router"}

    ROUTER -->|strategy, draft,<br/>audit, valuate,<br/>analyze, discovery,<br/>citation-check| PRO["Gemini 3 Pro<br/><i>Complex reasoning</i>"]

    ROUTER -->|chat, scan,<br/>simulate| FLASH["Gemini 3 Flash<br/><i>Low latency</i>"]

    PRO -->|failure| FALLBACK["Ollama<br/>Llama 3.1:8b<br/><i>Local fallback</i>"]
    FLASH -->|failure| FALLBACK

    PRO --> EXTRACT["JSON Extractor<br/><i>Robust parsing:<br/>raw → fenced → balanced brace</i>"]
    FLASH --> EXTRACT
    FALLBACK --> EXTRACT

    EXTRACT --> RESPONSE["Structured<br/>Response"]

    style ROUTER fill:#7c3aed,stroke:#8b5cf6,color:#fff
    style PRO fill:#2563eb,stroke:#3b82f6,color:#fff
    style FLASH fill:#0891b2,stroke:#06b6d4,color:#fff
    style FALLBACK fill:#64748b,stroke:#94a3b8,color:#fff
    style EXTRACT fill:#059669,stroke:#10b981,color:#fff
```

### Cognitive Core

All AI agents share a unified **Cognitive Protocol** — a structured reasoning framework that enforces analytical rigor:

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

Each AI module (War Room, Red Team, Discovery, etc.) inherits these protocols and applies them through specialized system instructions with jurisdiction-aware constraints.

---

## Data Model

Multi-tenant architecture with firm-level data isolation and full audit trail.

```mermaid
erDiagram
    FIRM ||--o{ USER : "has members"
    FIRM ||--o{ CASE : "owns"
    USER ||--o{ CASE : "manages"
    CASE ||--o{ DOCUMENT : "contains"
    CASE ||--o{ PARTY : "involves"
    CASE ||--o{ EVENT : "tracks"
    CASE ||--o{ NOTE : "stores"
    CASE ||--o{ CHAT_MESSAGE : "logs"
    DOCUMENT ||--o{ DOCUMENT_TAG : "tagged with"

    FIRM {
        uuid id PK
        string name
        timestamp createdAt
    }

    USER {
        uuid id PK
        string authentikUid UK
        string email UK
        string name
        enum role "ADMIN | MEMBER | VIEWER"
        uuid firmId FK
    }

    CASE {
        uuid id PK
        string title
        string caseNumber
        text summary
        string caseType
        enum status "active | closed | archived"
        string jurisdiction
        string court
        string judge
        uuid userId FK
        uuid firmId FK
    }

    DOCUMENT {
        uuid id PK
        string title
        string fileName
        string mimeType
        int size
        string storagePath
        string category
        uuid caseId FK
    }

    PARTY {
        uuid id PK
        string name
        string role
        text description
        string contact
        uuid caseId FK
    }

    EVENT {
        uuid id PK
        string title
        datetime date
        string type
        text description
        boolean isVerified
        boolean isDeadline
        uuid caseId FK
    }

    NOTE {
        uuid id PK
        string title
        text content
        string category
        uuid caseId FK
    }

    CHAT_MESSAGE {
        uuid id PK
        uuid caseId FK
        string userId
        string role
        text content
    }

    AUDIT_LOG {
        uuid id PK
        string userId
        string action
        string resource
        string resourceId
        string ipAddress
        string userAgent
        json metadata
        timestamp timestamp
    }
```

---

## API Surface

34 RESTful endpoints organized by domain. Every mutating endpoint writes to the audit log.

```mermaid
flowchart TB
    subgraph AUTH["Auth"]
        A1["GET /auth/me"]
    end

    subgraph CASE_MGMT["Case Management — 14 endpoints"]
        C1["CRUD /cases"]
        C2["CRUD /cases/:id/parties"]
        C3["CRUD /cases/:id/documents"]
        C4["CRUD /cases/:id/events"]
        C5["CRUD /cases/:id/notes"]
    end

    subgraph AI_INTEL["AI Intelligence — 10 endpoints"]
        I1["POST /chat<br/><i>Context-aware legal advisor</i>"]
        I2["POST /strategy<br/><i>War Room SWOT analysis</i>"]
        I3["POST /audit<br/><i>Red Team vulnerability scan</i>"]
        I4["POST /discovery<br/><i>Generate interrogatories,<br/>RFPs, RFAs</i>"]
        I5["POST /draft<br/><i>Motion & brief drafting</i>"]
        I6["POST /verify-citations<br/><i>Hallucination detection</i>"]
    end

    subgraph SIMULATION["Simulation — 2 endpoints"]
        S1["POST /simulate-hearing<br/><i>AI judge argument practice</i>"]
        S2["POST /simulate-deposition<br/><i>Hostile opposing counsel</i>"]
    end

    subgraph TOOLS["Analysis Tools — 3 endpoints"]
        T1["POST /analyze-document<br/><i>Vision-based doc analysis</i>"]
        T2["POST /tools/valuate<br/><i>Settlement valuation</i>"]
        T3["POST /tools/scan<br/><i>Privilege scanner</i>"]
    end

    style AUTH fill:#334155,stroke:#64748b,color:#e2e8f0
    style CASE_MGMT fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style AI_INTEL fill:#3b1d6e,stroke:#8b5cf6,color:#e2e8f0
    style SIMULATION fill:#5b2120,stroke:#ef4444,color:#e2e8f0
    style TOOLS fill:#1a3a2a,stroke:#10b981,color:#e2e8f0
```

---

## Request Lifecycle

Every request passes through the same pipeline: edge security → authentication → authorization → audit → processing.

```mermaid
sequenceDiagram
    actor User
    participant CF as Cloudflare
    participant TF as Traefik
    participant AK as Authentik
    participant API as Express API
    participant MW as Middleware
    participant LLM as AI Engine
    participant DB as PostgreSQL

    User->>CF: HTTPS Request
    CF->>TF: Tunnel (encrypted)
    TF->>AK: ForwardAuth check
    AK-->>TF: X-Authentik-* headers
    TF->>API: Request + auth headers

    API->>MW: Auth middleware
    MW->>DB: Upsert user from headers
    DB-->>MW: User + firm context
    MW->>MW: Audit log write
    MW->>MW: Input validation

    alt AI Endpoint
        API->>DB: Fetch case context + documents
        DB-->>API: Case data
        API->>LLM: System prompt + case context + user query
        LLM-->>API: Structured JSON response
        API->>DB: Store chat history
    else CRUD Endpoint
        API->>DB: Query/mutate (firm-scoped)
        DB-->>API: Result
    end

    API-->>User: JSON Response
```

---

## Security Model

```mermaid
flowchart TB
    subgraph PERIMETER["Network Perimeter"]
        direction TB
        A["No open ports<br/><i>Cloudflare Tunnel only</i>"]
        B["DDoS protection<br/><i>Cloudflare WAF</i>"]
        C["TLS 1.3 termination<br/><i>Traefik with wildcard certs</i>"]
    end

    subgraph IDENTITY["Identity & Access"]
        direction TB
        D["SSO via Authentik<br/><i>ForwardAuth on every request</i>"]
        E["Role-based access<br/><i>ADMIN · MEMBER · VIEWER</i>"]
        F["First-user auto-admin<br/><i>Subsequent users default MEMBER</i>"]
    end

    subgraph DATA_SEC["Data Isolation"]
        direction TB
        G["Firm-scoped queries<br/><i>All DB queries filtered by firmId</i>"]
        H["Full audit trail<br/><i>User · Action · Resource · IP · UA</i>"]
        I["Docker Socket Proxy<br/><i>Read-only · POST=0</i>"]
    end

    PERIMETER --> IDENTITY --> DATA_SEC

    style PERIMETER fill:#7f1d1d,stroke:#ef4444,color:#fecaca
    style IDENTITY fill:#78350f,stroke:#f59e0b,color:#fef3c7
    style DATA_SEC fill:#14532d,stroke:#10b981,color:#d1fae5
```

---

## Jurisdiction Engine

Multi-jurisdiction support with configurable legal constraints per case. Each AI agent is bound to the applicable jurisdiction's statutes, procedural rules, and court conventions.

```mermaid
flowchart LR
    CASE["Case Record<br/><i>jurisdiction field</i>"] --> ENGINE{"Jurisdiction<br/>Engine"}

    ENGINE -->|FL - 9th Circuit| FL["Florida State Court<br/>Orange County<br/><i>FL Rules of Civil Procedure<br/>FL Statutes Ch. 713</i>"]

    ENGINE -->|GA - Fulton| GA["Georgia Superior Court<br/>Fulton County<br/><i>GA Civil Practice Act<br/>O.C.G.A. Title 9</i>"]

    ENGINE -->|NY - SDNY| NY["US District Court<br/>Southern District NY<br/><i>FRCP + Local Rules SDNY</i>"]

    ENGINE -->|TX - Harris| TX["Texas District Court<br/>Harris County<br/><i>TX Rules of Civil Procedure<br/>TX CPRC</i>"]

    FL & GA & NY & TX --> PROMPT["Jurisdiction-Aware<br/>System Prompt"]
    PROMPT --> AGENTS["All AI Agents<br/><i>Chat · Strategy · Audit<br/>Discovery · Drafting</i>"]

    style ENGINE fill:#7c3aed,stroke:#8b5cf6,color:#fff
    style PROMPT fill:#2563eb,stroke:#3b82f6,color:#fff
```

---

## Deployment

Single Docker container deployed within the Eola Gateway homelab stack. The container runs alongside Ollama (local LLM), PostgreSQL, Authentik, and supporting infrastructure services.

```mermaid
flowchart TB
    subgraph DOCKER["Docker Compose Stack"]
        AETHER["Aether Container<br/><i>Node.js · React build<br/>Port 3000</i>"]
        OLLAMA["Ollama<br/><i>Llama 3.1:8b<br/>GPU-accelerated</i>"]
        PG["PostgreSQL 16<br/><i>Persistent volume</i>"]
        AK["Authentik<br/><i>SSO provider</i>"]
        REDIS["Redis 7<br/><i>Session cache</i>"]
    end

    subgraph EXTERNAL["External Services"]
        GEMINI["Google Gemini API<br/><i>Pro + Flash models</i>"]
        NAS["QNAP NAS<br/><i>Document storage<br/>NFS mount</i>"]
    end

    AETHER --> PG
    AETHER --> OLLAMA
    AETHER --> GEMINI
    AETHER --> NAS
    AK --> PG
    AK --> REDIS

    style DOCKER fill:#1e293b,stroke:#3b82f6,color:#e2e8f0
    style EXTERNAL fill:#1e293b,stroke:#f59e0b,color:#e2e8f0
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS | Single-page application |
| Backend | Express.js, TypeScript | REST API server |
| Database | PostgreSQL 16, Prisma ORM | Relational data + ORM |
| AI (Primary) | Google Gemini 3 Pro/Flash | Complex reasoning + chat |
| AI (Fallback) | Ollama + Llama 3.1:8b | Local inference, offline capability |
| Auth | Authentik SSO via Traefik ForwardAuth | Zero-trust identity |
| Reverse Proxy | Traefik v3 | TLS, routing, auth middleware |
| Edge | Cloudflare Tunnel | Secure ingress, no open ports |
| Storage | NAS-mounted filesystem | Document persistence |
| Containerization | Docker + Docker Compose | Deployment + isolation |

---

## License

© 2026. All rights reserved. This repository is shared for portfolio and demonstration purposes only. No license is granted for commercial use, reproduction, or derivative works without written permission.
