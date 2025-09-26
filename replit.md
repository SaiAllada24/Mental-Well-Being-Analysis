# Mental Health Risk Profiling Application

## Overview

This is a professional mental health risk assessment tool that evaluates emotional vulnerability across 16 key indicators to provide personalized risk profiles and wellness recommendations. The application calculates an Emotional Risk Index (ERI) score from 0-100 and categorizes users into Low, Medium, or High risk levels, then matches them with appropriate risk profiles and adaptive suggestions.

The system is designed with privacy in mind, using anonymous user tracking rather than traditional authentication, making it accessible for users who may be hesitant to provide personal information when seeking mental health resources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design system based on healthcare/wellness applications
- **State Management**: React hooks with TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API with JSON responses
- **Request Validation**: Zod schemas for type-safe validation
- **Session Management**: Anonymous user tracking via UUID instead of traditional authentication
- **Error Handling**: Centralized error middleware with structured logging

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Separate tables for anonymous user profiles, assessment sessions, and aggregated risk metrics
- **Data Privacy**: No personally identifiable information stored; users tracked via anonymous UUIDs
- **Analytics**: Aggregate statistics for benchmarking without compromising individual privacy

### Assessment Algorithm
- **ERI Calculation**: Weighted scoring system across 7 key emotional indicators
- **Risk Profiling**: Pattern matching against predefined risk profiles based on demographics and responses
- **Adaptive Suggestions**: Personalized recommendations generated based on user's gender, occupation, and specific risk factors

### External Dependencies

- **Database**: PostgreSQL (via Drizzle ORM and @neondatabase/serverless)
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Form Management**: React Hook Form with Hookform Resolvers for validation
- **Validation**: Zod for runtime type checking and schema validation
- **Query Management**: TanStack React Query for server state synchronization
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Inter) for healthcare-focused typography
- **Development**: Vite with React plugin for fast development experience