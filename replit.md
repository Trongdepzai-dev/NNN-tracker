# NNN Tracker - No Nut November Progress Tracker

## Overview
A React-based web application for tracking progress during No Nut November. This is a motivational tracker app with features including:
- Daily progress tracking
- Achievement system
- Journaling functionality
- Multiple themes (including a hidden Matrix theme via Konami code)
- Countdown timers
- Progress visualization
- Multi-language support (English & Vietnamese)

## Project Structure
- **Frontend**: React 18.3.1 + TypeScript + Vite (Port 5000)
- **Backend**: Express.js + SQLite (Port 3000)
- **Styling**: TailwindCSS (CDN) with custom CSS
- **UI Libraries**: Framer Motion, Lucide React, Recharts, Sonner
- **Background Effects**: Vanta.js with Three.js
- **i18n**: react-i18next with browser language detection
- **Database**: SQLite (better-sqlite3) for user progress and leaderboard

## Current State
- Successfully configured for Replit environment
- Frontend running on port 5000
- Backend API running on port 3000 (localhost)
- Database schema initialized with users, progress, and sharing tables
- All dependencies installed
- Both Frontend and Backend workflows configured and running
- Real-time leaderboard and sharing features implemented

## Recent Changes (October 23, 2025)
### Initial Setup
- Migrated from GitHub import to Replit
- Updated Vite configuration for port 5000
- Added HMR configuration for Replit proxy environment
- Created .gitignore for Node.js project
- Created minimal index.css file
- Set up Frontend workflow

### Backend Integration
- Created Express.js backend with RESTful API
- Implemented SQLite database with three tables:
  * users: Store user accounts
  * user_progress: Track daily progress and journal entries
  * shared_progress: Store shareable progress links
- Created API endpoints:
  * POST /api/users/register - User registration
  * POST /api/users/progress - Save daily progress
  * GET /api/users/:userId/progress - Fetch user progress
  * GET /api/leaderboard - Get real-time leaderboard
  * POST /api/share - Create shareable link
  * GET /api/share/:shareId - Fetch shared progress
- Integrated frontend with backend:
  * Updated Dashboard to fetch real leaderboard data
  * Added ShareSection with link generation
  * App.tsx syncs progress to backend automatically
  * User registration on first login

## Configuration
### Development
- **Port**: 5000
- **Host**: 0.0.0.0 (allows Replit proxy access)
- **HMR**: Configured for wss on port 443

### Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## User Preferences
Not yet configured - waiting for user input.

## Technical Notes
- Uses import maps in HTML for ESM dependencies
- LocalStorage for data persistence
- Vanta.js creates animated network background
- Secret "Matrix" theme unlockable via Konami code (↑↑↓↓←→←→BA)
- Developer mode for user "B.Trọng"
