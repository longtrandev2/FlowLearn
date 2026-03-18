# FlowLearn

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.3-6DB33F?logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

AI-powered education SaaS platform that automates knowledge synthesis. Upload documents, and the system uses AI to generate summaries, flashcards, and quizzes.

## About

FlowLearn is a modern SaaS education platform that leverages Generative AI to personalize learning pathways. The system goes beyond simple document storage, acting as an intelligent learning assistant that automates knowledge summarization, builds long-term memory through Spaced Repetition Systems (SRS), and provides real-time feedback.

## Features

### 🚨 Current State

- ✅ Frontend authentication UI (login, register, password reset)
- ✅ Admin dashboard with user management UI
- ✅ Document library UI (folders, file upload, organization)
- ✅ Study session interface
- ✅ AI chat widget (direct Gemini API integration)
- ✅ Responsive design with Shadcn UI components
- ✅ MSW (Mock Service Worker) for API development

### 📋 Planned Features

- Backend REST API implementation (50+ endpoints)
- Database with 14 tables for full platform functionality
- JWT authentication and authorization
- File upload and processing (PDF, DOCX, TXT, PPTX, XLSX)
- AI-generated content (summaries, flashcards, quizzes)
- Spaced Repetition System (SM-2 algorithm)
- Subscription management (Stripe)
- Email verification and notifications
- Real-time streaming with Server-Sent Events (SSE)

## Tech Stack

### Frontend

- **Framework:** React 19.2, TypeScript 5.9, Vite
- **Styling:** Tailwind CSS, Shadcn UI
- **State Management:** TanStack Query (Server state), Zustand (Client state)
- **API Mocking:** MSW (Mock Service Worker)
- **AI Integration:** Google Gemini API (direct calls from frontend)

### Backend (Planned)

- **Core:** Java 21, Spring Boot 4.0.3, Spring Security
- **Data Access:** Spring Data JPA, Hibernate ORM
- **Database:** MySQL 8.0
- **Cache:** Redis (planned for rate limiting and caching)
- **AI:** Google Gemini API
- **File Storage:** Cloudflare R2 (planned)
- **Payments:** Stripe (planned)

## Architecture

FlowLearn follows a **3-tier architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  React SPA (TypeScript) + Tailwind CSS + Shadcn UI      │
│  State: TanStack Query + Zustand                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   API Layer (Planned)                    │
│  Spring Boot REST APIs + JWT Auth                        │
│  50+ Endpoints across 9 modules                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  MySQL 8.0 (14 tables) + Redis (cache/rate limiting)     │
│  Cloudflare R2 (file storage) + Gemini API (AI)          │
└─────────────────────────────────────────────────────────┘
```

## Project Status

### Implementation Progress

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend UI | 🟡 Partial | Auth, admin, library UI implemented |
| Frontend API Integration | 🔴 Mock | Uses MSW, no real API calls |
| Backend API | 🔴 Not Started | Documentation complete, no code |
| Database | 🔴 Not Started | Schema designed, no migrations |
| Authentication | 🔴 Not Started | JWT designed, not implemented |
| AI Integration | 🟡 Partial | Direct Gemini API in frontend |
| File Processing | 🔴 Not Started | No backend implementation |
| Payments | 🔴 Not Started | Stripe not integrated |
| Infrastructure | 🔴 Not Started | No Docker, no CI/CD |

### Documentation Status

- ✅ [Database Schema](docs/database-schema.md) - Complete with 14 tables
- ✅ [API Specifications](docs/api-specs.md) - All 50+ REST endpoints documented
- ✅ [Backend Guidelines](backend/CLAUDE.md) - Spring Boot coding standards
- ✅ [Frontend Guidelines](frontend/CLAUDE.md) - React/TypeScript patterns

## Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **Java** 21 (for backend when implemented)
- **MySQL** 8.0+ (when backend is implemented)
- **Redis** (when backend is implemented)
- **Google Gemini API Key** (for chat feature)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/longtrandev2/flowlearn.git
cd flowlearn

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
# VITE_GEMINI_API_KEY=your_api_key_here

# Run development server
npm run dev
```

The frontend will run on http://localhost:5173 with MSW mocks for API calls.

### Backend Setup (Not Yet Implemented)

The backend is currently in the planning phase. When implemented:

```bash
# Navigate to backend
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or with Gradle (if using Gradle)
./gradlew bootRun
```

The backend will run on http://localhost:8080

**See [Backend CLAUDE.md](backend/CLAUDE.md) for implementation progress.**

## Development

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run linter
npm run lint

# Type check
npm run type-check

# Run tests
npm run test
```

### Backend Development

The backend is a Spring Boot 4.0.3 project with Java 21. Currently in planning phase.

**See [Backend CLAUDE.md](backend/CLAUDE.md) for:**
- Project structure
- Coding standards
- Implementation guidelines
- Database schema migration steps

### Running Tests

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests (when implemented)
cd backend
./mvnw test
```

## Documentation

- **[Database Schema](docs/database-schema.md)** - Complete ERD and table definitions with migration order
- **[API Specifications](docs/api-specs.md)** - All 50+ REST endpoints documented with implementation status
- **[Backend Development](backend/CLAUDE.md)** - Spring Boot coding standards and patterns
- **[Frontend Development](frontend/CLAUDE.md)** - React/TypeScript patterns and component guidelines

## Roadmap

### Phase 1: Backend Foundation (Not Started)

- [ ] Set up database with Flyway migrations
- [ ] Implement JPA entities (14 tables)
- [ ] Configure Spring Security with JWT
- [ ] Create base API infrastructure

### Phase 2: Core APIs (Not Started)

- [ ] Authentication endpoints (8 endpoints)
- [ ] Document management APIs (6 endpoints)
- [ ] Folder management APIs (6 endpoints)
- [ ] Basic file upload to Cloudflare R2

### Phase 3: AI & Learning Features (Not Started)

- [ ] Study session APIs (6 endpoints)
- [ ] AI content generation (summaries, flashcards, quizzes)
- [ ] Spaced Repetition System (SM-2 algorithm)
- [ ] Chat with documents (RAG)

### Phase 4: Advanced Features (Not Started)

- [ ] User dashboard and statistics
- [ ] Subscription management with Stripe
- [ ] Email verification and notifications
- [ ] Rate limiting with Redis

### Phase 5: Infrastructure (Not Started)

- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring and logging

## Contributing

This is currently a personal project by **longtrandev2**. Contributions are not currently being accepted, but the codebase serves as a reference for building a full-stack AI-powered education platform.

## License

This project is proprietary and all rights are reserved. Developed by **longtrandev2**.

## Acknowledgments

- **Google Gemini API** - AI-powered content generation
- **Spring Boot** - Backend framework (planned)
- **React** - Frontend framework
- **Shadcn UI** - Beautiful UI components
- **Vercel** - Frontend deployment (when ready)
