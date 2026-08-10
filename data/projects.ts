export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  functionality: string[];
  image: string;
  github?: string;
  liveUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "drop-of-hope",
    title: "Drop Of Hope",
    description: "A comprehensive web-based blood donation management platform connecting donors, hospitals, and administrators.",
    longDescription: "Developed a modern blood donation management platform to bridge the communication gap between individuals willing to donate blood and hospitals in desperate need. By gamifying the donor experience and providing powerful oversight tools to administrators, the platform encourages repeat donations, ensures well-attended blood drives, and maintains real-time inventory tracking for critical patient care.",
    technologies: ["React", "TypeScript", "Vite", "TailwindCSS", "shadcn/ui", "Node.js", "Express", "Supabase", "PostgreSQL", "Clerk", "Recharts"
    ],
    functionality: [
      "Interactive Donor Dashboard with a gamified rewards system, appointment booking, and a community feed.",
      "Dedicated Hospital Portal for real-time blood inventory tracking, low stock alerts, and requisition management.",
      "Admin Dashboard featuring system-wide analytics, user management, and detailed CSV reporting.",
      "Hybrid Authentication architecture utilizing Clerk for donors and direct Supabase auth for hospitals and admins.",
      "Built-in AI chatbot assistant and fully responsive mobile-first UI/UX across all pages."
    ],
    image: "/images/projects/drop-of-hope/drop-of-hope.png",
    github: "https://github.com/jainamKhara/drop-of-hope",
    liveUrl: "https://drop-of-hope.vercel.app",
    featured: true
  },
  {
    id: "skribbl-clone",
    title: "Skribbl Clone",
    description: "A real-time multiplayer drawing and guessing game featuring synchronized canvas, live chat, and a custom room system.",    longDescription: "Developed a modern blood donation management platform to bridge the communication gap between individuals willing to donate blood and hospitals in desperate need. By gamifying the donor experience and providing powerful oversight tools to administrators, the platform encourages repeat donations, ensures well-attended blood drives, and maintains real-time inventory tracking for critical patient care.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Supabase Realtime", "Clerk", "HTML5 Canvas API","Radix UI"],
    functionality: [
      "Real-time synchronized drawing canvas featuring pen, eraser, fill bucket, and undo actions.",
      "Live guessing system via chat with automatic word hints and intelligent scoring based on answer speed.",
      "Room-based multiplayer architecture for 2-8 players with synchronized timers and player presence tracking.",
      "Dual authentication flow supporting both guest-play and continuous profile sync via Clerk.",
      "Responsive, themed user interface with polished Dark/Light mode toggle and animated game-over feedback."
    ],
    image: "/images/projects/skribbl-clone/skribbl-clone.png",
    github: "https://github.com/JainamKhara/skribbl-clone",
    // liveUrl: "https://drop-of-hope.vercel.app",
    featured: true
  },
  {
    id: "vehiql",
    title: "Vehiql",
    description: "Full Stack AI Car Rental Marketplace",
    longDescription: "Vehiql is a modern, AI-powered car marketplace built with Next.js 15. It allows users to browse cars, save their favorite vehicles, book test drives, and interact with AI features. It includes a comprehensive back-office for dealership and working hours management.",
    technologies: ["Next.js", "TailwindCSS", "React", "Shadcn/ui", "Supabase", "Prisma", "Clerk", "Gemini AI", "Arcjet"],
    functionality: [
      "AI-driven car recommendation wizard based on user search and driving habits.",
      "Complete booking flows for reserving test drives with integrated calendar sync.",
      "Dual client/dealer portal system for car listings management, specifications, and dealer metrics.",
      "Integrated Arcjet security rules for rate limiting, bot protection, and signup protection."
    ],
    image: "/images/projects/vehiql/vehiql.png",
    github: "https://github.com/jainamKhara/vehiql",
    featured: false
  },
  {
    id: "rotomdex",
    title: "RotomDex",
    description: "A competitive-grade Pokédex and tactical companion built with Live PokéAPI and Neon PostgreSQL.",
    longDescription: "RotomDex is a full-stack competitive Pokédex application powered by a serverless PostgreSQL database (Neon) and Prisma ORM. Beyond a basic lookup tool, it features deep stats visualization, type-coverage calculations, side-by-side comparison tools, custom team builders, and a silhouette-based 'Who's That Pokémon?' guessing game to test recognition skills.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS v4", "Prisma", "PostgreSQL", "Neon", "TanStack Query", "NextAuth.js", "Zustand", "Recharts", "Framer Motion"],
    functionality: [
      "Real-time lookup and advanced multi-filter search for all 1,025 Pokémon across Gen 1-9.",
      "Interactive Team Builder allowing up to 6 members with automated type coverage weakness/resistance mapping.",
      "Side-by-side head-to-head comparison tool with dynamic scaling stat bars and move intersections.",
      "Interactive 'Who's That Pokémon?' silhouette guessing game with score streaks and random roster gen.",
      "Detail pages with dynamic stats radar, complete movesets, abilities, and complex evolution chain trigger maps."
    ],
    image: "/images/projects/rotomdex/rotomdex.png",
    github: "https://github.com/JainamKhara/rotomdex",
    liveUrl: "https://rotomdex-web.vercel.app",
    featured: true
  },
  {
    id: "space-explorer",
    title: "Deep Space Explorer",
    description: "An immersive, high-performance 3D solar system simulation featuring celestial physics and cinematic post-processing.",
    longDescription: "Deep Space Explorer is an immersive 3D solar simulation bringing astronomical data to life. It features high-fidelity rendering, instanced asteroid belts rendering thousands of objects smoothly at 60 FPS, dynamic solar flare particle effects, and cinematic post-processing (Bloom, Tone Mapping, chromatic aberration). It features interactive camera orbits, moon/planet HUD inspectors, and a glassmorphic dashboard control panel.",
    technologies: ["Next.js", "Three.js", "React Three Fiber", "React Three Drei", "Postprocessing", "Zustand", "Tailwind CSS v4", "TypeScript", "Framer Motion"],
    functionality: [
      "Fully navigable 3D solar system with smooth orbital controls and realistic lighting/shadow models.",
      "High-performance instanced rendering of an Asteroid Belt rendering thousands of unique assets.",
      "Dynamic celestial HUD displaying real-time data like gravity, mass, orbital periods, and temperature.",
      "Integrated settings panel to adjust visual fidelity (Bloom intensity, chromatic aberration) and toggle gravity/orbit lines.",
      "Immersive reactive space ambient soundscapes matching scene focus and planet selection."
    ],
    image: "/images/projects/space-explorer/space-explorer.png",
    github: "https://github.com/jainamKhara/space-explorer",
    liveUrl: "https://space-explorer-hub.vercel.app",
    featured: true
  },
  {
    id: "sur-sangeet",
    title: "Sur-Sangeet",
    description: "An AI/ML-powered music discovery platform and interactive studio deck utilizing 5D KNN vector cosine matching across 18,000+ tracks.",
    longDescription: "Sur-Sangeet is a full-stack, AI/ML-powered music discovery platform and interactive studio deck. It utilizes K-Nearest Neighbors (KNN) with Cosine Distance vector matching across 18,154 real Spotify & YouTube tracks in a 5-dimensional audio vector space (danceability, energy, acousticness, valence, tempo) to construct personalized playlists based on real-time acoustic preferences. Features an interactive 5D vector calibration wizard, a tactile Hi-Fi analog turntable player deck with spinning vinyl disc and tonearm physics, and YouTube audio streaming.",
    technologies: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "Python",
      "Scikit-Learn",
      "PostgreSQL",
      "Neon",
      "SQLAlchemy",
      "Zustand",
      "TanStack Query",
      "YouTube API",
      "Framer Motion"
    ],
    functionality: [
      "Interactive 5D Vector Calibration Wizard for fine-tuning target mood, activity, danceability, energy, acousticness, valence, and tempo.",
      "K-Nearest Neighbors (KNN) Cosine Distance vector matching engine across 18,154 normalized audio track vectors.",
      "Automated Artist Diversity Filter pass ensuring varied, non-repetitive playlist recommendation flows.",
      "Tactile Hi-Fi Analog Turntable Deck Stage with spinning vinyl disc, dynamic tonearm movement, timeline scrubber, and volume control.",
      "Seamless background audio playback powered by YouTube IFrame API with Neon cloud PostgreSQL vector persistence."
    ],
    image: "/images/projects/sur-sangeet/sur-sangeet.png",
    github: "https://github.com/JainamKhara/Sur-Sangeet",
    liveUrl: "https://sur-sangeet.vercel.app",
    featured: true
  },
];