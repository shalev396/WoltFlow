# WoltFlow Frontend

A React + TypeScript application for automating Wolt gift card purchases and managing user workflows.

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn

### Installation

```bash
# Install dependencies
tnpm install # or npm install
yarn install
```

### Available Scripts

- `npm run dev` / `yarn dev`: Start development server (Vite)
- `npm run build` / `yarn build`: Build for production
- `npm run preview` / `yarn preview`: Preview production build
- `npm run lint` / `yarn lint`: Run ESLint

## Project Structure

```
Client/
├─ public/         # Static assets
├─ src/
│  ├─ api/         # Axios instance & interceptors
│  ├─ components/  # UI components (shadcn/ui)
│  ├─ pages/       # Route views (Landing, Dashboard, Runs, Settings)
│  ├─ services/    # API service functions (auth, runs, settings)
│  ├─ queries/     # React Query hooks wrapping services
│  ├─ store/       # Redux Toolkit store and slices
│  ├─ hooks/       # Custom React hooks
│  ├─ lib/         # Utilities (queryClient, clsx/twMerge)
│  ├─ utils/       # Helpers (authInterceptor)
│  ├─ docs/        # Frontend docs (e.g., auth.md)
│  └─ main.tsx     # App entry point
└─ README.md       # This file
```

## Core Concepts

### TypeScript & React

- Functional components with hooks
- Strict typing for props, state, and API responses

### State Management (Redux Toolkit)

- `userSlice.ts` manages authentication state
- Async thunks (`checkAuth`, `logoutUser`) validate and clear sessions

### Data Fetching & Caching (React Query)

- `api.ts` configures Axios with baseURL and interceptors
- Service layer (e.g., `runsService`) defines API calls
- Hooks (`useRunsQuery`, `useSettingsQuery`) handle retries, staleTime, caching

### API Communication (Axios)

- Centralized `api` instance with JSON headers and credentials
- Error interceptor logs out on 401 for protected routes

### Routing (react-router-dom)

- `App.tsx` defines public and protected routes
- `ProtectedRoute.tsx` shows `LoadingScreen` during auth checks

### UI Components (shadcn/ui + Tailwind)

- Consistent design using Radix-based components
- Theme support via `theme-provider.tsx`
- Responsive behavior with `use-mobile.ts`

### Authentication (Google OAuth)

- `LoginButton.tsx` redirects to OAuth2 start
- `LogoutButton.tsx` dispatches logout and navigates

## Continuous Integration / Deployment

- We use our production CI/CD pipeline defined in `.github/workflows/Prod-CICD-Frontend.yml`. This workflow runs on pushes to `main` and automatically:

1. Checks out the code
2. Sets up Node.js environment
3. Loads and exports environment variables from `.env` in `Client/`
4. Installs dependencies with `npm ci`
5. Builds the application (`npm run build`)
6. Deploys build artifacts to AWS S3 and invalidates the CloudFront distribution

## Environment Variables

- `VITE_ENV=Development` toggles base API URL

## Linting & Formatting

- ESLint (`eslint.config.js`) with TypeScript rules
- Pre-commit hooks for code quality (optional)

## Contributing

1. Fork the repo
2. Create a feature branch
3. Run `npm install` & `npm run dev`
4. Commit changes with clear messages
5. Open a pull request for review
