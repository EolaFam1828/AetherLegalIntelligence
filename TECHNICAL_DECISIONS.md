# Technical Decisions — Aether Design Trade-offs

> This document explains key technical decisions and trade-offs in the Aether platform. All information is derived from the documented architecture and limitations in [ARCHITECTURE.md](ARCHITECTURE.md) and [FEATURES.md](FEATURES.md).

---

## Table of Contents

- [AI Architecture Decisions](#ai-architecture-decisions)
- [Data Architecture Decisions](#data-architecture-decisions)
- [Security Architecture Decisions](#security-architecture-decisions)
- [Infrastructure Decisions](#infrastructure-decisions)
- [Known Trade-offs](#known-trade-offs)

---

## AI Architecture Decisions

### Task-Based Model Routing

**Decision:** Route requests to different AI models based on task complexity rather than using a single model for all tasks.

**Rationale:**
- Complex reasoning (strategy, audit, drafting) requires the most capable model (Gemini Pro)
- Lighter tasks (chat, scans, simulations) benefit from lower latency (Gemini Flash)
- Balances cost, latency, and quality

**Trade-offs:**
- More complex routing logic
- Different models may have subtle style variations
- Benefit: Optimized cost-to-quality ratio across all use cases

### Local LLM Fallback

**Decision:** Run Ollama + Llama 3.1 locally as a fallback when Gemini API is unavailable.

**Rationale:**
- Ensures system remains operational during API outages
- Provides offline capability
- Reduces total reliance on external providers

**Trade-offs:**
- Requires GPU resources for acceptable performance
- Output quality may differ from primary models
- Benefit: System availability and resilience

### Input Hash Deduplication

**Decision:** Compute SHA-256 hash of assembled context before every LLM call and return cached results for unchanged inputs.

**Rationale:**
- Prevents token waste when re-running analyses without data changes
- Instant response for repeated queries
- Reduces API costs

**Trade-offs:**
- Additional database lookup on every request
- Cache invalidation complexity with cross-module dependencies
- Benefit: Significant cost savings and performance improvement

### Versioned Analysis Persistence

**Decision:** Store every AI module output as a new version rather than overwriting existing analyses.

**Rationale:**
- Enables historical comparison
- Supports "show me how analysis evolved" queries
- Facilitates debugging and refinement

**Trade-offs:**
- Storage growth over time (25+ models with version chains)
- More complex queries for "latest" analysis
- Benefit: Full audit trail and evolution visibility

---

## Data Architecture Decisions

### Prisma ORM

**Decision:** Use Prisma as the database ORM rather than raw SQL or another ORM.

**Rationale:**
- Type-safe database access with TypeScript
- Schema migration tooling
- Generated types prevent runtime errors

**Trade-offs:**
- Additional abstraction layer
- Less control over query optimization
- Benefit: Developer productivity and type safety

### pgvector for Embeddings

**Decision:** Store vector embeddings directly in PostgreSQL using pgvector extension rather than using a dedicated vector database.

**Rationale:**
- Keeps all data in one system
- Simplifies deployment (no additional service)
- Sufficient performance for single-tenant use case

**Trade-offs:**
- May not scale to massive vector collections
- Less specialized than dedicated vector databases (Pinecone, Weaviate)
- Benefit: Simplified architecture and operations

### Multi-Tenant Data Model

**Decision:** Implement firm-level data isolation with all queries filtered by `firmId` rather than separate databases per firm.

**Rationale:**
- Simplified deployment (single database)
- Easier cross-firm analytics (if needed in future)
- Standard multi-tenant pattern

**Trade-offs:**
- Risk of query filter bugs exposing cross-firm data
- All firms share database resources
- Benefit: Operational simplicity

### Soft Delete for Case Archiving

**Decision:** Archive cases via `archivedAt` timestamp rather than hard deletion.

**Rationale:**
- Enables restore functionality
- Preserves audit trail
- Prevents accidental data loss

**Trade-offs:**
- Archived data continues to consume storage
- Queries must filter archived cases
- Benefit: Data safety and recovery capability

---

## Security Architecture Decisions

### Header-Based Authentication

**Decision:** Trust identity headers from upstream proxy (Authentik via ForwardAuth) rather than implementing JWT or HMAC verification at the application layer.

**Rationale:**
- Simpler implementation
- Standard pattern for services behind reverse proxies
- Security enforced at network perimeter

**Trade-offs:**
- **No cryptographic verification** at application layer
- Depends on network isolation
- Vulnerable if proxy is bypassed
- Benefit: Development velocity and deployment simplicity

**Limitation:** From [ARCHITECTURE.md](ARCHITECTURE.md) — "No JWT signature verification or HMAC at the application layer"

### Minimal RBAC Enforcement

**Decision:** Store role field (Admin/Member/Viewer) per user but only enforce Admin check for case deletion.

**Rationale:**
- Deferred full RBAC implementation
- Allows role assignment now, enforcement later

**Trade-offs:**
- Viewer role is not actually read-only
- Member/Viewer distinction is nominal
- On roadmap: Full RBAC enforcement

**Limitation:** From [FEATURES.md](FEATURES.md) — "Role fields (Admin / Member / Viewer) are stored per user; currently, only case deletion is restricted to Admin role."

### Action Audit Without State Capture

**Decision:** Log user actions (who, what, when, where) but not before/after state values.

**Rationale:**
- Simpler implementation
- Sufficient for basic accountability

**Trade-offs:**
- Cannot reconstruct data history from audit log
- Limits forensic analysis capability
- On roadmap: State capture

**Limitation:** From [ARCHITECTURE.md](ARCHITECTURE.md) — "Audit log records actions but not before/after state values"

---

## Infrastructure Decisions

### Single Docker Container

**Decision:** Deploy frontend and backend as a single container rather than separate services.

**Rationale:**
- Simplified deployment
- No inter-service networking complexity
- Faster development iteration

**Trade-offs:**
- Cannot scale frontend and backend independently
- Larger container image
- Benefit: Operational simplicity

### Containerized Deployment Behind Identity Proxy

**Decision:** Deploy as a containerized service within homelab infrastructure behind Authentik SSO proxy rather than cloud deployment.

**Rationale:**
- Portfolio demonstration project
- Full control over infrastructure
- No cloud hosting costs
- Data remains on-premises

**Trade-offs:**
- No geographic distribution
- Limited scalability
- Single point of failure
- Benefit: Cost, control, privacy

### NAS-Mounted Storage

**Decision:** Store document files on NAS-mounted NFS volume rather than object storage (S3) or database BLOBs.

**Rationale:**
- Existing homelab infrastructure
- Cost-effective storage
- Simple file access

**Trade-offs:**
- Network filesystem latency
- Single storage endpoint
- No built-in replication
- Benefit: Cost and infrastructure reuse

### In-Process Job Queue

**Decision:** Use an in-process job queue (polling `AnalysisJob` table every 5 seconds) rather than a distributed queue (BullMQ, pg-boss).

**Rationale:**
- Simpler implementation
- No additional infrastructure
- Sufficient for single-instance deployment

**Trade-offs:**
- **Single-instance only** — cannot scale horizontally
- Jobs lost if process crashes
- On roadmap: Distributed queue for multi-instance scaling

**Limitation:** From [FEATURES.md](FEATURES.md) — "Background job processing... designed to be replaced by pg-boss or BullMQ for multi-instance scaling."

---

## Known Trade-offs

### No Document Export

**Decision:** Display AI-generated content in UI only with no DOCX/PDF export capability.

**Rationale:**
- Deferred feature (export formatting is complex)
- Ensures attorney review before any external use

**Trade-offs:**
- Users must manually copy and reformat content
- Reduces workflow efficiency
- On roadmap: Export functionality

**Limitation:** From [FEATURES.md](FEATURES.md) — "No export to DOCX/PDF — output must be copied and formatted by the attorney."

### No External Legal Research

**Decision:** Use LLM-based plausibility checking for citations rather than integrating with Westlaw or LexisNexis.

**Rationale:**
- API access to legal databases is expensive
- LLM can detect obviously fabricated citations
- Integration complexity

**Trade-offs:**
- "Verified" means LLM is confident, not that citation is confirmed
- All citations require independent verification
- False confidence if LLM hallucinates plausibility

**Limitation:** From [README.md](README.md) — "Citation verification is LLM-based plausibility checking, not Westlaw/LexisNexis lookup."

### No Page-Level Traceability

**Decision:** Link extracted timeline events to source documents but not to specific pages or quotes.

**Rationale:**
- Deferred feature (page-level extraction requires more complex parsing)

**Trade-offs:**
- Users must manually locate event in document
- Reduces utility of auto-extracted events
- On roadmap: Page numbers, source quotes, confidence scores

**Limitation:** From [FEATURES.md](FEATURES.md) — "Extracted events link to the source document but do not store page numbers, source quotes, or confidence scores."

### Backend-Only Analysis Versioning

**Decision:** Version analyses in database with full version chains but don't expose version history in UI.

**Rationale:**
- Backend versioning implemented first
- UI for version history navigation deferred

**Trade-offs:**
- Users cannot see how analysis evolved over time
- Cannot compare versions side-by-side
- On roadmap: Version history UI and diff views

**Limitation:** From [README.md](README.md) — "Analysis versioning is backend-only. AI analyses are versioned in the database with full version chains, but the UI does not yet expose version history navigation or diff views."

### No Job Retry Mechanism

**Decision:** Failed document processing jobs must be manually re-triggered by re-uploading the document.

**Rationale:**
- Deferred feature (retry logic requires failure classification and exponential backoff)

**Trade-offs:**
- Transient failures (network, API rate limits) require manual intervention
- Reduces reliability
- On roadmap: Retry mechanism with exponential backoff

**Limitation:** From [README.md](README.md) — "No job retries. Failed document processing jobs must be re-triggered by re-uploading."

---

## Performance Considerations

### Rate Limiting Strategy

Per-model sliding-window rate limiting with FIFO queues:

| Model | RPM | TPM | RPD | Wait Strategy |
|-------|-----|-----|-----|--------------|
| Gemini Pro | 25 | 1,000,000 | 250 | Interactive: 5s → fallback; Background: 120s |
| Gemini Flash | 2,000 | 4,000,000 | Unlimited | Rarely exhausted |
| Embedding 001 | 3,000 | 1,000,000 | Unlimited | Rarely exhausted |

**Decision:** Service-level rate limiting rather than middleware-based.

**Rationale:**
- Fine-grained control per model
- Graceful degradation to Ollama
- Prevents API 429 errors

### Recalibration Debouncing

**Decision:** Batch rapid-fire data mutations with 60-second debouncing before triggering staleness checks.

**Rationale:**
- Prevents redundant signal recomputation
- Handles bulk uploads efficiently

**Trade-offs:**
- Staleness indicators may lag reality by up to 60 seconds
- Benefit: Reduces database load

### Context Assembly Caching

**Decision:** Pre-compute case signals and inject into every AI prompt rather than computing on-demand.

**Rationale:**
- Consistent metrics across all modules
- Faster prompt assembly
- Enables staleness detection

**Trade-offs:**
- Additional database tables (CaseSignal)
- Signals may be slightly stale between recomputations
- Benefit: Performance and consistency

---

## Related Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Full system architecture
- **[FEATURES.md](FEATURES.md)** — Module documentation with limitations and roadmap
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** — Technical implementation details
- **[SECURITY.md](SECURITY.md)** — Security model and authentication

---

## License

Copyright 2026 Jake Sadoway. All rights reserved. Portfolio demonstration only.

---

**[← Back to README](README.md)** | **[View Architecture →](ARCHITECTURE.md)** | **[View Features →](FEATURES.md)** | **[Security Model →](SECURITY.md)**
