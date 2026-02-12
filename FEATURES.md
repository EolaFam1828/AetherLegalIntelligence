# Aether — Feature Overview

> Each module inherits a shared Cognitive Protocol that enforces elemental analysis, adversarial reasoning, and structured output — no generic chatbot responses.

---

## Core Platform

### Case Management
Organize cases with full party tracking, document management, timeline events, and notes. Multi-firm architecture with role-based access (Admin / Member / Viewer). All cases are scoped to the authenticated user's firm — no data leakage across tenants.

### Document Intelligence
Upload and analyze legal documents using vision-based AI. Supports PDFs, images, and text files up to 50MB. On upload, documents are automatically processed through an asynchronous pipeline: text extraction, AI-powered analysis, timeline event creation, and vector embedding generation. Documents are tagged, categorized, and stored on NAS-mounted persistent storage. All uploaded documents become part of the case context available to every AI module.

### Semantic Search (RAG)
All uploaded documents are chunked into semantically meaningful segments and embedded as 768-dimensional vectors using Google's embedding model. When any AI module processes a query, the system retrieves the most relevant document chunks via cosine similarity search (pgvector), injecting precise source material into the AI context. This ensures AI responses are grounded in the actual case record rather than relying solely on model knowledge.

### Timeline Tracking
Chronological event management with deadline flagging. Events can be marked as verified or unverified, tagged by type (filing, hearing, deposition, deadline, general), and surfaced in case briefings. Deadline events drive urgency signals in strategy analysis.

---

## AI Intelligence Modules

### AI Legal Advisor
Context-aware chat powered by case data. The advisor has access to all documents, parties, events, and notes for the active case. Conversation history is persisted per-case with automatic summarization — a sliding window of recent messages is maintained alongside AI-generated summaries of older conversations, enabling continuity across sessions without unbounded context growth. Jurisdiction constraints ensure advice stays within applicable law.

### War Room — Strategic Analysis
Full SWOT analysis engine that outputs structured JSON:
- **Elemental Analysis** — breaks every claim/defense into elements, flags satisfied vs. unproven vs. contradicted
- **Adversarial Forecast** — predicts opponent's likely moves with probability ratings and counter-tactics
- **Strategic Sequence** — ordered action plan optimized for momentum
- **Narrative Theme** — the one-sentence story that wins
- **Win Probability** — quantified 0-100 assessment

Jurisdiction-aware: all case law citations are constrained to the applicable court system.

### Red Team Audit
Simulates a senior defense partner conducting a vulnerability analysis of the plaintiff's case. Outputs a structured Vulnerability Matrix:
- **Overall Threat Level** — CRITICAL / HIGH / MODERATE / LOW
- **Case Fatality Rating** — 0-100 scale
- **Vulnerability entries** across six categories: credibility, evidence, procedural, legal, damages, narrative
- Each vulnerability includes severity, exploit strategy (how opposing counsel attacks), recommended defense, and risky case law
- **Summary Attack Plan** — synthesis of how the defense wins if vulnerabilities aren't addressed
- **Immediate Actions** — urgent steps before next hearing

### Discovery Generator
Generates targeted, strategically valuable discovery requests based on case context:
- **Interrogatories** — sworn written questions with objection-proof language
- **Requests for Production** — document demands with proper legal format
- **Requests for Admission** — statements requiring admit/deny responses
- Each request includes its strategic purpose and follows applicable procedural rules

### Document Drafting
AI-generated motions, briefs, and legal correspondence. Drafts follow jurisdiction-specific formatting requirements and cite applicable law.

### Citation Verification
Checks legal citations for hallucination risk. Each citation is evaluated for:
- Whether the case exists (name, volume, reporter, page, court, year plausibility)
- Whether the described holding matches the actual case
- Confidence rating: verified / suspicious / likely fabricated / unable to verify
- Overall risk assessment with recommended actions

Designed to catch AI-generated citation errors before they reach a filing.

---

## Simulation Modules

### Hearing Simulator
Practice oral arguments against an AI judge with configurable persona (skeptical, detail-oriented, impatient). The judge asks probing questions, challenges weak points, and evaluates argument quality.

### Deposition Simulator
Prepare for depositions against a hostile AI opposing counsel. The simulator applies pressure tactics, tests witness credibility, and exploits inconsistencies — designed to surface weaknesses in testimony before the real deposition.

---

## Analysis Tools

### Case Valuation
Settlement value estimation using comparable case analysis, injury severity assessment, and jurisdiction-specific damage calculations. Outputs a range with supporting rationale.

### Privilege Scanner
Scans documents for attorney-client privilege and work product indicators. Flags potentially protected content before production to prevent inadvertent disclosure.

---

## Document Processing Pipeline

Every document upload triggers an automatic, asynchronous processing pipeline:

1. **Text Extraction** — Content is extracted from PDF, image, and text files
2. **AI Analysis** — The extracted text is analyzed by the AI engine for key facts, legal issues, and relevant entities
3. **Timeline Event Creation** — Significant dates and events identified in the document are automatically added to the case timeline
4. **Vector Embedding** — The document is split into semantically coherent chunks (sentence-boundary-aware) and each chunk is embedded as a 768-dimensional vector for RAG retrieval

This pipeline runs in the background after upload — users see their document immediately while processing completes asynchronously.

---

## Conversation Memory

The AI Legal Advisor maintains persistent, efficient conversation memory per case:

- **Sliding Window** — Recent messages are maintained in full fidelity for immediate context
- **Automatic Summarization** — When conversations exceed the window, older messages are automatically summarized by the AI and stored as compressed context
- **Cross-Session Continuity** — Summaries persist across sessions, so the AI advisor retains awareness of prior discussions without consuming unbounded context

This enables sustained, multi-session legal analysis where the AI builds cumulative understanding of a case over time.

---

## Security & Infrastructure

- **Zero-trust network** — Cloudflare Tunnel, no open ports
- **SSO authentication** — Authentik with Traefik ForwardAuth on every request
- **Firm-scoped data isolation** — all queries filtered by firmId
- **Comprehensive audit logging** — user, action, resource, IP, user agent, metadata
- **Multi-model AI with fallback** — Gemini primary, local Ollama fallback ensures availability
- **Containerized deployment** — Docker with persistent volumes

---

## Supported Jurisdictions

Each AI module is bound to the applicable jurisdiction's statutes, procedural rules, and court conventions:

| Jurisdiction | Court System |
|-------------|-------------|
| **Florida** | 9th Circuit — Orange County |
| **Georgia** | Superior Court — Fulton County |
| **New York** | US District Court — Southern District |
| **Texas** | District Court — Harris County |

---

## License

Copyright 2026 Jake Sadoway. All rights reserved. Shared for portfolio and demonstration purposes only.
