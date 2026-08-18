# GRAHITA — Spatial Architecture Studio Portfolio

A full-stack web portfolio for an architecture studio, featuring an immersive **floating 3D cube field** hero built with Three.js inside Angular, backed by a NestJS REST API with SQLite storage.

---

## Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| **Frontend**  | Angular 18 (Standalone, Signals, SCSS)            |
| **3D Engine** | Three.js (native, via `@ViewChild canvas`)        |
| **Backend**   | Node.js + NestJS + TypeORM                        |
| **Database**  | SQLite via `better-sqlite3` (auto-created)        |
| **Monorepo**  | `/frontend` + `/backend` with root `concurrently` |

---

## Project Structure

```
UJI COBA/
├── package.json              ← Root: npm run dev starts BOTH services
├── README.md
│
├── frontend/                 ← Angular 18 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── cube-field/       ← Three.js 3D scene component
│   │   │   ├── pages/
│   │   │   │   ├── home/             ← Homepage (mounts cube-field)
│   │   │   │   ├── manifestation/    ← Studio manifesto
│   │   │   │   ├── about-us/         ← Team & studio profile
│   │   │   │   ├── news/             ← News archive (empty)
│   │   │   │   ├── career/           ← Job openings
│   │   │   │   ├── contact-us/       ← Contact form → POST /contact
│   │   │   │   └── project-detail/   ← Project detail page
│   │   │   ├── services/
│   │   │   │   ├── project.service.ts    ← HTTP client to backend
│   │   │   │   └── language.service.ts   ← EN / 中文 toggle (Signals)
│   │   │   ├── app.component.ts/html/scss ← Global layout (logo, nav)
│   │   │   ├── app.routes.ts              ← Angular router config
│   │   │   └── app.config.ts              ← provideHttpClient, router
│   │   └── styles.scss               ← Global reset + Inter font
│   └── package.json
│
└── backend/                  ← NestJS API
    ├── src/
    │   ├── projects/
    │   │   ├── project.entity.ts     ← TypeORM entity
    │   │   ├── projects.service.ts   ← DB queries + auto-seed
    │   │   ├── projects.controller.ts ← GET /projects, GET /projects/:id
    │   │   └── projects.module.ts
    │   ├── contact/
    │   │   ├── contact.entity.ts     ← TypeORM entity
    │   │   ├── create-contact.dto.ts ← Validation DTO
    │   │   ├── contact.service.ts    ← Saves form submissions
    │   │   ├── contact.controller.ts ← POST /contact
    │   │   └── contact.module.ts
    │   ├── app.module.ts             ← TypeORM (SQLite) + module registry
    │   └── main.ts                   ← CORS + ValidationPipe + port 3000
    └── package.json
```

---

## Quick Start

### Prerequisites

- **Node.js** v18+ (tested on v24)
- **npm** v9+

### 1. Install all dependencies

```bash
npm install
```

> This automatically runs `npm install` inside `/frontend` and `/backend` via the `postinstall` script.

### 2. Run both services simultaneously

```bash
npm run dev
```

This uses `concurrently` to launch:

- 🔵 **Frontend** at **http://localhost:4200** (Angular dev server with hot reload)
- 🟢 **Backend** at **http://localhost:3000** (NestJS watch mode)

The SQLite database (`backend/db.sqlite`) is created automatically on first run.
5 placeholder projects are auto-seeded into the database on first startup.

---

## Running Separately

```bash
# Frontend only
npm run start:frontend

# Backend only
npm run start:backend
```

---

## API Endpoints

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| `GET`  | `/projects`     | Returns all projects (array)    |
| `GET`  | `/projects/:id` | Returns a single project by ID  |
| `POST` | `/contact`      | Saves a contact form submission |

### POST /contact body example

```json
{
  "name": "Taro Yamamoto",
  "email": "taro@example.com",
  "message": "We would like to discuss a residential commission in Kyoto."
}
```

---

## 3D Scene — How It Works

The **CubeFieldComponent** (`/frontend/src/app/components/cube-field/`) creates a Three.js `WebGLRenderer` mounted on a `<canvas>` element via Angular's `@ViewChild`.

- **55 cubes** are scattered across a loosely broken 5×5×5 grid
- All cubes are **wireframe** (EdgeGeometry + LineBasicMaterial) with near-transparent solid faces for raycasting
- **5 project-slot cubes** are assigned to backend project data; they get slightly darker wireframe and a brighter edge highlight on hover
- **OrbitControls** with damping enable drag-to-rotate and scroll-to-zoom
- **Idle animation**: every cube has a unique floating speed/phase and slow continuous Y-axis rotation
- **Hover**: Raycasting detects project cubes → scale enlargement + dark border highlight + glassmorphism tooltip
- **Click**: Navigates to `/projects/:id` in Angular router

---

## Adding Real Project Data

1. Open `backend/db.sqlite` with any SQLite viewer (e.g. DB Browser for SQLite)
2. Edit the `projects` table rows — change `title`, `category`, `location`, `year`, `description`, and set `thumbnailUrl` to any publicly accessible image URL
3. The 3D cube field reads from `GET /projects` on load — refresh the page to see project images on the top face of their assigned cubes

Alternatively, add a POST `/projects` route to `ProjectsController` when ready for full CRUD.

---

## Language Support

The language switcher (bottom-left UI) toggles between **English** and **中文** using a simple Angular Signal-based `LanguageService`. All navigation labels and form text are translated. To add more keys, extend the `dictionary` object in:

```
frontend/src/app/services/language.service.ts
```

---

## Notes

- The SQLite database file is created at `backend/db.sqlite` and is excluded from version control via `.gitignore`
- All project `thumbnailUrl` fields are `null` by default — the cubes render as wireframe-only until you populate image URLs
- The `/news` page intentionally starts with an empty list — add entries directly to the component array or connect a new NestJS endpoint when ready
- The `Career` page includes 2 placeholder job listings — edit them in `career.component.ts`
