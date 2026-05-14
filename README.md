# Jainam Khara Portfolio

A cinematic developer portfolio built with Next.js 15, React 19, Tailwind CSS 4, Framer Motion, GSAP, and a custom interactive hero badge/lanyard experience.

Live website: [https://jainamkhara.vercel.app](https://jainamkhara.vercel.app)

## Overview

This project is a personal portfolio for showcasing projects, experience, certificates, skills, and contact information with a strong editorial dark theme. The current build includes a custom animated loading flow, smooth scrolling, a command-palette-driven navigation layer, a bespoke draggable hero ID card, and a contact form backed by a Next.js API route and Resend.

## Features

- Editorial dark-mode-first UI with custom typography, grain texture, and subtle motion
- Interactive homepage hero with a draggable hanging ID card and animated lanyard strap
- Scroll progress indicator, scroll-to-top control, and smooth scrolling via Lenis
- Command palette navigation for fast keyboard-driven movement across the site
- Custom desktop cursor treatment
- Loading screen transition before the main layout appears
- Dedicated pages for:
  - About
  - Projects
  - Experience
  - Certificates
  - Contact
- Dynamic detail pages for projects and certificates
- Contact form with:
  - `zod` validation
  - `react-hook-form` integration
  - API submission to `/api/contact`
  - Resend-powered email delivery
  - success and error states
- Analytics and performance instrumentation via Vercel Analytics and Speed Insights
- Responsive layout tuned for desktop, tablet, and mobile

## Tech Stack

- Framework: Next.js 15 App Router
- Runtime: React 19
- Styling: Tailwind CSS 4
- Motion:
  - Framer Motion
  - GSAP
  - Lenis
- 3D / canvas:
  - Three.js
  - React Three Fiber
  - Drei
- Forms and validation:
  - react-hook-form
  - zod
  - @hookform/resolvers
- UI primitives: Radix UI + custom `shadcn/ui` components
- Email delivery: Resend
- Analytics: `@vercel/analytics`, `@vercel/speed-insights`

## Getting Started

### Prerequisites

- Node.js 18.18+ recommended
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JainamKhara/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root with:

   ```bash
   RESEND_API_KEY=your_resend_api_key
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start the development server with Turbopack
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run lint checks

## Environment Variables

The contact form API route uses Resend. Set:

```bash
RESEND_API_KEY=your_resend_api_key
```

Without this value, the contact API returns a configuration error instead of attempting delivery.

## Project Structure

```text
├── app/
│   ├── (routes)/
│   │   ├── about/
│   │   ├── certificates/
│   │   ├── contact/
│   │   ├── experience/
│   │   └── projects/
│   ├── api/
│   │   └── contact/
│   ├── client-layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── metadata.ts
│   └── page.tsx
├── components/
│   ├── certificates/
│   ├── contact/
│   ├── experience/
│   ├── home/
│   │   ├── hero.tsx
│   │   ├── id-card.tsx
│   │   ├── id-card-ui.tsx
│   │   ├── achievements.tsx
│   │   ├── featured-projects.tsx
│   │   ├── skills-showcase.tsx
│   │   └── testimonials.tsx
│   ├── layout/
│   ├── projects/
│   ├── shared/
│   └── ui/
├── data/
│   ├── certificates.ts
│   ├── education.ts
│   ├── experience.ts
│   ├── projects.ts
│   ├── skills.ts
│   └── social.ts
├── lib/
│   ├── animations.ts
│   ├── gsap.ts
│   └── utils.ts
├── public/
│   ├── fonts/
│   ├── images/
│   ├── Jainam_Khara_CV.pdf
│   └── blackhole.webm
└── package.json
```

## Key Implementation Notes

- The hero ID card is a custom DOM/SVG interaction, not a generic draggable card.
- The lanyard physics are implemented in the hero component layer and tuned for release swing + return-to-rest motion.
- The star background canvas still uses React Three Fiber / Drei.
- The root client layout sets the site to dark mode by default and disables system theme switching.
- The contact flow is server-backed through `app/api/contact/route.ts`.

## Customization

### Content

Update these files to change portfolio content:

- `data/projects.ts`
- `data/experience.ts`
- `data/certificates.ts`
- `data/skills.ts`
- `data/social.ts`
- `data/education.ts`

### Hero / Branding

If you want to rework the main visual identity:

- `components/home/hero.tsx` controls the homepage hero composition
- `components/home/id-card.tsx` controls the lanyard behavior and strap visuals
- `components/home/id-card-ui.tsx` controls the badge face

### Contact

To change contact delivery behavior:

- `components/contact/contact-form.tsx` controls client-side UX
- `app/api/contact/route.ts` controls server-side validation and Resend delivery

### Styling

Core theme and layout styling live in:

- `app/globals.css`
- `tailwind.config.js`
- `components/ui/*`

## Deployment

The project is optimized for Vercel, but it can run anywhere that supports Next.js.

### Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add `RESEND_API_KEY` in the project environment settings.
4. Deploy.

### Other Platforms

Build and run with:

```bash
npm run build
npm run start
```

Refer to the official [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

## Credits

- UI primitives: [Radix UI](https://www.radix-ui.com/)
- Component patterns: [shadcn/ui](https://ui.shadcn.com/)
- Motion: [Framer Motion](https://www.framer.com/motion/) and [GSAP](https://gsap.com/)
- Smooth scrolling: [Lenis](https://lenis.darkroom.engineering/)
- 3D background: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), and [Drei](https://github.com/pmndrs/drei)
- Email delivery: [Resend](https://resend.com/)

## License

This repository is available for personal and educational reference. If you reuse it, replace personal content and branding with your own.
