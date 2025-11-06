# VidFlow - TikTok-Style Video Sharing App

## Overview

VidFlow is a mobile-first, immersive video sharing platform inspired by TikTok, Instagram Reels, and YouTube Shorts. The application provides a full-screen, gesture-driven video feed experience with vertical scrolling, social interactions (likes, comments, shares), and user profiles. Built with React, Express, and PostgreSQL, it emphasizes a smooth, app-like experience with minimal UI chrome and floating overlay controls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server for fast hot-module replacement
- React Query (@tanstack/react-query) for server state management and caching

**UI Component System:**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Mobile-first responsive design with portrait orientation as primary viewport

**Routing & State:**
- Client-side tab-based navigation (Home, Discover, Create, Inbox, Profile)
- In-app state management for active tabs and profile viewing
- No traditional routing library - single-page app with conditional rendering

**Design System:**
- Custom color system with HSL values for theme consistency (light/dark mode support)
- Spacing primitives using Tailwind units (2, 3, 4, 6, 8)
- Typography: Inter for body text, Poppins for accent/bold elements
- Gesture-based interactions: vertical swipe scrolling, tap for video controls, double-tap for likes

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API endpoints
- Vite middleware integration for development with HMR
- Session-based approach (connect-pg-simple for session storage)

**API Design:**
- RESTful endpoints under `/api` prefix
- Resource-based routes: videos, comments, user profiles, follows
- JSON request/response format
- Error handling with appropriate HTTP status codes

**Data Storage:**
- In-memory storage implementation (MemStorage class) for development
- Interface-based storage abstraction (IStorage) for easy database swapping
- Planned PostgreSQL integration via Drizzle ORM

**Key API Endpoints:**
- `GET /api/videos` - Fetch video feed
- `GET /api/videos/:videoId/comments` - Get comments for a video
- `POST /api/videos/:videoId/comments` - Add a comment
- `POST /api/comments/:commentId/like` - Like a comment
- `POST /api/users/:userId/follow` - Follow a user
- `GET /api/users/:userId/profile` - Get user profile

### Database Design (Drizzle ORM Schema)

**Tables:**

1. **users** - User authentication and basic info
   - id (UUID, primary key)
   - username (unique)
   - password (hashed)

2. **videos** - Video content and metadata
   - id (UUID, primary key)
   - userId, username, avatarUrl
   - videoUrl, description, soundName
   - Interaction counts: likes, comments, shares
   - isLiked boolean flag

3. **comments** - User comments on videos
   - id (UUID, primary key)
   - videoId (foreign reference)
   - userId, username, avatarUrl
   - text content
   - likes count, createdAt timestamp

4. **follows** - User following relationships
   - id (UUID, primary key)
   - followerId, followingId
   - createdAt timestamp

5. **userProfiles** - Extended user profile information
   - userId (primary key)
   - username, avatarUrl, bio
   - followersCount, followingCount

**Database Configuration:**
- PostgreSQL dialect specified in drizzle.config.ts
- Neon Database serverless driver (@neondatabase/serverless)
- Migration files generated in `/migrations` directory
- Schema validation with drizzle-zod integration

### Key Architectural Decisions

**Why In-Memory Storage?**
- Problem: Need rapid prototyping without database setup
- Solution: MemStorage class implementing IStorage interface
- Pros: Fast development, easy testing, no external dependencies
- Cons: Data doesn't persist, not production-ready
- Future: Replace with Drizzle ORM database implementation (interface already defined)

**Why Mobile-First Design?**
- Problem: Primary use case is vertical mobile video consumption
- Solution: Portrait orientation (9:16 aspect ratio), snap scrolling, touch gestures
- Pros: Optimal mobile UX, mimics TikTok/Reels familiar patterns
- Cons: Desktop experience is centered with max-width constraints

**Why React Query?**
- Problem: Complex server state synchronization, cache invalidation
- Solution: @tanstack/react-query for declarative data fetching
- Pros: Automatic caching, background refetching, optimistic updates
- Cons: Additional learning curve for team members

**Why Shadcn/UI + Radix?**
- Problem: Need accessible, customizable components without heavy library
- Solution: Copy-paste shadcn components built on Radix primitives
- Pros: Full control over code, accessible by default, Tailwind integration
- Cons: More initial setup than pre-packaged library

**Why Vite Over CRA/Next.js?**
- Problem: Fast dev experience needed for SPA with no SSR requirements
- Solution: Vite for lightning-fast HMR and optimized builds
- Pros: Extremely fast dev server, modern ES modules, simple config
- Cons: Less out-of-box features than Next.js (but not needed here)

## External Dependencies

### Core Dependencies

**Frontend Libraries:**
- `@tanstack/react-query` (^5.60.5) - Server state management
- `react` & `react-dom` - UI framework
- `@radix-ui/*` packages - Headless UI primitives (dialogs, dropdowns, avatars, etc.)
- `embla-carousel-react` (^8.6.0) - Carousel component
- `lucide-react` - Icon library
- `date-fns` (^3.6.0) - Date formatting utilities

**Styling:**
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` (^0.7.1) - Component variant management
- `clsx` & `tailwind-merge` - Conditional class merging

**Backend:**
- `express` - Web server framework
- `drizzle-orm` (^0.39.1) - TypeScript ORM
- `drizzle-zod` (^0.7.0) - Schema validation
- `@neondatabase/serverless` (^0.10.4) - PostgreSQL driver
- `connect-pg-simple` (^10.0.0) - PostgreSQL session store

**Form Handling:**
- `react-hook-form` - Form state management
- `@hookform/resolvers` (^3.10.0) - Form validation
- `zod` - Schema validation library

**Build Tools:**
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React support for Vite
- `typescript` - Type checking
- `esbuild` - Fast JavaScript bundler (for server builds)

### Development Tools

- `tsx` - TypeScript execution for dev server
- `drizzle-kit` - Database migration tool
- `@replit/vite-plugin-runtime-error-modal` - Dev error overlay
- `@replit/vite-plugin-cartographer` - Replit integration
- `@replit/vite-plugin-dev-banner` - Dev environment banner

### Asset Management

- Static assets stored in `/attached_assets/generated_images/`
- Avatar images for mock user profiles
- Video URLs reference external sources (Google Cloud Storage sample videos)

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required for Drizzle)
- `NODE_ENV` - Environment mode (development/production)
- `REPL_ID` - Replit environment identifier (optional, for Replit-specific features)

### External Services

**Video Hosting:**
- Currently using Google Cloud Storage public samples for demo videos
- Production would require video CDN integration (e.g., Cloudflare Stream, AWS S3 + CloudFront, or Mux)

**Future Integrations:**
- Authentication service (Auth0, Clerk, or custom JWT)
- Video processing service (FFmpeg, AWS Elastic Transcoder)
- Push notifications for engagement
- Analytics service (PostHog, Mixpanel)