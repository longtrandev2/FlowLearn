# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowLearn is a SaaS education platform with AI integration. This repository contains the **frontend only** - a React 18 application built with TypeScript, Vite, and Tailwind CSS.

**Tech Stack:**
- React 18, TypeScript
- Vite (using rolldown-vite for faster builds)
- Tailwind CSS 4.x with Shadcn UI components
- React Router v7 for routing
- Zustand for client state management
- MSW (Mock Service Worker) for API mocking in development
- JWT-based authentication with refresh tokens

## Common Commands

```bash
cd frontend

# Development
npm run dev          # Start dev server (Vite)

# Building
npm run build        # TypeScript check + build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
```

## Project Architecture

### Directory Structure

```
frontend/src/
├── app/                    # Application-level configuration
│   └── router.tsx          # React Router configuration
├── components/             # Shared components by domain
│   ├── ui/                # Shadcn UI base components (Button, Card, Dialog, etc.)
│   ├── admin/             # Admin-specific shared components
│   └── settings/          # Settings page components
├── features/              # Feature-based modules
│   ├── admin/            # Admin dashboard & user management
│   ├── auth/             # Authentication (login, register)
│   ├── chat/             # AI chat with documents
│   ├── library/          # Document library & folders
│   ├── overview/         # Dashboard overview
│   └── study-session/    # Study sessions with flashcards/quizzes
├── layouts/               # Layout components
│   ├── AuthLayout.tsx    # Login/register page layout
│   ├── MainLayout.tsx    # Main app layout (Header + Sidebar)
│   ├── ProtectedRoute.tsx # Auth guard component
│   └── Sidebar.tsx       # Navigation sidebar
├── pages/                 # Page-level components (route targets)
│   ├── admin/            # Admin pages
│   ├── LandingPage.tsx   # Public landing page
│   ├── LoginPage.tsx     # Login page
│   └── ...
├── store/                 # Zustand stores (client state)
│   ├── useAuthStore.ts         # Legacy auth store (demo)
│   └── useAuthStore.new.ts     # Current auth store with API integration
│   └── useAdminUsersStore.ts   # Admin users management
├── mocks/                 # MSW mock handlers and data
│   ├── handlers/         # API route handlers
│   ├── data/             # Mock data
│   └── browser.ts        # MSW browser setup
├── lib/                   # Utilities
│   └── utils.ts          # cn() helper for Tailwind class merging
└── main.tsx              # App entry point
```

### Feature Structure Pattern

Each feature module follows this structure:
```
features/[feature-name]/
├── components/      # Feature-specific components
├── data/           # Mock data for development
├── types/          # TypeScript interfaces for the feature
└── layouts/        # Feature-specific layouts (e.g., AdminLayout)
```

### Routing Architecture

The app uses React Router v7 with nested routes:

- **Public routes**: `/landing`, `/msw-test`
- **Auth routes**: `/login`, `/register` (wrapped in AuthLayout)
- **Protected user routes**: `/`, `/library`, `/study` (wrapped in ProtectedRoute + MainLayout)
- **Protected admin routes**: `/admin/*` (wrapped in ProtectedRoute + AdminLayout)
- **Settings**: `/settings` (wrapped in ProtectedRoute + MainLayout)

Route definitions in `src/app/router.tsx`.

### State Management

**Client State (Zustand):**
- Authentication state: `store/useAuthStore.new.ts` (current) or `store/useAuthStore.ts` (legacy)
- Feature-specific stores: e.g., `store/useAdminUsersStore.ts`

**Note:** The existing `frontend/CLAUDE.md` mentions TanStack Query, but the current codebase uses Zustand directly with fetch() for API calls. The API Base URL is `https://api.flowlearn.io/api/v1`.

### Authentication

JWT-based authentication with:
- Access tokens (short-lived)
- Refresh tokens (for token renewal)
- Role-based access: `USER`, `MODERATOR`, `SUPER_ADMIN`
- Tokens stored in localStorage (see `useAuthStore.new.ts`)

Helper functions:
- `getAuthHeader()` - Returns `{ Authorization: 'Bearer <token>' }`
- `isAdmin()` - Checks if user has admin role
- `isSuperAdmin()` - Checks if user is super admin

### API Integration Pattern

API calls use native fetch() with this response structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
```

Example from `useAdminUsersStore.ts`:
```typescript
const response = await fetch(`${API_BASE_URL}/admin/users`, {
  headers: getAuthHeader(),
});
const result = await response.json();
if (!result.success) {
  throw new Error(result.error?.message || 'Failed to fetch users');
}
```

### Development with MSW

MSW (Mock Service Worker) is used for API mocking:
- Mock handlers: `src/mocks/handlers/`
- Mock data: `src/mocks/data/`
- Auto-starts in development mode (see `main.tsx`)
- Test at `/msw-test` route

### Styling Guidelines

1. **Tailwind CSS only** - No CSS/SCSS files
2. **Shadcn UI components** - Reuse existing components from `src/components/ui/`
3. **Class merging** - Use `cn()` utility from `src/lib/utils.ts`:
   ```typescript
   import { cn } from '@/lib/utils'
   <div className={cn('base-classes', conditional && 'extra-classes')} />
   ```
4. **Dark mode** - Use `next-themes` (already installed)

### Path Aliases

Configured in both `vite.config.ts` and `tsconfig.json`:
- `@/*` maps to `./src/*`

Use this for all imports:
```typescript
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore.new'
```

## Key Development Rules

1. **TypeScript strict mode** - No `any` types, define interfaces in feature `types/` folders
2. **Component naming** - PascalCase for components, camelCase for utilities/hooks
3. **Data fetching** - Use Zustand stores with fetch(), not TanStack Query (despite old docs)
4. **API integration** - Follow the `ApiResponse<T>` pattern, use `getAuthHeader()` for auth
5. **Error handling** - Handle loading, error, and empty states in UI components
6. **Mock first** - Add MSW handlers in `src/mocks/handlers/` before integrating real APIs

## Code Quality

- ESLint configured with TypeScript support
- React Hooks and React Refresh plugins enabled
- Run `npm run lint` before committing changes
- Use Conventional Commits format: `feat(scope): description`
