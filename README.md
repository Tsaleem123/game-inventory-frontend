# Game Inventory Frontend

A React + TypeScript web application for searching, tracking, and managing your personal game library. Users can search for games, save them to a personal list, rate them, and track their play status — all behind a JWT-authenticated account system.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Dev server & build tool |
| [MUI (Material UI)](https://mui.com/) | Component library |
| [TanStack Router](https://tanstack.com/router) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client for API calls |
| [jwt-decode](https://github.com/auth0/jwt-decode) | JWT token parsing |

---

## Project Structure

```
game-inventory-frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API layer (Axios calls)
│   │   ├── auth.ts          # Login, register, forgot/reset password
│   │   ├── searchGames.ts   # Game search endpoint
│   │   ├── searchGameById.tsx
│   │   └── userGames.ts     # Save/fetch/update user's game list
│   ├── assets/              # SVG icons and images
│   ├── components/          # UI components
│   │   ├── LoginForm.tsx
│   │   ├── Signup.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── GameSearch.tsx   # Main search interface
│   │   ├── GameListItem.tsx
│   │   ├── UserGameList.tsx # User's saved game list
│   │   ├── SearchBar.tsx
│   │   ├── Pager.tsx
│   │   ├── RatingDropdown.tsx
│   │   └── StatusDropdown.tsx
│   ├── types/
│   │   └── Game.ts          # Shared TypeScript interfaces
│   ├── router.tsx           # TanStack Router route definitions
│   ├── App.tsx              # Main app shell (game search page)
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (see below)
├── vite.config.ts
├── tsconfig.json
├── vercel.json              # Vercel deployment config
└── package.json
```

---

## Routes

| Path | Description | Auth Required |
|---|---|---|
| `/` | Login page (redirects to `/app` if already logged in) | No |
| `/signup` | Create a new account | No |
| `/forgot-password` | Request a password reset email | No |
| `/reset-password` | Reset password via emailed token | No |
| `/app` | Main game search page | No |
| `/my-games` | User's saved game list | Yes |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- The backend API service must be running locally before starting the frontend. See the [backend repository](<backend-repo-link>) for setup instructions. By default, the frontend expects the backend at `http://localhost:5202/`.

### 1. Clone the repository

```bash
git clone <repo-url>
cd game-inventory-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (copy from the example below):

```env
VITE_ENDPOINT=http://localhost:5202/
```

`VITE_ENDPOINT` should point to the base URL of your backend API, including a trailing slash. All API requests are prefixed with this value (e.g., `${VITE_ENDPOINT}api/auth/login`).

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production (output to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Authentication

Authentication uses JWTs. On login, the token is stored in `localStorage` under the key `token`. Protected routes (e.g., `/my-games`) check for this token and redirect unauthenticated users to the login page. Logging out clears the token from storage.
