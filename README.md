# Game Inventory Frontend

A React + TypeScript web app for searching, tracking and managing your personal game library. Search for games, save them to your list, rate them, and track whether you're playing, finished or dropped them, all behind a login.

This guide walks you through running it on your own computer, on **macOS** or **Windows**.

> **The frontend needs the backend.** Searching, signing up and logging in all go through the [Game Inventory backend](https://github.com/Tsaleem123/game-inventory-backend). Set that up first by following its README. Once the backend is running at `http://localhost:5202`, come back here. Setting up the frontend takes about 5 minutes.

---

## Contents

1. [Install Node.js](#1-install-nodejs)
2. [Clone the repository](#2-clone-the-repository)
3. [Install dependencies](#3-install-dependencies)
4. [Create your `.env` file](#4-create-your-env-file)
5. [Start the app](#5-start-the-app)
6. [Troubleshooting](#6-troubleshooting)
7. [Reference](#7-reference)

---

## 1. Install Node.js

You need **Node.js 20 or newer** (the current LTS version is recommended). npm comes with it.

### macOS

Either download the **LTS** installer from [nodejs.org](https://nodejs.org/), or with [Homebrew](https://brew.sh):
```bash
brew install node
```

### Windows

Either download the **LTS** Windows installer (`.msi`) from [nodejs.org](https://nodejs.org/) and use the defaults, or run this in **PowerShell**:
```powershell
winget install OpenJS.NodeJS.LTS
```
**Close and reopen PowerShell** afterwards so the `node` and `npm` commands are picked up.

### Check it worked (both)

```bash
node --version   # v20.x or higher
npm --version
```

You'll also need **Git**: it's included with macOS (`git --version`), and on Windows you can get it from [git-scm.com](https://git-scm.com/download/win) or with `winget install Git.Git`. You can also use **GitHub Desktop** to clone.

---

## 2. Clone the repository

**macOS (Terminal) / Windows (PowerShell):**
```bash
git clone https://github.com/Tsaleem123/game-inventory-frontend.git
cd game-inventory-frontend
```

With **GitHub Desktop**: *File → Clone Repository*, then *Repository → Open in Terminal* (macOS) or *Open in Command Prompt* (Windows).

---

## 3. Install dependencies

From the `game-inventory-frontend` folder:

```bash
npm install
```

This downloads everything into a `node_modules` folder. It can take a minute or two the first time. Warnings are normal. Only lines that start with `npm ERR!` mean something went wrong.

---

## 4. Create your `.env` file

The app needs to know where the backend is. Copy the template:

**macOS:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

The file should contain:

```env
VITE_ENDPOINT=http://localhost:5202/
```

- Keep the **trailing slash**. The app builds URLs like `${VITE_ENDPOINT}api/auth/login`, so without the slash requests go to the wrong address.
- If you changed the backend's port (`ASPNETCORE_URLS` in its `.env`), use that port here.
- `.env` is in `.gitignore` and won't be committed.

---

## 5. Start the app

Make sure the backend is running in another window, then:

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)**. Press **Ctrl + C** in the terminal to stop it.

**First time?**
1. Click **Sign up** and create an account.
2. Open the confirmation email the backend sends and click the link.
3. Log in. You'll land on the game search page.

> Run the app on port **5173** (the default). The backend only accepts requests from the addresses in its `CORS_ORIGINS` setting, and its password-reset emails link back to `http://localhost:5173`.

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| **Windows:** `npm : File ... npm.ps1 cannot be loaded because running scripts is disabled on this system` | Run this once in PowerShell, then try again: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. Or use **Command Prompt** instead of PowerShell. |
| `'npm' is not recognized` / `command not found: npm` | Node.js isn't installed, or the terminal was open while you installed it. Close and reopen the terminal. |
| Login/search does nothing; browser console shows `ERR_CONNECTION_REFUSED` or `Network Error` | The backend isn't running, or `VITE_ENDPOINT` points to the wrong port. Check the backend terminal says `Now listening on: http://localhost:5202`. |
| Browser console shows a **CORS** error | Add `http://localhost:5173` to `CORS_ORIGINS` in the **backend's** `.env` and restart the backend. |
| Requests go to `.../undefined/api/...` or `...5202api/...` | `.env` is missing, misnamed, or missing the trailing slash. On Windows, check it isn't saved as `.env.txt` (turn on *View → File name extensions* in Explorer). **Restart `npm run dev`** after changing `.env`, because Vite only reads it at startup. |
| `Port 5173 is in use, trying another one...` | Another copy is already running. Close it so the app runs on 5173 (see the note in step 5). |
| Signup works but the confirmation email never arrives | That's a backend email setting. See the backend README's troubleshooting section. |
| Errors after pulling new changes | Run `npm install` again. If it's still broken, delete the `node_modules` folder and run `npm install` once more. |

---

## 7. Reference

### Tech stack

| Tool | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Dev server & build tool |
| [MUI (Material UI)](https://mui.com/) | Component library |
| [TanStack Router](https://tanstack.com/router) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client for API calls |
| [jwt-decode](https://github.com/auth0/jwt-decode) | JWT token parsing |

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server at http://localhost:5173 |
| `npm run build` | Type-check and build for production (output to `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Project structure

```
game-inventory-frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API layer (Axios calls)
│   │   ├── auth.ts          # Login, register, forgot/reset password
│   │   ├── searchGames.ts   # Game search endpoint
│   │   ├── searchGameById.tsx
│   │   └── userGames.ts     # Save/fetch/update the user's game list
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
│   ├── router.tsx           # Route definitions
│   ├── App.tsx              # Main app shell (game search page)
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── .env.example             # Template for your .env
├── vite.config.ts
├── tsconfig.json
├── vercel.json              # Vercel deployment config
└── package.json
```

### Routes

| Path | Description | Login required |
|---|---|---|
| `/` | Login page (redirects to `/app` if already logged in) | No |
| `/signup` | Create a new account | No |
| `/forgot-password` | Request a password reset email | No |
| `/reset-password` | Reset password via the emailed link | No |
| `/app` | Main game search page | No |
| `/my-games` | Your saved game list | Yes |

### Authentication

Login uses JWTs. After you log in, the token is stored in the browser's `localStorage` under the key `token`. Protected routes such as `/my-games` check for it and send you to the login page if it's missing. Logging out clears it.
