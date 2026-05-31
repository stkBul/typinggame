# TasteTrup ⌨️

Learn touch typing (the 10-finger system) in an easy and fun way — for both
kids and adults. Built for the **Danish QWERTY** keyboard (incl. `æ ø å`).

Progress is saved locally in your browser (no account needed in v1).

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (build/dev server)
- **Tailwind CSS v4**
- **React Router** (client-side routing)
- **Vitest** + **Testing Library** (unit/component tests)
- **ESLint** + **Prettier**

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
```

## Scripts

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start the Vite dev server                      |
| `npm run build`    | Type-check and build for production (`dist/`)  |
| `npm run preview`  | Preview the production build locally           |
| `npm run lint`     | Run ESLint                                      |
| `npm run format`   | Format the codebase with Prettier              |
| `npm test`         | Run the test suite once                         |
| `npm run test:watch` | Run tests in watch mode                       |

## Deployment

Pushing to `main` triggers the
[GitHub Pages workflow](.github/workflows/deploy.yml), which lints, tests,
builds, and deploys to GitHub Pages.

The app is served from the `/typinggame/` subpath. To preview a build under a
different base path, set `VITE_BASE` (e.g. `VITE_BASE=/ npm run build`).

> **One-time setup:** In the repo's **Settings → Pages**, set the source to
> **GitHub Actions**.

## Project structure

```
src/
├── main.tsx          # App entry; sets up Router with the Pages basename
├── App.tsx           # Route definitions
├── index.css         # Tailwind entry
├── components/
│   └── Layout.tsx    # Shared header/nav/footer shell
├── routes/           # Page-level route components
└── test/setup.ts     # Test environment setup
```

## Roadmap

1. ✅ **Scaffold + CI** — project setup, routing shell, GitHub Pages deploy
2. ✅ **Keyboard + engine** — Danish QWERTY on-screen keyboard, 10-finger map,
   keystroke scoring (WPM / accuracy / errors)
3. ✅ **Lessons** — curriculum data model + home-row-outward Danish lessons
   with multi-drill runner and pass/fail gating
4. ✅ **Progress + persistence** — `localStorage` store, progress dashboard,
   level unlocking
5. ✅ **Fun layer** — kid/adult themes, light/dark mode, badges, daily
   streaks, typing sounds, and a Danish-keyboard-layout warning
