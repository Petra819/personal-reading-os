# Personal Reading OS

A calm personal reading workspace for organizing books, notes, inspirations, reflections, and reading progress.

一个用于长期管理阅读、笔记、灵感与思考的个人阅读空间。

## Overview

Personal Reading OS brings reading and knowledge work into one personal workspace. Instead of scattering reading lists, excerpts, notes, ideas, and drafts across unrelated apps and temporary files, it is designed around one continuous flow:

**Reading → Excerpts → Notes → Reflections → Ideas → Writing → Knowledge connections**

The project prioritizes a calm reading experience, clear source context, low-friction capture, and long-term maintainability across desktop, tablet, and mobile devices.

## Current Version

**V0.2 — Data Foundation & Bookshelf MVP**

V0.2 is complete and includes:

- Responsive application shell and protected application routes
- Single-user Email + Password authentication with cookie-based sessions
- Supabase/PostgreSQL persistence with Row Level Security for private book data
- Manual book creation, a real Bookshelf, and Book Detail pages
- Manual page progress and reading status updates through an atomic database RPC
- A Dashboard backed by real current-reading data and book status counts
- Desktop, tablet, and mobile layouts with reusable form, progress, empty, and error states

Authentication currently uses a single personal account created manually in the Supabase Dashboard. The application provides Email + Password sign-in and does not expose public registration. Magic Link authentication may be considered later if custom SMTP is configured.

EPUB/PDF imports, the Reader, source locations, Notes CRUD, Ideas, Reflections, search persistence, reading-time tracking, and AI features are not implemented yet. Placeholder pages remain for planned modules and clearly identify unavailable functionality.

## Current Flow

**Login → Dashboard → Library → Add Book → Book Detail → Update reading progress → Dashboard sync**

Books are currently entered manually. Page numbers represent a user-maintained reading record and are not EPUB/PDF reader locations.

## Screenshots

Screenshots will be added as the interface reaches stable review points.

<!-- TODO: Add the reviewed Dashboard screenshot at docs/images/dashboard.png. -->

## Core Modules

| Module | Purpose |
| --- | --- |
| Dashboard | Shows the current reading book and real counts for each reading status. |
| Bookshelf | Lists manually added books with their status and page-based progress. |
| Notes | Planned space for reading notes, excerpts, sources, and original locations. |
| Inspiration | Planned space for short ideas, questions, quotations, and research topics. |
| Freewriting | Planned space for longer-form writing connected to reading material. |
| Search | Will provide a unified way to retrieve books and personal reading knowledge. |
| Reflections | Planned space for book-level and chapter-level reflections. |
| Settings | Provides sign-out and entry points for planned personal preferences. |

## Tech Stack

- [Next.js 16.3.5](https://nextjs.org/) with the App Router
- [React 19.2.8](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ESLint 9](https://eslint.org/) with `eslint-config-next`
- [Supabase JS 2.116.0](https://supabase.com/docs/reference/javascript/) and `@supabase/ssr` 0.12.7
- Supabase Auth and PostgreSQL with Row Level Security

Supabase provides cookie-based authentication, private book persistence, RLS ownership boundaries, and transactional RPCs for book creation and reading-state updates.

## Project Structure

```text
personal-reading-os/
├── docs/
│   ├── images/       # Reserved for reviewed project screenshots
│   ├── DATABASE.md   # Planned Supabase/PostgreSQL data model
│   ├── DESIGN.md     # Visual system, layout, and responsive rules
│   ├── PRD.md        # Product scope and requirements
│   └── ROADMAP.md    # Phased delivery plan
├── public/           # Static assets
├── src/
    ├── app/          # App Router pages and global styles
    ├── components/   # Shared UI and application shell components
    ├── data/         # Temporary mock data
    └── lib/          # Supabase browser, server, and session helpers
└── supabase/         # Local configuration and reviewed SQL migrations
```

## Getting Started

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and provide the Supabase project URL and publishable key. A personal Email + Password user must be created manually in the Supabase Dashboard; the application does not provide sign-up.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Useful project checks:

```bash
npm run lint
npm run build
```

## Roadmap

- [x] **V0.1 — Basic UI:** Responsive application shell, navigation, page foundations, typography, and empty states
- [x] **V0.2 — Data Foundation & Bookshelf MVP:** Minimal authentication, private data, manual books, Book Detail, atomic page-based progress updates, and real Dashboard data
- [ ] **V0.3 — File Import & Storage Foundation:** EPUB/PDF imports, private storage, file metadata, covers, and duplicate handling
- [ ] **V0.4 — EPUB Reader:** EPUB content, table of contents, reading settings, and navigation
- [ ] **V0.5 — PDF Reader:** PDF pages, page navigation, zoom, and responsive reading layout
- [ ] **V0.6 — Reading Locations and Sessions:** EPUB/PDF positions, cross-device recovery rules, and reading sessions
- [ ] **V0.7 — Notes and Highlights:** Excerpts, highlights, notes, and return-to-source navigation
- [ ] **V0.8 — Ideas, Reflections, and Writing:** Unified entries, references, and quick capture
- [ ] **V0.9 — Search, Tags, and Statistics:** Cross-content retrieval, shared tags, and reading analytics
- [ ] **V1.0 — PWA and Production Deployment:** Installable experience, production release, and quality review
- [ ] **V2.0 — AI:** Planned exploration of personal knowledge Q&A, organization, connections, and writing assistance

See [docs/ROADMAP.md](docs/ROADMAP.md) for scope and completion criteria for each stage.

## Product Principles

- **Calm over noisy:** Use warm, restrained visuals and generous space to keep attention on content.
- **Reading first:** Books, excerpts, and personal writing remain more prominent than interface controls.
- **Low-friction capture:** Ideas and notes should be easy to record without interrupting reading.
- **Responsive by default:** Every primary experience is designed for desktop, tablet, and mobile from the start.
- **Organized and retrievable:** Personal knowledge should retain its source and remain useful over time.

## Status

**Active development.** V0.2 Data Foundation & Bookshelf MVP is complete. The current product supports the authenticated manual-bookshelf workflow described above. V0.3 File Import & Storage Foundation is planned and has not started; readers and the remaining knowledge-management modules follow in later stages.
