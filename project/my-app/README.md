# BubbleBlog Frontend

This frontend has been refactored from a Vite React app into a Next.js App Router project.

## What Changed

- Next.js App Router now handles the feed, auth, profile, create-post, and blog detail routes.
- The UI shell was redesigned with a stronger editorial look and clearer responsive layout.
- Client-side auth and lightweight UI state are managed through Zustand stores.
- The frontend now reads `NEXT_PUBLIC_API_URL` instead of the old Vite env key.
- Use different ports for frontend and backend. A safe local default is Next.js on `3000` and Express on `3001`.

## Run It

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Make sure the backend is running at the URL in `.env`

## Notes

- The old `src/` Vite code is still in the repo as reference while the new Next.js structure settles.
- The backend route for blog detail was updated to populate the author so the new detail page can render correctly.
