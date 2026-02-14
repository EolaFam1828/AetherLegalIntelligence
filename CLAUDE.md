# CLAUDE.md — Aether Public Portfolio Repository

## Role

This is the **public-facing documentation repository** for the Aether Litigation Intelligence Platform. It contains architecture diagrams, feature documentation, and design artifacts — **no source code**.

## Important: Do Not Work Here Directly

This repo is managed as part of the **Aether Alignment Checklist** from the private Aether workspace. If you need to update these docs:

```
cd ~/homelab/aether/app && claude
```

Then run the Aether Alignment Checklist from there. That checklist treats this public repo and the private repo as two views of the same system and resolves all mismatches bidirectionally.

**Never edit files in this repo without first consulting the private codebase for accuracy.**

## Repository Structure

```
AetherLegalIntelligence/
├── README.md              # Platform overview — capabilities, tech stack, limitations
├── ARCHITECTURE.md        # System diagrams, data model, AI engine, security, design decisions
├── FEATURES.md            # Module documentation with honest limitations, roadmap
├── CLAUDE.md              # This file — repo management instructions
├── LICENSE                # Copyright — portfolio demonstration only
├── legal/                 # Legal documents
│   ├── TERMS_OF_SERVICE.md
│   ├── PRIVACY_POLICY.md
│   ├── ACCEPTABLE_USE_POLICY.md
│   └── MASTER_SERVICES_AGREEMENT.md
└── public/                # Brand assets + screenshots
    ├── screenshots/
    ├── logo.svg
    └── robots.txt
```

## What Each File Covers

| File | Single Source For | Key Accuracy Points |
|---|---|---|
| `README.md` | Module capabilities table, tech stack table, limitations summary, product tour, repo structure | 30 modules, 90+ endpoints, 36 data models |
| `ARCHITECTURE.md` | System diagrams, intelligence layer, AI engine, RAG pipeline, data model ERD (36 models), API surface (14 route modules), security model, deployment, testing (266 tests), design decisions | Mermaid diagrams, cross-module dependencies, rate limiting, auth hardening |
| `FEATURES.md` | Per-module documentation with limitations, roadmap, jurisdictions | Every module's capabilities AND limitations, known limitations list, playbooks, managing-partner workflows, evidence tracking |

## Deduplication Rules

Each piece of information lives in **exactly one file**:

- **Module list** → README.md only
- **Tech stack** → README.md only
- **Limitations** → README.md (summary) links to FEATURES.md (detailed)
- **Architecture diagrams** → ARCHITECTURE.md only
- **Data model** → ARCHITECTURE.md only
- **API surface** → ARCHITECTURE.md only
- **Security model** → ARCHITECTURE.md only
- **Rate limiting** → ARCHITECTURE.md only
- **Design decisions** → ARCHITECTURE.md only
- **Per-module docs** → FEATURES.md only
- **Roadmap** → FEATURES.md only
- **Jurisdictions** → FEATURES.md only

## Alignment Rules

These docs must satisfy the following invariants at all times:

1. **Every claim maps to implementation.** No feature described here should be absent from the private codebase.
2. **Every limitation is documented.** If the code can't do something, these docs must say so explicitly.
3. **Counts are accurate.** Endpoint counts, model counts, module counts, schema model counts — all must match the private codebase exactly.
4. **No exaggeration.** "Draft generation" is not "automated document production." "LLM plausibility check" is not "legal research verification." Language must be precise.
5. **Mermaid diagrams reflect reality.** Architecture diagrams must match the actual service topology, data flow, and model routing in the private codebase.
6. **No duplication.** Each fact exists in exactly one file. Other files link to it.

## Git Remote

- **Remote:** `https://github.com/EolaFam1828/AetherLegalIntelligence.git`
- **Branch:** `main`
- **Visibility:** Public
- **License:** Copyright 2026 Jake Sadoway — portfolio demonstration only
