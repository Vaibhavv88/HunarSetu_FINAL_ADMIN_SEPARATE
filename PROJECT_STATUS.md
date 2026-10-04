# HunarSetu (हुनर सेतु) - Project Status & Roadmap

## 1. Project Overview
- **Product Name**: **HunarSetu (हुनर सेतु)** — *AI-Enabled Family & Vocational Career Decision System*
- **Problem Statement **: AI-Enabled Career Counselling and Family Decision-Support Platform for Vocational Education.
- **Core Thesis**: Career decisions in Indian households are joint family decisions ("Understand → Compare → Discuss → Verify → Decide"). HunarSetu engages both the learner and parents with verified NSQF evidence, addresses generational anxieties (financial stability, social perception, safety, progression), and provides an AI/human counsellor mediation flow.

## 2. Current Implementation Status (Milestone 1 Inspection)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Motion.
- **Backend / API**: Node.js + Express (mounted with Vite middlewares for seamless unified full-stack dev on port 3000), with `@google/genai` server-side integration and deterministic fallback offline demo mode.
- **AI/ML Layer**: Unified `AIService` abstraction with Gemini (`gemini-3.8-flash`), RAG over verified NSQF vocational trade profiles, transparent heuristic scoring algorithm (interest, eligibility, location, income, progression), and parent concern categorization.
- **Status**: Milestone 1 initialized. Clean baseline compiled.

## 3. Milestone Roadmap
- [x] **Milestone 1**: Environment Inspection, Architecture Definition, Product Naming, Windows Setup & Base Foundation.
- [ ] **Milestone 2**: Verified Knowledge Base & Structured Data Models (12+ NSQF vocational trades, district clusters, parent objection matrix, sources).
- [ ] **Milestone 3**: Core Engines (Career Matching Algorithm, Parent Concern Analyzer, Comparison Engine, Gemini AI Counsellor Server Route).
- [ ] **Milestone 4**: Interactive User Journeys (Learner Onboarding, Parent Perspective, Joint Family Decision Session).
- [ ] **Milestone 5**: Interactive Visual Modules (NSQF Career Roadmap, Local District Opportunity Explorer, Compare Matrix).
- [x] **Milestone 6**: Admin & Scheme Analytics Dashboard + Certified Human Counsellor Panel (Bidirectional Student + Parent Integration, Real-Time Case & Call Scheduling Engine) + Bilingual Support (Hindi/English) + Voice TTS/STT.
- [x] **Milestone 7**: Demo Mode, One-Click Scripts (`start-dev.bat`), Windows Verification, Final Hardening.

## 4. Common Counselling Architecture (Student & Parent ↔ Counsellor)
- **Bidirectional Pipeline**:
  - `Student / Parent Portal` ➔ `counsellingService` ➔ `/api/counselling/requests` ➔ `counsellingDb (JSON Database / data/counselling_db.json)` ➔ `Counsellor Desk`.
  - `Counsellor Desk` ➔ `counsellingService.sendMessage` ➔ `/api/counselling/cases/:id/messages` ➔ `counsellingDb` ➔ `Student / Parent Real-time Thread View`.
- **Automatic Multi-Channel Generation**:
  - Request Type `MESSAGE` automatically spawns a `counselling_case` + conversation entry in `counselling_messages`.
  - Request Type `CALL` / `FAMILY_SESSION` automatically provisions a `counselling_call` with date, time, and session mode.
- **Dedicated User Touchpoints**:
  - `StudentCounsellorChatView`: Dedicated student interface for querying certified guide Dr. Priya Sharma, viewing case stage, receiving verified answers, and viewing scheduled calls.
  - `ParentCounsellorChatView`: Large-text, accessible, bilingual interface with TTS read-aloud designed specifically for parental anxieties (salary, degree safety, ITI status).
  - `CounsellorPortal`: Live polling & manual sync with backend database, optimistic state updates, real-time message sending, case status transitions, and note logging.
