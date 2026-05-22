# 📐 Jainam Khara Portfolio — Cinematic Developer Hub

A high-performance, beautifully styled personal portfolio built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, and **Three.js**. The site features a premium "Editorial Brutalist" aesthetic with sharp design elements, custom interactive physics, cinematic animations, and a seamlessly fluid experience showcasing both technical sophistication and visual excellence.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-000000?style=flat-square)](https://gsap.com/)

🌐 **Live Website**: [https://jainamkhara.app](https://jainamkhara.app)

---

## ✨ Highlights

An editorial brutalism portfolio reimagined for the modern developer—sharp lines, intentional asymmetry, and cinematic interactions that elevate technical credibility. Built with cutting-edge web technologies and meticulously crafted animations that respond to every user gesture.

* **Next.js 15 + React 19** - Latest performance and developer experience
* **Editorial Brutalism Design System** - Sharp edges (1-2px borders), teal accents, asymmetric layouts, premium minimalist aesthetic
* **GSAP + Framer Motion Animations** - GPU-accelerated spring physics, staggered reveals, and smooth scroll interactions
* **Three.js Interactive Elements** - WebGL 3D interactions and particle-based visual effects
* **Production-Ready** - Live at [jainamkhara.app](https://jainamkhara.app)

---

## 🎨 Design Philosophy: Editorial Brutalism

This portfolio represents a bold departure from generic design trends. It embodies **Editorial Brutalism**—a design philosophy that rejects glossy rounded corners, glassmorphism, and "safe harbor" layouts in favor of intentional, minimalist brutality.

### Core Design Principles

**Sharp, Structural Design**
- **1-2px borders** throughout (never rounded-lg or excessive smoothing)
- **Precise alignment** that feels like a technical blueprint or editorial layout
- **No glossiness** – anti-patterns like glassmorphism and mesh gradients are explicitly rejected
- **High contrast shadows** for depth and visual hierarchy without blur effects

**Color System**
- **Primary Black**: `#09090C` (dark mode canvas) and `#F4F4F3` (light mode off-white)
- **Accent Teal**: `#0d9488` / `#14b8a6` (primary interaction and focus color)
- **No purple/violet** – maintains strict palette discipline for premium coherence
- **Minimal accents** – color is used strategically, not decoratively

**Typography & Hierarchy**
- **Serif display headers** - Creates premium, editorial feel for section titles
- **Sans-serif body text** - Clean, readable, technical accessibility
- **Deliberate contrast** - Typography reinforces visual hierarchy and reading flow

**Asymmetric Vertical Narrative**
- Breaks traditional hero split layouts (left content / right image cliché)
- Uses unconventional positioning and staggered compositions
- Creates visual tension and engagement through intentional imbalance
- Prioritizes content flow over perfect symmetry

**Animation Philosophy**
- **GPU-accelerated only** - Uses `transform` and `opacity` properties for 60fps performance
- **Staggered scroll reveals** - Elements don't enter all at once; they cascade with calculated delays
- **Spring physics** - Interactive elements respond with natural momentum and bounce
- **Purpose-driven motion** - Every animation serves UX, not just aesthetic appeal

What This Is **NOT**:
- ❌ Rounded corners on cards or components
- ❌ Glassmorphism or frosted glass effects
- ❌ Mesh gradients or organic blob shapes
- ❌ Generic "safe harbor" marketing layouts
- ❌ Over-decorated or cluttered interfaces

---

## ✨ Live Feature Showcase

What you actually experience when visiting the portfolio:

### 🪪 Interactive Physics ID Badge
The hero section greets you with a realistic digital ID badge suspended from a lanyard. Grab it with your cursor—it responds with full physics simulation: gravity, momentum, spring-based return animations. Release it and watch it swing back into place with satisfying, natural motion.

### 🎬 Cinematic Boot Sequence
Before the main page loads, witness a particle-based diagnostic boot screen. Thousands of floating nodes calculate their coordinates, converging into letters that form "JAINAM" before dissolving to reveal the portfolio. It's technical, minimal, and visually striking.

### 📜 Staggered Scroll Reveals
As you scroll through the site, content doesn't just appear—it cascades onto screen with calculated delays. Projects, certificates, timeline entries, and skill cards all enter with smooth spring-based animations, creating visual momentum as you explore.

### 🎛️ Tech Grid with Adaptive Contrast
The skills showcase features intelligent styling that adapts to your theme. In dark mode, pure-black tech icons invert to bright white. In light mode, they sit at perfect opacity to maintain visual balance. Hover over any skill and watch the grayscale fade away, revealing vibrant brand colors.

### 🌓 Blueprint Aesthetic Theme Switching
Toggle between dark mode (`#09090C` deep canvas) and light mode (`#F4F4F3` clean off-white). The entire UI responds instantly with perfect contrast maintenance—no jarring transitions, just smooth theme switching that maintains readability.

### 💬 Smooth Momentum Scrolling
The Lenis scroll engine provides momentum-based scrolling with easing that feels responsive and premium. Scroll interactions feel effortless and modern, enhancing the overall sense of polish.

---

## 🎬 Animation & Interaction Techniques

This portfolio showcases advanced animation and interaction patterns across three major technologies:

### GSAP (GreenSock Animation Platform)
- **Timeline Sequences**: Complex, multi-step animations orchestrated with GSAP timelines
- **Spring Dynamics**: Elastic animations with customizable tension and friction
- **Scroll Triggers**: Elements animate in response to scroll position with precision control
- **Staggered Reveals**: Arrays of elements cascade onto screen with calculated delays for visual narrative

**Real Example**: Hero section elements (title, subtitle, ID badge) all animate in sequence using GSAP timelines, creating a cinematic welcome experience.

### Framer Motion
- **Component Transitions**: Smooth enter/exit animations on pages and modals
- **Variants & Orchestration**: Parent-child component animations coordinated for cohesive movement
- **Gesture Interactions**: Respond to mouse position, drag, and pointer events
- **Layout Animations**: Elements smoothly adjust position when the DOM updates

**Real Example**: Project cards use Framer Motion variants to scale and fade in as the page loads, creating a unified entrance effect.

### Three.js + React Three Fiber (R3F)
- **WebGL Canvas Rendering**: GPU-accelerated 3D environments for immersive interactions
- **Particle Systems**: Thousands of nodes calculating position simultaneously (like the boot screen)
- **Custom Materials & Shaders**: Advanced visual effects beyond DOM capabilities
- **Performance Optimization**: Mesh instancing and level-of-detail (LOD) for smooth 60fps rendering

**Real Example**: The diagnostics loader uses Three.js particles to create the text formation effect with thousands of animated nodes.

### Performance Excellence
- **GPU-Accelerated Animations**: All animations use `transform` and `opacity` only (no repaints or layout recalculations)
- **60 FPS Target**: Optimized animations maintain smooth performance even on mid-range devices
- **Intersection Observer Patterns**: Scroll triggers only calculate when elements are visible
- **Lazy Loading**: Components animate in only when they enter the viewport

---

## 🗺️ Portfolio Pages & Experience

### 🏡 Home Landing Page

Your first impression. The hero section features:
- **Asymmetric layout** - Bold, off-center composition breaks traditional web design patterns
- **Interactive ID badge** - Grab and interact with the physics-based lanyard and badge
- **Staggered scroll reveals** - Content cascades onto screen as you scroll down
- **Quick-highlight achievements** - Stats block showing projects completed, years of experience, and technical depth
- **Featured projects carousel** - Preview notable work with smooth transitions
- **Skills matrix** - Adaptive tech grid with grayscale-to-color hover effects and intelligent contrast

*See screenshot: [portfolio_hero_section.png](screenshots/portfolio_hero_section.png)*

### 📁 Projects Hub

A comprehensive showcase of technical work:
- **Interactive grid system** - Browse projects with smooth filtering and sorting
- **Dynamic thumbnail cards** - Each project displays tech stack, description, and key achievements
- **Detailed project pages** - Click any project to see:
  - Full project description and technical implementation details
  - Core technologies and libraries used
  - Live links and GitHub repository access
  - Project metrics and impact
  - Visual walkthroughs and previews

*See screenshot: [portfolio_projects_page.png](screenshots/portfolio_projects_page.png)*

### 💼 Experience Timeline

Professional journey visualized:
- **Vertical timeline layout** - Clean, elegant chronological display of career progression
- **Interactive timeline nodes** - Hover over entries to reveal detailed information
- **Role descriptions** - Company, position, timeframe, and key accomplishments
- **Skill tags** - Technologies and methods used in each role
- **Growth landmarks** - Visual indicators of career progression and major milestones

*See screenshot: [porfolio_experience_page.png](screenshots/porfolio_experience_page.png)*

### 🎓 Certificates Archive

Professional credentials showcase:
- **Certification catalog** - Browse verified credentials and certifications
- **Dynamic showcase pages** - Click certificates for detailed view including:
  - Credential title and issuing organization
  - Completion date and credential ID
  - Link to verify or view certificate online
- **Category filtering** - Organize certificates by specialization or date

*See screenshot: [portfolio_certificates_page.png](screenshots/portfolio_certificates_page.png)*

### 📝 Contact Desk

Direct communication portal:
- **Real-time validation** - Form validates as you type with clear error indicators
- **React Hook Form + Zod** - Robust client-side validation before submission
- **Server-side processing** - Secure API endpoint handles all submissions
- **Resend Email Integration** - Messages delivered directly to inbox
- **Success feedback** - Clear confirmation after submission

*See screenshot: [portfolio_contact_page.png](screenshots/portfolio_contact_page.png)*

### 👤 About Section

Personal profile and background:
- Professional summary and bio
- Key accomplishments and values
- Visual profile
- Interest areas and specializations

*See screenshot: [portfolio_about_page.png](screenshots/portfolio_about_page.png)*

### 🎯 Full Portfolio View

Complete page layout showcasing all design elements and interactive features in one viewport:

*See screenshot: [portfolio_full_page.png](screenshots/portfolio_full_page.png)*

---

## 🛠️ Technology Stack Overview

### Core Framework & Runtime
- **Framework**: [Next.js 15](https://nextjs.org/) - Latest React server components and App Router
- **Runtime**: [React 19](https://react.dev/) - Modern reactive UI with concurrent features
- **Build Tool**: [Turbopack](https://turbo.build/pack) - Lightning-fast builds and dev server

### Styling & Design System
- **CSS Framework**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first responsive design
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - High-quality, accessible component primitives
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful, consistent icon set

### Animation & Motion
- **GSAP (GreenSock)**: Advanced animation sequencing with spring physics and scroll triggers
- **Framer Motion**: React component animation with variants and gesture support
- **React** lifecycle animations built into component architecture

### 3D Graphics & Visualization
- **Three.js**: WebGL 3D graphics and particle systems
- **React Three Fiber (R3F)**: Three.js wrapped in React component model
- **Drei**: Useful abstractions for React Three Fiber (post-processing, UI elements in 3D)

### Interaction & Scrolling
- **Lenis**: Smooth, momentum-based scrolling engine
- **Intersection Observer API**: Scroll-triggered animations and lazy loading

### Forms & Data Validation
- **React Hook Form**: Performant, flexible form state management
- **Zod**: TypeScript-first schema validation for type-safe form handling
- **Resend SDK**: Email delivery for contact form submissions

### Additional Utilities
- **Next Themes**: Dark mode / light mode theme management
- **Tailwind Merge**: Smart class merging for Tailwind utilities
- **clsx**: Utility for conditional CSS classes

---

## 📂 Codebase Directory Map

```text
├── app/
│   ├── (routes)/
│   │   ├── about/            # Profile page with biography
│   │   ├── certificates/     # Verified credentials showcase
│   │   │   └── [slug]/       # Dynamic certification detail page
│   │   ├── contact/          # Contact form with validation
│   │   ├── experience/       # Career timeline visualization
│   │   └── projects/         # Comprehensive project catalog
│   │       └── [slug]/       # Dynamic project showcase page
│   ├── api/
│   │   └── contact/          # Resend email API handler
│   ├── client-layout.tsx     # Theme provider & Lenis scroll setup
│   ├── globals.css           # Global styles, fonts, custom utilities
│   ├── layout.tsx            # Root HTML layout and metadata
│   └── page.tsx              # Home landing page
├── components/
│   ├── certificates/         # Certificate display components
│   ├── contact/              # Contact form components with Zod validation
│   ├── experience/           # Timeline and achievements visualizations
│   ├── home/
│   │   ├── achievements.tsx  # Stats and metrics block
│   │   ├── featured-projects.tsx # Project highlight carousel
│   │   ├── hero.tsx          # Hero section with asymmetric layout
│   │   ├── id-card-ui.tsx    # ID badge visual design
│   │   ├── id-card.tsx       # Physics-based lanyard interaction
│   │   ├── skills-showcase.tsx # Tech grid with adaptive contrast
│   │   └── testimonials.tsx  # Recommendations and feedback
│   ├── layout/
│   │   ├── footer.tsx        # Footer with links and metadata
│   │   └── navbar.tsx        # Navigation bar and theme toggle
│   ├── projects/             # Project card and detail components
│   ├── shared/               # Reusable utility components
│   │   ├── loading-screen.tsx # Particle-based boot sequence
│   │   └── scroll-to-top.tsx  # Smooth scroll utilities
│   └── ui/                   # shadcn UI design system components
├── data/                     # Static data models
│   ├── skills.ts            # Technology stack data
│   ├── projects.ts          # Project catalog with descriptions
│   ├── experience.ts        # Career timeline data
│   ├── certificates.ts      # Professional credentials
│   ├── education.ts         # Educational background
│   └── social.ts            # Social media and contact links
├── lib/                      # Utility functions and helpers
│   ├── animations.ts        # GSAP animation configurations
│   ├── constants.ts         # Global constants and settings
│   └── utils.ts             # General utility functions
├── public/                   # Static assets
│   ├── assets/              # Logos and images
│   ├── cv.pdf               # Downloadable resume
│   └── videos/              # Project preview videos
├── screenshots/             # Portfolio showcase screenshots
├── .env.local               # Environment variables (not versioned)
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.ts           # Next.js configuration
```

---

## 🚀 Local Installation & Set-Up

Get the portfolio running on your local machine in just a few steps.

### Prerequisites

Ensure you have the following installed:
- **Node.js** v18.18+ or v20+ ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm** / **yarn** (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/JainamKhara/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

Or with pnpm:
```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Resend API Key for contact form email delivery
# Get your key at https://resend.com/
RESEND_API_KEY=your_resend_api_key_here

# Optional: Analytics or other service keys can be added here
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page will auto-refresh as you make changes.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🌟 Featured Technologies & Techniques

### Why These Choices?

**Next.js 15**: Combines server-side rendering (SSR), static generation, and API routes in one cohesive framework. Enables fast page transitions, optimal SEO, and edge computing.

**GSAP**: The gold standard for web animation. Provides microsecond-precise timing, spring physics, and scroll-triggered animations that other libraries can't match.

**Three.js + R3F**: Enables immersive 3D graphics and particle effects (like the boot screen) while keeping code in React component syntax.

**Tailwind CSS 4**: Eliminates CSS overhead through utility-first approach, resulting in smaller bundle sizes and faster development velocity.

**Editorial Brutalism**: A reaction against "safe" design trends. Sharp lines, teal accents, and asymmetric layouts create a premium, technical first impression.

---

## 🌐 Deployment & Hosting

The portfolio is optimized for deployment on modern hosting platforms:

### Recommended Platforms
- **Vercel** - Seamless Next.js integration with zero-config deployments
- **Netlify** - Static site hosting with serverless functions
- **Railway / Render** - Full-stack hosting with Docker support

### Deployment on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click "New Project" and select your portfolio repository
4. Add environment variables (RESEND_API_KEY) in Vercel dashboard
5. Click "Deploy" — your site is live in seconds

No build configuration needed. Vercel handles Next.js optimization automatically.

---

## 📖 Project Structure Best Practices

The codebase follows these organizational principles:

- **Modular components** - Each component is self-contained with its own styles and logic
- **Data separation** - Content lives in `/data` for easy updates without code changes
- **Shared utilities** - Common functions in `/lib` to avoid duplication
- **Type safety** - TypeScript throughout for compile-time error catching
- **Responsive design** - Mobile-first Tailwind utilities ensure cross-device compatibility

---

## 🌟 Show Your Support

If you find this portfolio useful, inspiring, or technically impressive, please consider giving it a ⭐️ on [GitHub](https://github.com/JainamKhara/portfolio). It helps others discover high-quality, modern portfolio implementations.

---

## 📬 Connect & Collaborate

Have a project idea, collaboration opportunity, or want to discuss web development and design? Reach out:

- **Email**: [kharajaynam@gmail.com](mailto:kharajaynam@gmail.com)
- **LinkedIn**: [Jainam Khara](https://www.linkedin.com/in/jainamkhara/)
- **GitHub**: [@JainamKhara](https://github.com/JainamKhara)
- **Portfolio**: [jainamkhara.app](https://jainamkhara.app)

---

## 💡 Learning Resources

This portfolio implements several advanced techniques. Here are resources to learn more:

- **GSAP Docs**: https://gsap.com/docs/
- **Three.js Documentation**: https://threejs.org/docs/
- **React Three Fiber**: https://r3f.docs.pmnd.rs/
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Next.js App Router**: https://nextjs.org/docs/app

---

## 📄 License

This project is distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

You are free to use, modify, and distribute this code for personal or commercial projects.

---

**Last Updated**: May 22, 2026 | **Version**: 2.0 (Editorial Brutalism Redesign)
