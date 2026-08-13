# 🎥 Zoom Workplace Clone

A full-stack clone of the **Zoom Workplace** desktop application built as an SDE assignment for Scaler. Features a pixel-perfect UI with real-time video/audio, screen sharing, meeting scheduling, and an AI companion panel.

---

## 📸 Features

| Feature | Description |
|---|---|
| **Home Page** | Clock, date, quick actions (New Meeting, Join, Schedule) |
| **Video Meeting Room** | Live webcam, mic toggle, screen sharing, name tags |
| **Schedule Meeting** | Full Zoom-style form with date picker, 15-min time increments, passcode, encryption options |
| **Join Meeting** | Modal + dedicated page with meeting code validation (backend + regex fallback) |
| **Date Navigation** | Today/prev/next day buttons with client-side meeting filtering |
| **Copy Invite Link** | One-click clipboard copy of meeting URL |
| **Upcoming Meetings** | Fetched from SQLite via FastAPI, shown on home page with Join button |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | FastAPI, SQLAlchemy, Pydantic |
| **Database** | SQLite (`zoom_clone.db`) |
| **Icons** | Custom SVG components extracted from Zoom's real UI |

---

## 📁 Folder Structure

```
scalerfinal/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Home page (clock, actions, meetings)
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── globals.css      # Global styles + animations
│   │   │   ├── schedule/        # Schedule meeting form
│   │   │   ├── join/            # Join meeting page
│   │   │   ├── meeting/[id]/    # Video meeting room
│   │   │   ├── meetings/        # Meetings list page
│   │   │   ├── chat/            # Chat tab page
│   │   │   └── more/            # More tab page
│   │   ├── components/
│   │   │   ├── MeetingCard.tsx   # Meetings card with date nav & filters
│   │   │   ├── JoinModal.tsx     # Join meeting modal
│   │   │   ├── NewMeetingModal.tsx
│   │   │   ├── ScheduleModal.tsx
│   │   │   ├── Sidebar.tsx       # Left navigation sidebar
│   │   │   ├── Topbar.tsx        # Top bar with search
│   │   │   ├── ZoomIcons.tsx     # Meeting room SVG icons
│   │   │   └── ZoomNavIcons.tsx  # Navigation SVG icons
│   │   └── lib/
│   │       └── api.ts           # API client (fetch wrappers)
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # FastAPI server
│   ├── src/
│   │   ├── main.py              # App entrypoint + CORS + health check
│   │   ├── database.py          # SQLite engine + session
│   │   ├── models/
│   │   │   └── meeting.py       # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── meeting.py       # Pydantic request/response schemas
│   │   └── routers/
│   │       └── meetings.py      # API routes
│   ├── requirements.txt
│   └── zoom_clone.db            # SQLite database file
│
└── README.md                    # ← You are here
```

---

## 🗄️ Database Schema (SQLite)

### `meetings` table
| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR (PK) | UUID |
| `meeting_code` | VARCHAR (UNIQUE) | Format: `123-4567-8910` |
| `invite_link` | VARCHAR | `http://localhost:3000/meeting/{code}` |
| `topic` | VARCHAR | Meeting title |
| `description` | TEXT | Optional description |
| `date` | VARCHAR | Meeting date |
| `time` | VARCHAR | Meeting time |
| `duration` | VARCHAR | e.g. `0 hr 30 min` |
| `timezone` | VARCHAR | e.g. `(GMT+5:30) India` |
| `passcode` | VARCHAR | Auto-generated passcode |
| `status` | VARCHAR | `upcoming` / `ongoing` / `ended` |
| `created_at` | DATETIME | Auto-set on creation |
| `scheduled_at` | DATETIME | Scheduled start time |

### `recent_meetings` table
| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR (PK) | UUID |
| `meeting_code` | VARCHAR | Meeting code reference |
| `topic` | VARCHAR | Meeting title |
| `joined_at` | DATETIME | When user joined |

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/meetings/instant` | Create instant meeting |
| `POST` | `/api/meetings/schedule` | Schedule a meeting |
| `GET` | `/api/meetings/upcoming` | List upcoming meetings |
| `GET` | `/api/meetings/recent` | List recent meetings |
| `GET` | `/api/meetings/validate/{code}` | Validate meeting code |
| `GET` | `/health` | Health check + DB status |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.9
- **pip** (Python package manager)

### 1. Backend Setup

```bash
cd "scalerfinal/backend"
pip install -r requirements.txt
python3 -m uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

Verify: `http://127.0.0.1:8000/health` should return:
```json
{"db": "SQLite connected", "tables": ["meetings", "recent_meetings"]}
```

### 2. Frontend Setup

```bash
cd "scalerfinal/frontend"
npm install
npm run dev
```

Open: `http://localhost:3000`

---

## 🎮 Usage Flow

1. **Home Page** → See clock, upcoming meetings, quick action buttons
2. **New Meeting** → Creates instant meeting → enters video room
3. **Schedule** → Fill form → saves to SQLite → appears on home page
4. **Join** → Enter meeting code (e.g. `933-3155-2203`) + name → enters room
5. **Meeting Room** → Toggle mic/cam, share screen, chat, react, use AI companion
6. **End Meeting** → Leave or end for all → returns to home

---

## 👤 Author

**Naskanti Rahul**  
Scaler SDE Assignment

---

## 📝 License

This project is for educational/assignment purposes only. Zoom is a trademark of Zoom Video Communications, Inc.
