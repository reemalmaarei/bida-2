# Bida - Child Development Support App

A mobile-first web application for parents to track their child's developmental milestones and receive personalized activity recommendations.

## Features

- 📱 Mobile-first design (optimized for 430px width)
- 🔐 Phone/OTP authentication (no passwords)
- 👶 Multi-child profiles (up to 5 children)
- 📊 Milestone assessments at key developmental stages
- 🎯 30-40 personalized activities after each assessment
- 📚 Educational resources for parents
- 👩‍⚕️ Connect with child development experts
- 🎉 Celebratory animations for achievements

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Phone/OTP)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the migrations in `lib/supabase/migrations/` in order
   - Enable Phone Auth in Supabase dashboard

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your mobile browser or use device emulation

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Project Structure

```
app/
├── (auth)/          # Authentication flow
├── (setup)/         # Child profile setup
├── (main)/          # Main app screens
components/
├── ui/              # Reusable UI components
├── features/        # Feature-specific components
lib/
├── supabase/        # Database client and migrations
├── types/           # TypeScript definitions
```

## Design Principles

- **Mobile-first**: Maximum width of 430px
- **One-handed operation**: All actions in bottom 40% of screen
- **Touch-friendly**: Minimum 60x60px touch targets
- **No scrolling for decisions**: Maximum 3 buttons per screen
- **Accessible colors**: No red for negative responses (using gray instead)

## License

Private - All rights reserved