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
    description: " Full Stack AI Car Rental Marketplace",
    longDescription: "Vehiql is a modern, AI-powered car marketplace built with Next.js 15. It allows users to browse cars, save their favorite vehicles, book test drives, and interact with AI features. It includes a comprehensive back-office for dealership and working hours management.",
    technologies: ["Next.js", "TailwindCSS", "React", "Shadcn/ui", "Supabase", "Prisma", "Clerk", "Gemini AI", "Arcjet"],
    functionality: [
      // "Built for 150+ artists to mint and sell NFTs with Solidity and IPFS",
      // "Enabled 300+ transactions and 30% faster monetization via Polygon",
      // "Implemented role-based access and interactive features like community hubs, increasing session duration by 65%",
      // "Eliminated third-party dependencies and automated royalty payouts, reducing overhead and platform latency by 30%"
    ],
    image: "/images/projects/vehiql/vehiql.png",
    github: "https://github.com/jainamKhara/vehiql",
    // liveUrl: "https://vehiql.com",
    featured: true
  },
];