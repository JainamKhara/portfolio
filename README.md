# 📐 Jainam Khara Portfolio — Cinematic Developer Hub

A high-performance, beautifully styled personal portfolio built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, and **Three.js**. The site features a premium "CAD Blueprint & Editorial Brutalist" aesthetic, custom interactive elements, seamless typography animations, a cinematic loading experience, and fluid layouts.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)

🌐 **Live Website**: [https://jainamkhara.app](https://jainamkhara.app)

---

## 📖 Project Vision & Design Concept

This portfolio is crafted to feel less like a traditional site and more like an **interactive technical drawing board**. Drawing inspiration from minimalist editorial layouts and mathematical blueprint sheets (CAD), the UI uses precise lines, alignment coordinate labels, clean grids, and subtle motion to showcase visual polish.

### Key Visual Principles

* **The Blueprint Aesthetics**: Thin `1px` structural borders, coordinate axes, and technical markers outline every section, creating a structured workspace feel.
* **Dual Theme Modes**:
  * **Dark Mode**: A deep `#09090C` canvas with subtle slate gridlines, vermilion highlights, and crisp paper-white lettering.
  * **Light Mode**: A clean, elegant `#F4F4F3` off-white canvas, ink-black text details, and soft divider elements.
* **Smooth Scrolling**: Integrated with the Lenis scrolling engine to ensure smooth momentum, easing, and coordinate alignments on scroll.

---

## ⚡ Core Interactive Features

### 1. 🪪 Draggable Lanyard & Physics ID Badge

In the hero section of the landing page, users are greeted by a realistic, dynamic digital ID badge suspended from a flexible lanyard strap.

* **Realistic Playfulness**: You can grab, toss, and drag the ID badge using your cursor. The badge swings, rebounds, and reacts with realistic gravity and momentum.
* **Smooth Spring Return**: When you release the card, the lanyard cable acts as a spring, pulling the card back to its natural rest position at the top-center.

### 2. 🎬 Diagnostics Loader & Boot Screen

Before unlocking the homepage, a cinematic diagnostic loading screen runs on mount:

* **Diagnostics Log**: Simulates technical system status reports on screen.
* **Interactive Particle Wave**: Thousands of floating nodes calculate their coordinates on screen, gathering and converging together to cleanly form the letters of the name `"JAINAM"` before fading away to reveal the portfolio.

### 3. 🎛️ Intelligent Tech Grid with Smart Contrast

The tech stack skills showcase automatically matches the clean, minimalist blueprint aesthetic using adaptive styling logic:

* **Adaptive Contrast**: Icons like **Next.js**, **Express.js**, **Three.js**, **Pandas**, and **GitHub** consist of pure-black silhouettes. In dark mode, these automatically invert to a bright white, while in light mode they sit at a balanced `38%` opacity to match the visual weight of other icons.
* **Unified Grayscale Hover**: All tech icons render in elegant grayscale by default. Hovering over a card cleanly fades the grayscale away, revealing the vibrant, colored brand identity of each framework.

---

## 🗺️ Tour of the Portfolio Pages

### 🏡 Home Page

The primary viewport mounting the coordinate system. It features the interactive ID badge, quick-highlight achievements (Projects completed, experience indicators), a preview carousel of notable creations, and the skills matrix.

### 📁 Projects Hub

A complete list of technical projects. It features an interactive grid filtering system, dynamic thumbnail tags, and clean, custom project detail pages highlighting descriptions, core libraries, and live link buttons.

### 💼 Experience Timeline

A detailed career archive. It uses a vertical timeline grid to map roles, company metrics, accomplishments, and career growth landmarks in a clean, easily readable system.

### 🎓 Certificates Archive

A catalog of verified professional credentials. Clicking any certificate displays a dynamic showcase detailing the credentials, completion dates, and issuing bodies.

### 📝 Contact Desk

A functional, validation-secured inbox portal:

* Built with `react-hook-form` and `zod` for real-time field error indicators.
* Connected to a secure server API endpoint.
* Delivers messages directly to the portfolio owner using the **Resend API**.

---

## 🛠️ Technology Stack Overview

* **Framework**: Next.js 15 (App Router)
* **Runtime**: React 19
* **Styling**: Tailwind CSS 4
* **Motion Physics**: Framer Motion & GSAP (GreenSock)
* **3D Canvas**: Three.js & React Three Fiber (R3F)
* **Scrolling**: Lenis Scroll Engine
* **Form Verification**: React Hook Form & Zod
* **Mail Delivery**: Resend SDK

---

## 📂 Codebase Directory Map

```text
├── app/
│   ├── (routes)/
│   │   ├── about/            # Profile page
│   │   ├── certificates/     # Verified certificates showcase
│   │   │   └── [slug]/       # Dynamic certification page
│   │   ├── contact/          # Resend contact form
│   │   ├── experience/       # Career timeline page
│   │   └── projects/         # Extensive project catalog
│   │       └── [slug]/       # Dynamic project showcase page
│   ├── api/
│   │   └── contact/          # Resend back-channel email API handler
│   ├── client-layout.tsx     # Theme provider & Lenis smooth scroll bindings
│   ├── globals.css           # Global custom fonts & custom styles
│   ├── layout.tsx            # Main HTML layout
│   └── page.tsx              # Home landing viewport
├── components/
│   ├── certificates/         # Components specific to credentials
│   ├── contact/              # Interactive Zod contact form
│   ├── experience/           # Timeline and achievements nodes
│   ├── home/
│   │   ├── achievements.tsx  # Interactive stats block grid
│   │   ├── featured-projects.tsx # Highlighted projects section
│   │   ├── hero.tsx          # Homepage landing hero component
│   │   ├── id-card-ui.tsx    # Front graphics of the ID badge
│   │   ├── id-card.tsx       # Lanyard Verlet physics simulation
│   │   ├── skills-showcase.tsx # Skills matrix catalog
│   │   └── testimonials.tsx  # Slider detailing recommendations
│   ├── layout/
│   │   ├── footer.tsx        # Technical bottom bar
│   │   └── navbar.tsx        # Top navigation & theme switch toggles
│   ├── projects/             # Card & dynamic details components
│   ├── shared/               # Modular components (magnetic triggers, loading screen, etc.)
│   └── ui/                   # High-end design system primitives (shadcn UI)
├── data/                     # Local data models (skills, projects, timeline, socials)
├── lib/                      # Math utilities, GSAP configurations
├── public/                   # Vector logo assets, PDF CV, video previews
└── package.json              # Project dependencies and script declarations
```

---

## 🚀 Local Installation & Set-Up

Setting up the project locally is fast and straightforward.

### Prerequisites

* Ensure **Node.js** (v18.18+ or v20+) is installed on your computer.

### 1. Clone & Enter

```bash
git clone https://github.com/JainamKhara/portfolio.git
cd portfolio
```

### 2. Install Project Libraries

```bash
npm install
```

### 3. Add Environment Variables

Create a file named `.env.local` in the project root folder:

```env
# Add Resend API Key to handle email submissions
RESEND_API_KEY=your_resend_api_key_here
```

### 4. Run the Site

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🌟 Show Your Support

If you find this project useful or inspiring, please consider giving it a ⭐️ on [GitHub](https://github.com/JainamKhara/portfolio)! It helps others discover this high-performance technical blueprint portfolio.

---

## 📬 Connect & Collaborate

Have a project idea, want to collaborate, or just want to chat about developer interfaces? Feel free to reach out:

* **Email**: [kharajaynam@gmail.com](mailto:kharajaynam@gmail.com)
* **LinkedIn**: [Jainam Khara](https://linkedin.com/in/jainamkhara)
* **GitHub**: [@JainamKhara](https://github.com/JainamKhara)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
