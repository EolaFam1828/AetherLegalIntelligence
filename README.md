# Aether — Litigation Intelligence Platform

AI-powered legal case management for pro se litigants and solo practitioners.

## Features

- **Case Management** — Organize cases, parties, documents, timeline events, and notes
- **AI Legal Advisor** — Context-aware chat powered by Gemini 3 Pro
- **Strategy Engine** — War room SWOT analysis with adversarial forecasting
- **Red Team Audit** — Opposing counsel vulnerability analysis
- **Document Intelligence** — Upload and analyze legal documents
- **Document Drafting** — AI-generated motions, briefs, and letters
- **Discovery Generator** — Interrogatories, RFPs, and RFAs tailored to your case
- **Citation Verification** — Checks case citations for hallucination risk
- **Hearing Simulator** — Practice arguments against an AI judge
- **Deposition Simulator** — Prepare for depositions with hostile AI opposing counsel
- **Privilege Scanner** — Detect attorney-client privilege and protected content
- **Case Valuation** — Settlement value estimates with comparable cases
- **Timeline Tracking** — Chronological event management with deadline alerts

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Express.js, TypeScript, Prisma ORM
- **Database:** PostgreSQL 16 with pgvector
- **AI:** Gemini 3 Pro (complex reasoning), Gemini 3 Flash (chat/scans), Ollama fallback
- **Auth:** Authentik SSO via Traefik ForwardAuth
- **Storage:** NAS-mounted filesystem

## Deployment

Deployed as a Docker container in the Eola Gateway homelab infrastructure. See the parent `docker-compose.yml` for configuration.

```bash
# Build and deploy
cd ~/homelab/aether
docker compose build --no-cache aether
docker compose up -d aether
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `OLLAMA_BASE_URL` | No | Ollama server URL (default: http://ollama:11434) |
| `DATA_DIR` | No | Data directory (default: /app/data) |
| `PORT` | No | Server port (default: 3000) |

## License

Copyright (c) 2026 Jake. All rights reserved.

PORTFOLIO LICENSE — NO COMMERCIAL USE

This repository and its contents are shared publicly for portfolio
demonstration and evaluation purposes only.

NO LICENSE IS GRANTED for any of the following without prior written
permission from the copyright holder:

  - Commercial use of any kind
  - Reproduction or distribution
  - Creation of derivative works
  - Use in any production system or service
  - Incorporation into any product or offering

For licensing inquiries, please contact the copyright holder directly.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY ARISING FROM THE USE OF THIS SOFTWARE.
