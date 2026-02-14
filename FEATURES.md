# Aether — Feature Overview

> [!NOTE]
> **Portfolio Repository** — This document describes the features and capabilities of the Aether Litigation Intelligence Platform. This is a **documentation-only repository** — the production application is privately hosted.

> Each module inherits a shared Cognitive Protocol that enforces elemental analysis, adversarial reasoning, and structured output — no generic chatbot responses. All AI output requires attorney review before use.

---

## Related Documentation

- **[README.md](README.md)** — Platform overview, capabilities, tech stack
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System diagrams, data model, AI engine

---

## Table of Contents

1. [Core Platform](#core-platform)
2. [AI Intelligence Modules](#ai-intelligence-modules)
3. [Litigation Playbooks](#litigation-playbooks)
4. [Managing-Partner Workflows](#managing-partner-workflows)
5. [Evidence Tracking](#evidence-tracking)
6. [Intelligence Persistence](#intelligence-persistence)
7. [Case Signals](#case-signals)
8. [Knowledge Graph](#knowledge-graph)
9. [Simulation Modules](#simulation-modules)
10. [Analysis Tools](#analysis-tools)
11. [Document Processing Pipeline](#document-processing-pipeline)
12. [Conversation Memory](#conversation-memory)
13. [Security & Infrastructure](#security--infrastructure)
14. [Known Limitations](#known-limitations)
15. [Roadmap](#roadmap)
16. [Supported Jurisdictions](#supported-jurisdictions)

---

## Core Platform

### Case Management
Organize cases with full party tracking, document management, timeline events, and notes. Cases can be archived (soft-delete) from the Matters view and restored or permanently deleted from Settings > Archived Matters. Multi-firm architecture with per-case data separation — all queries filtered by the authenticated user's firmId. Parties are auto-populated from case titles (e.g., 'Smith v. Jones' creates Plaintiff and Defendant entries) and from document analysis (extracted plaintiff, defendant, and judge). Role fields (Admin / Member / Viewer) are stored per user; currently, only case deletion is restricted to Admin role. Other RBAC enforcement is on the roadmap.

### Document Intelligence
Upload and analyze legal documents using document text extraction and AI-assisted analysis. Supports PDFs, Office documents (Word, Excel, PowerPoint, RTF), and text files up to 50MB. Unsupported file types are rejected at upload with a clear error message. On upload, documents are processed through an asynchronous background pipeline: text extraction, AI-powered analysis, timeline event creation, party extraction, and vector embedding generation. Documents are categorized and stored on NAS-mounted persistent storage. All uploaded documents become part of the case context available to every AI module. Document uploads trigger the recalibration engine to check if existing analyses are stale.

### Semantic Search (RAG)
All uploaded documents are chunked into semantically meaningful segments and embedded as 768-dimensional vectors using Google's embedding model. When any AI module processes a query, the system retrieves the most relevant document chunks via cosine similarity search (pgvector), injecting source material into the AI context. This grounds AI responses in the actual case record rather than relying solely on model knowledge.

### Executive Case Brief
One-screen summary answering five questions about any case: What's the posture? What deadlines are critical? Where does discovery stand? What are the risk signals? What needs attention? Aggregates case data (status, jurisdiction, court, judge), upcoming deadlines with countdown, discovery metrics, document breakdown by category, party summary with inline party management (add/edit/delete), risk signals (overdue deadlines, unverified events), and recent activity — all without an AI call (pure data aggregation for instant response).

### Timeline Tracking
Chronological event management with three display modes: Timeline (chronological stream), Month Calendar, and Week Calendar. Events can be marked as verified or unverified, tagged by type (free-form string, commonly: filing, hearing, deposition, deadline, document, general), and surfaced in case briefings. Auto-extracted events are linked to their source document via `sourceDocumentId`. Deadline events drive urgency signals in case briefings. Calendar views provide spatial awareness of event density and deadline proximity.

Events now include confidence scores (0-1.0 float) for AI-extracted entries, evidence source references (JSON array linking to supporting documents or spans), extracted text (the original passage the event was derived from), event categorization, and a `hasTime` flag distinguishing date-only from date+time events.

**Current limitations:** Verification is a boolean toggle — no reviewer identity or timestamp is recorded. This is on the roadmap.

---

## AI Intelligence Modules

> [!CAUTION]
> All AI modules are decision-support tools. Output is generated by LLMs and must be reviewed, verified, and validated by a qualified attorney before any use in legal proceedings. Nothing generated by Aether constitutes legal advice.

### Case Chat Assistant
Context-aware chat powered by case data. The assistant has access to all documents, parties, events, and notes for the active case. Conversation history is persisted per-case with automatic summarization — a sliding window of recent messages is maintained alongside AI-generated summaries of older conversations, enabling continuity across sessions without unbounded context growth. Jurisdiction constraints are included in the system prompt to scope responses to applicable law. Chat uses the enriched context assembler, which injects case signals and cross-module intelligence into every prompt.

### War Room — Strategic Analysis
Structured SWOT analysis that outputs JSON with:
- **Strengths / Weaknesses / Opportunities / Threats** — categorized strategic assessment
- **Executive Summary** — high-level case posture
- **Recommended Actions** — prioritized with deadlines
- **Discovery Suggestions** — areas to investigate
- **Settlement Considerations** — BATNA and corridor analysis

Output is AI-generated based on case data and RAG context. No external legal research is performed — citations in output are LLM-generated and must be independently verified. Supports iterative refinement via feedback loop. Each analysis is persisted as a versioned `CaseAnalysis` record with input hash deduplication — re-running strategy on unchanged data returns the cached result instantly.

### Red Team Audit
AI-generated vulnerability analysis simulating opposing counsel's perspective. Outputs a structured Vulnerability Matrix as JSON:
- **Overall Threat Level** — CRITICAL / HIGH / MODERATE / LOW
- **Case Fatality Rating** — 0-100 scale
- **Vulnerability entries** across six categories: credibility, evidence, procedural, legal, damages, narrative
- Each vulnerability includes severity, exploit strategy, recommended defense, and referenced case law
- **Summary Attack Plan** and **Immediate Actions**

Referenced case law is LLM-generated and not verified against external databases. Supports iterative refinement via feedback loop. Red Team reads Strategy output via the cross-module dependency graph — vulnerabilities are identified in the context of the current strategic approach.

### Discovery Generator
Generates draft discovery requests based on case context:
- **Interrogatories** — draft written questions with strategic purpose annotations
- **Requests for Production** — document demand drafts
- **Requests for Admission** — statements requiring admit/deny responses
- Each request includes its strategic purpose and strategic basis

Output is structured JSON rendered in the UI. No export to DOCX/PDF — output must be copied and formatted by the attorney. All generated requests require review for compliance with applicable rules. Generated discovery requests are persisted as `DiscoveryRequest` records with status tracking (DRAFT → APPROVED → SENT → RESPONDED → COMPLETED).

### Document Drafting
AI-generated draft text for motions, briefs, and correspondence. The system accepts document type, instructions, and optional prior draft for iterative refinement. Drafts are persisted as `LegalDraft` records with version chains and status tracking (DRAFT → REVIEWED → FINALIZED → FILED).

**What it is:** A draft generation assistant that produces formatted markdown text based on case context and user instructions.

**What it is not:** An automated document production system. There is no export to DOCX/PDF and no template library. Output must be copied, reviewed, reformatted, and filed by the attorney.

### Citation Verification
LLM-based plausibility check for legal citations. Each citation is evaluated for:
- Whether the case name, volume, reporter, page, court, and year are plausible
- Whether the described holding is consistent with known law
- Confidence rating: verified / suspicious / likely fabricated / unable to verify

Citation results are persisted as `CitationRecord` entries with status tracking, confidence scores, and references to where the citation was used. Citations can be linked to their source analysis, draft, source document, and evidence span for full traceability. A dedicated citation extractor service identifies legal citations within documents and AI outputs, links them to evidence spans, and performs LLM-based verification. Users can override the AI's assessment via the PATCH endpoint. Citations support jurisdiction-scoped and persuasive authority flags.

**Important limitation:** This is LLM self-assessment, not external database verification. The system does not query Westlaw, LexisNexis, or any legal database. It checks whether citations are plausible based on the model's training data. "Verified" means the LLM is confident the citation exists — it does not guarantee accuracy. All citations must be independently verified through authoritative legal research tools before filing.

> [!WARNING]
> Citation "verification" is LLM confidence assessment only — not authoritative legal database confirmation.

### Case Theory Map
Maps the legal theory of the case by connecting claims to their required elements, elements to supporting and contradicting evidence, and evidence to source documents and witnesses. Outputs structured JSON with:
- **Claims** — each legal claim or cause of action with its legal basis
- **Elements** — required elements per claim with proof status (proven / partially proven / unproven / contested)
- **Evidence Mapping** — supporting and contradicting evidence per element with strength ratings
- **Gap Analysis** — per-element identification of where required elements lack sufficient evidence
- **Theory Coherence Score** — 0-100 assessment of overall theory strength
- **Critical Gaps** — top-level list of the most significant evidentiary gaps
- **Recommended Evidence** — suggested evidence to obtain to strengthen the theory

Reads from Strategy, Red Team, and Discovery modules via the cross-module dependency graph to understand case posture before mapping theory. Supports iterative refinement via feedback loop. Each analysis is persisted as a versioned `CaseAnalysis` record with input hash deduplication.

**Current limitation:** Theory map is persisted and queryable but not yet rendered as a visual graph in the UI. The structured data is displayed in a card-based layout.

### Key Exhibits
Catalogs and analyzes the most critical evidence in a case, serving as an exhibit preparation workbench. Outputs structured JSON with:
- **Exhibits** — priority-ranked list of key exhibits with titles and source documents
- **Exhibit Type** — documentary, testimonial, physical, demonstrative, or digital
- **Relevance Rating** — critical, important, supporting, or marginal
- **Proves** — what each exhibit demonstrates
- **Claims Supported** — which legal claims each exhibit supports
- **Authentication** — method, challenges, and opposing objections per exhibit
- **Trial Preparation Notes** — per-exhibit preparation guidance
- **Exhibit Strategy** — overall approach to exhibit presentation
- **Authentication Risks** — systemic authentication concerns
- **Missing Exhibits** — evidence that should exist but hasn't been located

Reads from Strategy, Red Team, and Case Theory Map modules via the cross-module dependency graph. Supports iterative refinement via feedback loop. Each analysis is persisted as a versioned `CaseAnalysis` record with input hash deduplication.

---

## Litigation Playbooks

A rule-based playbook system for codifying litigation workflows. Playbooks are defined as YAML files, validated against a JSON schema on upload, and executed against case data to produce structured recommendations.

### Playbook Structure
Each playbook defines:
- **Triggers** — Conditions determining when the playbook applies (e.g., case type, document count, jurisdiction)
- **Rules** — Risk, opportunity, and warning indicators with conditional logic (e.g., "deadline within 7 days", "missing expert report")
- **Outputs** — Artifacts to generate (reports, checklists, timelines, documents)
- **Thresholds** — Confidence and escalation gates for analysis quality
- **Jurisdiction Templates** — State-specific templates for discovery, motions, and deadlines

### Five Playbook Types

| Type | Purpose |
|------|---------|
| **Procedural** | Deadline extraction, motion windows, sanctions risk assessment |
| **Evidence** | Causation chain analysis, credibility traps, missing evidentiary links |
| **Discovery** | RFP, Interrogatories, RFA generation with jurisdiction-specific packs |
| **Hearing Prep** | Oral argument trees, anticipated judge questions, rebuttals, exhibit anchors |
| **Red Team** | Vulnerability matrix, attack plans, counter-moves |

### Execution Model
Playbook execution evaluates triggers against case data and signals, runs rule conditions, and generates structured outputs stored in `PlaybookExecution` records with triggered rules, recommendations, and metadata. Execution status is trackable (PENDING, RUNNING, COMPLETED, FAILED). Custom playbooks can be uploaded alongside the 5 built-in templates.

**Current limitations:** Playbook execution is synchronous — large playbooks on data-heavy cases may take several seconds. Playbooks cannot chain (one playbook cannot trigger another). No visual playbook editor — playbooks must be authored in YAML.

---

## Managing-Partner Workflows

Five integrated workflows providing portfolio-level visibility and operational control for managing partners.

### Portfolio Management
Risk-ranked case list computed from a deterministic scoring algorithm (0-100 scale). Risk factors include:
- Upcoming deadlines within 7 days (+25) or 14 days (+15)
- Overdue discovery packets (+20)
- Open HIGH/CRITICAL vulnerabilities (+20)
- Motions due within 14 days (+15)
- Expert reports due within 14 days (+15)
- Priority-1 open tasks (+10)

Includes an aggregated portfolio calendar showing all deadlines across cases, and real-time posture snapshots for discovery status, motion queue, expert tracking, and settlement stage.

**Current limitation:** Portfolio view aggregates data across cases but does not support custom risk weight configuration. Risk scoring algorithm is fixed.

### Task Management
Operational task tracking with priority (1-5), owner assignment, due dates, and status lifecycle (OPEN, IN_PROGRESS, DONE, CANCELLED). Tasks can be linked to case entities — events, documents, drafts, discovery requests, vulnerabilities, and strategic priorities — via TaskLink records. Tasks support source module attribution (identifying which AI module generated the task) and source analysis linking.

**Current limitation:** No task notifications or reminders. No recurring task support. Task assignment is manual — no automatic load balancing.

### Discovery Orchestration
Discovery packet tracking for both outgoing and incoming discovery (RFP, ROG, RFA, responses, productions). Each packet has status lifecycle: DRAFT, SERVED, RECEIVED, OVERDUE, DEFICIENT, CURED. The system automatically computes a per-case `DiscoveryPosture` record that tracks:
- Overall status (NOT_STARTED, IN_PROGRESS, DISPUTE, COMPLETE)
- Last outgoing and incoming action dates
- Open dispute count
- Next action hint

Discovery posture updates automatically when packets are created, modified, or deleted. Document linking allows attaching served documents to packets.

### Motion Practice Pipeline
Motion queue management with type classification: MTD (Motion to Dismiss), MSJ (Motion for Summary Judgment), MTC (Motion to Compel), MIL (Motion in Limine), EXTENSION, SANCTIONS, and OTHER. Status tracking from PLANNED through DRAFTING, FILED, HEARD, and final disposition (GRANTED, DENIED, MOOT). Due date and hearing date management. Motions can link to `LegalDraft` records for draft-motion association.

**Current limitation:** No automatic motion deadline calculation from rules of civil procedure. Hearing date reminders are not implemented.

### Expert Witness Tracking
Expert witness management per case with name, specialty, retention tracking (plaintiff/defendant/court), report due dates, report served dates, deposition dates, and Daubert challenge status (NONE, CHALLENGED, UPHELD, EXCLUDED). Expert data feeds into portfolio risk scoring (expert reports due within 14 days increase case risk score).

### Scheduling Deadline Control
Structured deadline extraction from scheduling orders with categorization: DISCOVERY, EXPERT, MOTIONS, MEDIATION, TRIAL, PRETRIAL. Each deadline carries a confidence score (HIGH, MEDIUM, LOW), source document traceability, and critical flag. Scheduling deadlines aggregate with timeline events (isDeadline=true) for comprehensive deadline views.

**Current limitation:** Scheduling deadline extraction is manual (no automatic parsing of scheduling orders). UI for scheduling deadline management is pending.

### Settlement Posture Tracking
Per-case settlement posture with last demand, last offer, mediation date, and status tracking (UNKNOWN, PRE_MEDIATION, IN_MEDIATION, POST_MEDIATION, SETTLED, IMPASSE). Settlement posture data is surfaced in portfolio triage for cross-case negotiation awareness.

---

## Evidence Tracking

### Evidence Spans
The `EvidenceSpan` model tracks specific evidence passages within documents at the sub-document level. Each span records:
- **Document and chunk linkage** — ties evidence to both the parent document and the specific vector chunk
- **Page number** — optional page-level localization within the source document
- **Character offsets** — start and end positions within the document text
- **Confidence score** — 0-1.0 rating of extraction confidence
- **Extraction attribution** — which service or module extracted the span
- **Content** — the actual extracted text passage

Evidence spans link to citation records, enabling a chain from document text through extracted evidence to legal citations used in analyses and drafts.

**Current limitations:** Evidence span extraction is performed during citation extraction and document analysis — there is no dedicated UI for manual evidence span creation or review. Page number accuracy depends on the document processor's text extraction fidelity.

---

## Intelligence Persistence

All AI module outputs are persisted as versioned `CaseAnalysis` records. This enables:

### Analysis Versioning
Every time an AI module runs, the output is stored as a new version. The previous CURRENT version is atomically marked as SUPERSEDED. The full version chain is queryable via API, enabling comparison of how analysis evolved as case data changed.

### Input Hash Deduplication
Before calling the LLM, the system computes a SHA-256 hash of the assembled context. If a CURRENT analysis already exists with the same hash, the LLM call is skipped and the cached result returned. This prevents token waste when re-running analyses without data changes.

### Staleness Detection
Each analysis stores a snapshot of the case signals (metrics) at the time it was generated. When case data changes (document uploaded, party added, event edited), the recalibration engine recomputes signals and compares them against every CURRENT analysis's snapshot. Analyses are marked with staleness severity:
- **MINOR_CHANGE** — small data shifts (e.g., note added)
- **STALE** — significant changes (e.g., new document uploaded)
- **CRITICAL** — major changes affecting core case posture (e.g., multiple overdue deadlines)

### Cross-Module Intelligence
Each AI module reads the latest outputs of other modules via a dependency graph. Strategy reads Red Team and Discovery findings. Discovery reads Strategy priorities. This creates a feedback loop where improvements to one module enrich all dependent modules.

### LLM Output Validation
All AI module outputs are validated against Zod schemas before persistence. 36 Zod validation schemas cover all request, PATCH, analysis status, playbook, task, discovery, and motion operations. Schemas are intentionally lenient (most fields optional) since LLM output is non-deterministic — the goal is catching structurally broken responses (e.g., string where object expected, missing top-level keys). If validation fails, the raw output is stored and the analysis is marked FAILED. Covers: strategy, audit, discovery, valuation, citation-check, case-theory-map, and key-exhibits modules.

### Background Job Processing
An in-process job queue polls the `AnalysisJob` table every 5 seconds. Jobs are prioritized (1=user-waiting to 5=background). Job claiming is atomic via database transaction with status filtering to prevent duplicate execution across restarts. This is designed to be replaced by pg-boss or BullMQ for multi-instance scaling.

**Current limitations:** Analysis versioning is backend-only — the UI does not yet expose version history navigation or diff views. Staleness badges are computed but not yet surfaced in all UI components. The job processor is single-instance only.

---

## Case Signals

Pre-computed case health metrics injected into every AI prompt as a compact header (~150 tokens):

| Signal Type | Examples | Source |
|------------|---------|--------|
| **QUERY** (DB aggregations) | Overdue deadlines, unverified events, document count, discovery status, vulnerability count | Direct database queries |
| **HEURISTIC** (weighted composites) | Risk level = overdue×30 + openVuln×20 + criticalVuln×15 + unverified×5 | Computed from QUERY signals |

Signals serve two purposes:
1. **Prompt enrichment** — every AI module receives current case metrics without expensive re-queries
2. **Staleness detection** — signal snapshots stored on each analysis enable the recalibration engine to detect when analyses are outdated

---

## Knowledge Graph

A lightweight directed graph of relationships between case entities, written by AI modules during analysis and queryable via the API:

| Edge Type | Meaning |
|-----------|---------|
| SUPPORTS | Entity A provides evidence for Entity B |
| CONTRADICTS | Entity A conflicts with Entity B |
| MENTIONS | Entity A references Entity B |
| DERIVED_FROM | Entity A was generated based on Entity B |

Edges connect any pair of entity types (documents, events, parties, analyses) with optional confidence scores. The graph is queryable by source node, target node, or edge type.

**Current limitation:** Knowledge graph edges are written during analysis but not yet rendered as a visual graph in the UI. The data is accessible via the GET /cases/:caseId/graph API endpoint.

---

## Simulation Modules

### Hearing Simulator
Practice oral arguments against an AI judge or opposing counsel persona. The user inputs arguments via voice or text; the AI responds in character. Maintains a running transcript within the session. Voice input uses OpenAI Whisper for speech-to-text transcription. Sessions are persisted as `SimulationSession` records with full transcripts and coaching notes.

**Limitations:** No performance scoring or evaluation metrics. No transcript export. This is a conversational practice tool, not a graded simulation. Voice recording requires `OPENAI_API_KEY`; if not configured, the mic button is disabled and text input remains available as fallback.

### Deposition Simulator
Practice depositions with an AI-generated opposing counsel who asks hostile questions. The user responds via voice or text; the AI generates follow-up questions that probe inconsistencies. Sessions are persisted as `SimulationSession` records with full transcripts.

**Limitations:** No scoring or export. Voice recording requires `OPENAI_API_KEY`; if not configured, text input only.

---

## Analysis Tools

### Settlement Analysis Assistant
AI-generated settlement scenario discussion based on case context. Outputs a structured range with supporting rationale. Persisted as a versioned analysis with input hash deduplication. This is an LLM-generated discussion aid, not actuarial analysis or financial advice — it should inform conversation, not replace professional judgment.

### Privilege Scanner
AI-based scan of document text for attorney-client privilege and work product indicators. Flags potentially protected content before production. This is a first-pass screening tool — flagged items require attorney review to confirm privilege claims.

---

## Document Processing Pipeline

Every document upload triggers an asynchronous background pipeline with tracked job lifecycle (queued → processing → completed/failed):

1. **Job Creation** — A `DocumentJob` record is created and the job ID returned to the client for status polling
2. **Text Extraction** — Content is extracted from PDF, Office documents, and text files
3. **AI Analysis** — The extracted text is analyzed for key facts, legal issues, and relevant entities
4. **Timeline Event Creation** — Dates and events identified in the document are added to the case timeline with a link to the source document
5. **Vector Embedding** — The document is split into chunks (sentence-boundary-aware) and each chunk is embedded as a 768-dimensional vector for RAG retrieval
6. **Recalibration Trigger** — The recalibration engine is notified to recompute signals and check all CURRENT analyses for staleness

**Current limitations:** No retry mechanism for failed jobs. No granular progress tracking (status is binary: processing or done). No page-level traceability — extracted events link to the document but not to specific pages or quotes within it. These are on the roadmap.

---

## Conversation Memory

The Case Chat Assistant maintains persistent conversation memory per case:

- **Sliding Window** — Recent messages are maintained in full fidelity for immediate context
- **Automatic Summarization** — When conversations exceed the window, older messages are summarized by the AI and stored as compressed context
- **Cross-Session Continuity** — Summaries persist across sessions, so the assistant retains awareness of prior discussions without consuming unbounded context

---

## Security & Infrastructure

- **Identity proxy** — Authentik SSO with Traefik ForwardAuth on every request. Header-based auth — the API trusts identity headers from the upstream proxy. No JWT signature verification or HMAC at the application layer
- **Per-case data separation** — all database queries filtered by firmId
- **Action audit logging** — logs user, action, resource, resource ID, IP, user agent, and timestamp. Does not capture before/after state values
- **Case event logging** — separate per-case event log tracking all data mutations (document uploads, party changes, analysis completions) for recalibration and audit
- **Multi-model AI with fallback** — Gemini primary, local Ollama fallback ensures availability
- **API rate limiting** — per-model sliding-window throttling with FIFO queues, graceful Ollama fallback on limit exhaustion
- **Input hash deduplication** — SHA-256 of assembled context prevents redundant LLM calls
- **Containerized deployment** — deployed behind an identity proxy

---

## Known Limitations

- **No export** — AI-generated drafts, discovery requests, and analysis output can only be viewed in the UI. No DOCX, PDF, or file download capability
- **Analysis versioning is backend-only** — AI analyses are versioned in the database with full version chains, but the UI does not yet expose version history navigation or diff views
- **No external legal research** — Citation verification and case law references are LLM-generated, not sourced from legal databases
- **Limited RBAC enforcement** — Role field exists but only case deletion checks for Admin role. Viewer restrictions are not enforced
- **Page-level traceability is partial** — Evidence spans support page numbers and character offsets, but accuracy depends on document processor text extraction fidelity. Not all extracted events have page-level attribution
- **No verification audit trail** — Event verification is a boolean toggle with no record of who verified or when
- **No job retries** — Failed document processing jobs must be re-triggered manually by re-uploading
- **Audit log captures actions, not state** — No before/after values recorded
- **Voice input requires API key** — Voice recording in simulators requires `OPENAI_API_KEY`; if not configured, text input only
- **Knowledge graph is API-only** — Graph edges are persisted and queryable but not rendered visually in the UI
- **Single-instance job processor** — Background analysis jobs processed by in-process poller, not a distributed queue
- **Staleness badges not fully surfaced** — Backend tracks staleness levels but UI does not yet display staleness indicators on all module views
- **Portfolio risk scoring is fixed** — No custom risk weight configuration; deterministic algorithm cannot be tuned per-firm
- **No task notifications** — Task management has no email, push, or in-app reminders for due dates or assignments
- **Playbooks cannot chain** — One playbook cannot trigger another; no workflow composition
- **No visual playbook editor** — Playbooks must be authored in YAML; no drag-and-drop builder
- **Scheduling deadline extraction is manual** — No automatic parsing of scheduling orders; deadlines must be entered or extracted through document analysis
- **Motion deadline calculation is manual** — No automatic deadline computation from rules of civil procedure

---

## Roadmap

Items planned but not yet implemented:

- Verification audit trail (verifiedBy, verifiedAt fields on events)
- DOCX/PDF export for drafts and discovery output
- Full RBAC enforcement (Viewer read-only, Member restricted mutations)
- Audit log state capture (old/new values on mutations)
- Job retry mechanism with exponential backoff
- Granular job progress tracking (stages and percentages)
- Integration with external legal research APIs for citation verification
- UI for analysis version history navigation and diff views
- Visual knowledge graph rendering
- Staleness badges and recalibration indicators in all module UIs
- Distributed job queue (pg-boss or BullMQ) for multi-instance scaling
- Visual playbook editor (drag-and-drop YAML builder)
- Playbook chaining (workflow composition across playbook types)
- Task notifications and due-date reminders
- Configurable risk scoring weights for portfolio management
- Automatic scheduling order parsing for deadline extraction
- Automatic motion deadline calculation from procedural rules
- Scheduling deadline management UI
---

## Supported Jurisdictions

Each AI module includes jurisdiction constraints in its system prompt, scoping generated content to the applicable court system:

| Jurisdiction | Court System |
|-------------|-------------|
| **Florida** | 9th Circuit — Orange County |
| **Georgia** | Superior Court — Fulton County |
| **New York** | US District Court — Southern District |
| **Texas** | District Court — Harris County |

---

## License

Copyright 2026 Jake Sadoway. All rights reserved. Shared for portfolio and demonstration purposes only.

---

**[<- Back to README](README.md)** | **[View Architecture ->](ARCHITECTURE.md)**

<p align="right"><a href="#aether--feature-overview">↑ Back to top</a></p>
