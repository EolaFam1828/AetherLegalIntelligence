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
├── ARCHITECTURE.md        # System diagrams (Mermaid) — data model, AI engine, RAG, security
├── FEATURES.md            # Module documentation with honest limitations
├── CLAUDE.md              # This file
├── LICENSE                # Copyright — portfolio demonstration only
├── legal/                 # Legal documents
│   ├── TERMS_OF_SERVICE.md
│   ├── PRIVACY_POLICY.md
│   ├── ACCEPTABLE_USE_POLICY.md
│   └── MASTER_SERVICES_AGREEMENT.md
└── public/                # Brand assets
```

## Alignment Rules

These docs must satisfy the following invariants at all times:

1. **Every claim maps to implementation.** No feature described here should be absent from the private codebase.
2. **Every limitation is documented.** If the code can't do something, these docs must say so explicitly.
3. **Counts are accurate.** Endpoint counts, model counts, module counts, schema model counts — all must match the private codebase exactly.
4. **No exaggeration.** "Draft generation" is not "automated document production." "LLM plausibility check" is not "legal research verification." Language must be precise.
5. **Mermaid diagrams reflect reality.** Architecture diagrams must match the actual service topology, data flow, and model routing in the private codebase.

## What Each File Covers

| File | Purpose | Key Accuracy Points |
|---|---|---|
| `README.md` | Platform overview for portfolio visitors | Module table, tech stack table, "What It Does NOT Do" section |
| `ARCHITECTURE.md` | Technical deep-dive with Mermaid diagrams | System overview, AI engine routing, RAG pipeline, data model (13 models), API surface (36+ endpoints), security model, deployment topology |
| `FEATURES.md` | Per-module documentation with limitations | Every module's capabilities AND limitations, known limitations section, roadmap |

## Git Remote

- **Remote:** `https://github.com/EolaFam1828/AetherLegalIntelligence.git`
- **Branch:** `main`
- **Visibility:** Public
- **License:** Copyright 2026 Jake Sadoway — portfolio demonstration only
