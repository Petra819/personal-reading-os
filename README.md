# Personal Reading OS

A calm personal reading workspace for organizing books, notes, inspirations, reflections, and reading progress.

一个用于长期管理阅读、笔记、灵感与思考的个人阅读空间。

## Overview

Personal Reading OS brings reading and knowledge work into one personal workspace. Instead of scattering reading lists, excerpts, notes, ideas, and drafts across unrelated apps and temporary files, it is designed around one continuous flow:

**Reading → Excerpts → Notes → Reflections → Ideas → Writing → Knowledge connections**

The project prioritizes a calm reading experience, clear source context, low-friction capture, and long-term maintainability across desktop, tablet, and mobile devices.

## Current Version

**V0.1 — Responsive UI Foundation**

The current version includes:

- Responsive application shell and navigation
- Dashboard with mock reading activity
- Bookshelf, notes, inspiration, freewriting, search, reflections, and settings page foundations
- Reader placeholder with a clear future entry point
- Desktop, tablet, and mobile layouts
- Reusable typography, buttons, inputs, progress, empty states, and navigation patterns

V0.1 is a UI foundation built with mock data. Authentication, database persistence, real book imports, full CRUD workflows, EPUB/PDF reading, and search are not implemented yet.

## Screenshots

Screenshots will be added as the interface reaches stable review points.

<!-- TODO: Add the reviewed Dashboard screenshot at docs/images/dashboard.png. -->

## Core Modules

| Module | Purpose |
| --- | --- |
| Dashboard | Surfaces the current book, recent records, reading summaries, and quick capture entry points. |
| Bookshelf | Organizes imported books, metadata, reading status, and progress in future stages. |
| Notes | Keeps reading notes, excerpts, source books, chapters, tags, and original locations together. |
| Inspiration | Captures short ideas, questions, quotations, and topics for later exploration. |
| Freewriting | Provides a space for longer-form writing that can reference books, notes, and ideas. |
| Search | Will provide a unified way to retrieve books and personal reading knowledge. |
| Reflections | Supports book-level and chapter-level reflections connected to source material. |
| Settings | Houses reading preferences and future account, appearance, and tag management. |

## Tech Stack

- [Next.js 16.3.5](https://nextjs.org/) with the App Router
- [React 19.2.8](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ESLint 9](https://eslint.org/) with `eslint-config-next`

Supabase and PostgreSQL are planned for later stages. They are not connected in the current version.

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
└── src/
    ├── app/          # App Router pages and global styles
    ├── components/   # Shared UI and application shell components
    └── data/         # Temporary mock data
```

## Getting Started

Install dependencies:

```bash
npm install
```

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
- [ ] **V0.2 — User System:** Supabase authentication, sessions, and private data boundaries
- [ ] **V0.3 — Bookshelf:** EPUB/PDF imports, private storage, metadata, covers, status, and filtering
- [ ] **V0.4 — EPUB Reader:** EPUB content, table of contents, reading settings, and navigation
- [ ] **V0.5 — PDF Reader:** PDF pages, page navigation, zoom, and responsive reading layout
- [ ] **V0.6 — Reading Progress:** Saved positions, cross-device recovery rules, and reading sessions
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

**Active development.** Personal Reading OS is in an early stage. The responsive UI foundation is complete, while persistence, authentication, readers, and production workflows will be implemented progressively according to the roadmap.
