# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate
```

### Linting
```bash
# Run ESLint (configured via @nuxt/eslint module)
pnpm nuxi lint
```

## Architecture

This is a Nuxt 4 application with the following structure:

### Core Technologies
- **Nuxt 4.1.1** - Full-stack Vue framework
- **Vue 3.5** - Frontend framework
- **Tailwind CSS v4** - Utility-first CSS framework via @tailwindcss/vite
- **Nuxt UI 3** - Component library
- **nuxt-auth-utils** - Authentication utilities
- **Zod** - Schema validation

### Project Structure
- `app/` - Main application directory (Nuxt 4 convention)
  - `pages/` - File-based routing with authentication flow (login, register, protected)
  - `components/` - Vue components (LoginForm, RegisterForm)
  - `middleware/` - Route middleware (auth.ts for protected routes)
  - `assets/css/` - Global styles with Tailwind imports
- `nuxt.config.ts` - Main configuration with module registrations

### Key Modules
- **@nuxt/ui** - Pre-built UI components
- **@nuxt/content** - Content management
- **@nuxt/image** - Image optimization
- **nuxt-auth-utils** - Session management via `useUserSession()`

### Authentication Pattern
Protected routes use the `auth` middleware which checks `useUserSession().loggedIn` and redirects to `/login` if not authenticated.