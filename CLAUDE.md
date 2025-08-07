# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bida is a mobile-first web application designed to support parents in tracking and nurturing their child's developmental milestones. The app focuses on children from 2 to 60 months old, providing personalized activities based on milestone assessments.

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with phone/OTP (no passwords)
- **Styling**: Tailwind CSS with custom color palette
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Architecture

### Authentication Flow
1. **Onboarding** → Welcome screens introducing Bida
2. **Phone Login** → Phone number input
3. **OTP Verification** → 6-digit code verification
4. **Child Profile** → Create first child profile with terms acceptance
5. **Main App** → Navigate to Activities tab (home)

### Core Features

#### Navigation Structure
- 5 bottom tabs: Activities (default), Milestones, Resources, Experts, Profile
- Maximum 3 buttons per screen
- All interactive elements in bottom 40% of screen

#### Milestone Assessment System
- Assessment months: 2,4,6,8,9,10,12,14,16,18,20,22,24,27,30,33,36,42,48,54,60
- 5 developmental domains per assessment
- 2 milestones per domain (10 total per assessment)
- Three-response system: Yes / Not yet / Try it
- Try It guides open as bottom sheets

#### Activity Management
- 30-40 activities generated after each milestone assessment
- Three states: active, completed (archived), saved
- Activities personalized based on milestone responses

### Database Schema

Key tables:
- `parents`: User accounts with phone authentication
- `children`: Child profiles (max 5 per parent)
- `milestones`: Reference data for all developmental milestones
- `milestone_assessments`: Records of completed assessments
- `activities`: Personalized activities for each child
- `try_it_guides`: Instructions for milestone practice

### Mobile-First Design Constraints

- **Max width**: 430px (centered on larger screens)
- **Touch targets**: Minimum 60x60px
- **Color palette**:
  - Periwinkle (#B0C4E8) - Cognitive domain
  - Yellow (#F4C430) - Language domain
  - Green (#B8D97E) - Physical domain
  - Orange (#F5A65B) - Self-help domain
  - Pink (#E8B4C5) - Social-emotional domain
  - Gray - "Not yet" responses (never use red)
- **One-handed operation**: All decisions/actions accessible with thumb
- **No scrolling for decisions**: Critical choices always visible

## Key Implementation Details

### Supabase Configuration
- Environment variables needed in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Row Level Security enabled on all user tables
- Phone/OTP authentication configured

### Component Structure
```
components/
├── ui/                  # Reusable UI components
├── forms/               # Form components with validation
└── features/            # Feature-specific components
```

### State Management
- Server components for data fetching
- Client components for interactivity
- Supabase real-time subscriptions for live updates

### Animations
- Celebratory animations for achievements
- Bottom sheet transitions for Try It guides
- Smooth tab navigation transitions

## Testing Approach

When testing:
1. Test mobile viewport (max 430px width)
2. Verify touch targets are minimum 60x60px
3. Ensure one-handed operation works
4. Check that no red colors appear
5. Validate phone/OTP flow
6. Test with multiple child profiles