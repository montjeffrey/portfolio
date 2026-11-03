# Jeffrey Montoya - Portfolio Website

A high-performance, animated portfolio website built with Next.js 14+ that bridges the gap between Technical Implementation (Cloud/Security/Code) and Operational Management (CRM/Workflows).

## 🎨 Design

**Theme:** Dark Tech Premium
- Primary Color: Burnt Orange (#E77D22)
- Secondary Color: Soft Cream (#F0EDE4)
- Background: Dark (#0D0D0D)
- Elevated Background: Dark Gray (#1A1A1A)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for contact form)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase

Create a `messages` table in your Supabase database:
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT,
  message TEXT NOT NULL,
  preferred_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page with Supabase form
│   ├── projects/          # Projects listing and case studies
│   ├── resume/            # Resume Hub page
│   ├── layout.tsx         # Root layout with navbar and footer
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Glassmorphism navigation
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section with typing effect and beam background
│   ├── SkillsBentoGrid.tsx # Skills showcase in Bento grid layout
│   ├── TailnetScan.tsx    # Scene 2: interactive tailnet-sentry graph
│   ├── OpenSourceTrack.tsx # Scene 3: pinned track of open-source tools with live demos
│   ├── PipelineScene.tsx  # Scene 4: scroll-driven release pipeline (test, fail and retry, scan, sign, ship)
│   ├── BrandStatement.tsx # Brand statement section
│   ├── BottomCTA.tsx      # Bottom call-to-action
│   └── ProjectCard.tsx    # Project card with tech stack marquee
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client configuration
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🛠️ Features

### Pages

- **Home:** Hero section with animated typing effect and Three.js beam background, Skills Bento Grid, Featured Projects, Brand Statement
- **Projects:** Filterable project grid with tech stack marquee on hover, case study pages with type-specific layouts
- **About:** Professional journey timeline, certifications, technical proficiencies
- **Contact:** Supabase-integrated contact form with validation
- **Resume Hub:** Multiple resume versions with download/view options

### Components

- **Hero:** Typing effect cycling through skills (Python, AWS, Security, Operations) with animated beam background
- **Skills Bento Grid:** 4-card grid showcasing Cloud, Security, Development, and Operations skills
- **Project Cards:** Interactive cards with tech stack marquee animation on hover
- **Case Studies:** Type-specific layouts:
  - **Web Dev:** Before/After performance metrics slider
  - **ML/Python:** Code blocks + Architecture diagrams
  - **Security:** Terminal output styles

### Animations

- Framer Motion for page transitions and component animations
- Three.js for beam background effect
- CSS animations for typing effect and marquee scrolling

## 📝 Pages Overview

### Home Page
- Hero section with typing effect
- Skills snapshot in Bento Grid layout
- Featured projects preview
- Brand statement
- Bottom CTA section

### Projects Page
- Filterable project grid (All, Web Development, Data/ML, Security Tools, Automation)
- Project cards with tech stack marquee
- Links to detailed case studies

### Case Studies
Each project has a dedicated case study page with:
- Project overview (Challenge, Solution, Impact)
- Technical architecture diagrams
- Key technical decisions
- Results & metrics
- Type-specific layouts based on project category

### About Page
- Professional journey timeline
- Personal story and motivation
- Current and in-progress certifications
- Technical proficiencies breakdown
- Soft skills showcase

### Contact Page
- Contact information sidebar
- "What I Can Help With" section
- Supabase-integrated contact form
- Form validation and success/error states

### Resume Hub
- Three resume versions:
  - Technical Resume
  - Public Information Specialist Resume
  - Solutions Engineer Resume
- Download/View PDF options
- Core competencies section

## 🎯 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** Three.js
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Create the `messages` table (see SQL above)
3. Add your Supabase URL and anon key to `.env.local`
4. Configure Row Level Security (RLS) if needed

### Customization

- **Colors:** Edit `tailwind.config.ts` to change color scheme
- **Content:** Update `context.md` for content changes
- **Components:** Modify components in `/components` directory

## 📄 License

© 2025 Jeffrey Montoya. All rights reserved.

## 🚀 Deployment

The site can be deployed to Vercel, Netlify, or any platform supporting Next.js.

```bash
npm run build
npm start
```

For Vercel:
```bash
vercel
```

## 📧 Contact

- Email: montjeffrey@gmail.com
- Phone: (201) 841-9697
- LinkedIn: [linkedin.com/in/montjeffrey](https://linkedin.com/in/montjeffrey)
- Location: Dover, NJ (Open to remote opportunities)

