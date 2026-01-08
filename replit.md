# Dankook University Graduate School - Data and Knowledge Service Engineering Department Website

## Overview

This is a full-stack web application for the Dankook University Graduate School's Department of Data and Knowledge Service Engineering. The website serves as an academic portal featuring department information, announcements, research papers, department regulations, and a talent pool registration system. The application supports user authentication, content management with CRUD operations, file attachments, and a commenting system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and UI interactions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based architecture with shared components:
- Pages located in `client/src/pages/` (Home, About, Notices, Papers, Regulations, TalentPool, Privacy)
- Reusable UI components in `client/src/components/ui/` (shadcn/ui library)
- Layout components (Header, Footer, LoginModal) in `client/src/components/`

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

The server follows a layered architecture:
- `server/index.ts`: Express app setup, middleware, and server initialization
- `server/routes.ts`: API route handlers for all endpoints
- `server/storage.ts`: Data access layer implementing the IStorage interface
- `server/db.ts`: Database connection pool and Drizzle client configuration

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **ORM**: Drizzle ORM with schema defined in `shared/schema.ts`
- **Schema includes**:
  - `users`: User accounts with authentication credentials
  - `notices`: Announcements with file attachments and importance flags
  - `notice_comments`: Comments on notices
  - `papers`: Research papers categorized by type (conferences, journals)
  - `paper_comments`: Comments on papers
  - `talents`: Talent pool registration entries

### Authentication
- Simple username/password authentication (passwords stored as plaintext - should be enhanced for production)
- No session management currently implemented (stateless API)
- Login modal component handles both login and signup flows

### Build System
- Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client
- Drizzle Kit for database migrations (`db:push` command)
- Development uses Vite dev server with HMR
- Production serves static files from `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **pg**: PostgreSQL client for Node.js

### UI Component Libraries
- **shadcn/ui**: Comprehensive UI component collection built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library

### Core Dependencies
- **Express.js**: HTTP server framework
- **TanStack React Query**: Async state management and caching
- **Framer Motion**: Animation library
- **Zod**: Runtime type validation (used with drizzle-zod for schema validation)
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type checking across the entire codebase
- **Tailwind CSS v4**: Utility-first CSS framework
- **Drizzle Kit**: Database migration tooling

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Development tooling (dev only)
- `@replit/vite-plugin-dev-banner`: Development banner (dev only)
- Custom `vite-plugin-meta-images`: OpenGraph image URL configuration for Replit deployments