# HunarSetu System Architecture

## Architecture Overview

```
+-----------------------------------------------------------------------+
|                           CLIENT LAYER                                |
|  - React 19 SPA (Vite)                                                |
|  - Bilingual Interface (English / हिन्दी) with Low-Digital UI         |
|  - Voice Assistant (Web Speech API STT/TTS with Native Fallbacks)      |
|  - User Journeys:                                                     |
|      * Learner Flow (Step-by-step Interest & Eligibility Discovery)   |
|      * Parent Flow (Financial, Safety, Status Concern Intake)         |
|      * Joint Family Career Session (Disagreement Resolution)          |
|      * Visual Roadmap & District Opportunity Explorer                 |
|      * Human Counsellor Escalation Modal                              |
|      * Admin Analytics Dashboard (Resistance & Concern Trends)        |
+-----------------------------------------------------------------------+
                                  |
                                  | REST / HTTP API (/api/*)
                                  v
+-----------------------------------------------------------------------+
|                      FULL-STACK SERVER LAYER                          |
|  - Express / Node.js runtime (tsx server.ts, port 3000)               |
|  - Unified Vite middleware in dev / static SPA in prod                |
|  - Core Routing:                                                      |
|      * /api/careers (List, Details, Filters by NSQF level & district) |
|      * /api/match (Transparent multi-factor compatibility scoring)    |
|      * /api/compare (Head-to-head trade comparison)                   |
|      * /api/parent-concern (Objection acknowledgment & evidence)      |
|      * /api/ai/counsel (Gemini 3.8 Flash + RAG Knowledge Grounding)  |
|      * /api/counsellor/request (Human escalation queue)               |
|      * /api/admin/analytics (Parent hesitation breakdown)             |
+-----------------------------------------------------------------------+
                                  |
           +----------------------+----------------------+
           |                                             |
           v                                             v
+-----------------------------+             +---------------------------+
|    AI & RAG ENGINE          |             | VERIFIED DATA STORAGE     |
| - @google/genai SDK         |             | - In-memory / Relational   |
| - Model: gemini-3.8-flash   |             |   JSON-Document schema    |
| - Grounded RAG Ingestion:   |             | - 12+ NSQF Trade Profiles |
|   * NSQF Levels 3 to 7      |             | - Local District Clusters |
|   * NCVET & MSDE Guidelines |             | - Verified Evidence Cit.  |
| - Deterministic Demo Mode   |             | - Session State & Queue   |
|   (Fallback if no API key)  |             |                           |
+-----------------------------+             +---------------------------+
```

## Anti-AI Slop & Trust Principles
1. **Explainable Matching**: Match scores explicitly break down Interest Fit (25%), Eligibility Fit (25%), District Fit (20%), Income Fit (15%), and Growth Fit (15%). No opaque numbers.
2. **Transparent Sourcing**: Every salary, placement, and apprenticeship statistic attributes its source (e.g. NCVET Annual Tracer Study, DGT ITI Directory, MSDE Skill India Report) or clearly marks "Prototype / Illustrative Data".
3. **Family Inclusivity**: Dedicated Parent Perspective addressing real Indian parental hesitations ("Can my child study B.Tech later via lateral entry?", "Will society respect an Electrician?").
