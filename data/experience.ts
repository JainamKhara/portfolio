// data/experience.ts
export interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
    type?: 'work' | 'research' | 'education' | 'leadership';
    current?: boolean;
  }
  
  export const experiences: Experience[] = [
    // Regular job positions
    {
      id: "python",
      title: "Python Intern",
      company: "Findpro IT Solutions",
      location: "Surendranagar, Gujarat, India",
      startDate: "9 September 2022",
      endDate: "22 September 2022",
      description: "Learned Python programming language and developed a student management project using Python.",
      achievements: [
        "Learns the python with various libraries like pandas, numpy, matplotlib, scikit-learn, tensorflow, pytorch, etc.",
        "Make the Student Management System Web app that use the basic python concepts and store data in excel sheet.",
        "Optimized and enhanced UI/UX, reducing page load time by 60% and improving responsiveness across devices",
        "Achieved 80% grading accuracy improvement and 50% evaluation efficiency boost through workflow."
      ],
      type: 'work'
    },
    {
      id: "android",
      title: "Android Intern",
      company: "Findpro IT Solutions",
      location: "Surendranagar, Gujarat, India",
      startDate: "27 July 2022",
      endDate: "30 August 2022",
      description: "Learned Android programming in Java and developed a Ecommerce App called Planet Shopify using Android.",
      achievements: [
        "Learns the android with various libraries like SQLite, firebase, retrofit, room, etc.",
        "Make the Ecommerce App called Planet Shopify that uses the firebase to store the data.",
        "Also make the admin side in the app for management and tracking the data.",
        "Achieved 85% grading accuracy improvement and 50% evaluation efficiency boost through workflow."
      ],
      type: 'work'
    },
  ];