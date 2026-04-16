export interface Certificate {
  id: string;
  name: string;
  image: string;
  organization: string;
  date: string;
  description: string;
  skills: string[];
}

export const certificates: Certificate[] = [
  {
    id: "deloitte-data-analytics",
    name: "Deloitte Data Analytics Job Simulation",
    image:
      "/images/certificate/Deloitee Data Analytics Job Simulation Certificate_page-0001.jpg",
    organization: "Deloitte",
    date: "March 2026",
    description:
      "Completed a comprehensive data analytics job simulation with Deloitte, learning industry-standard tools and methodologies for data analysis and business intelligence.",
    skills: ["Data Analysis", "Business Intelligence", "Excel", "SQL"],
  },
  {
    id: "jpmorgan-software-engineering",
    name: "JP Morgan Chase & Co. Software Engineering",
    image:
      "/images/certificate/JP Morgan Chase & Co. Software Engineering Certificate_page-0001.jpg",
    organization: "JP Morgan Chase & Co.",
    date: "March 2026",
    description:
      "Completed a software engineering job simulation focusing on building scalable applications and understanding enterprise software development practices.",
    skills: ["Software Engineering", "Java", "System Design", "APIs"],
  },
  {
    id: "tata-genai-data-analytics",
    name: "TATA GenAI Powered Data Analytics",
    image:
      "/images/certificate/TATA GenAI Powered Data Analytics Course_page-0001.jpg",
    organization: "TATA",
    date: "March 2026",
    description:
      "Advanced course on generative AI-powered data analytics tools and techniques for extracting insights from complex datasets.",
    skills: ["Generative AI", "Data Analytics", "Machine Learning", "Python"],
  },
  {
    id: "udemy-numpy-data-analysis",
    name: "NumPy Data Analysis for Data Scientists",
    image: "/images/certificate/Udemp-numpy_data_analysis_with_python.jpg",
    organization: "Udemy",
    date: "March 15, 2026",
    description:
      "Comprehensive course on NumPy library covering array manipulation, mathematical operations, and data analysis fundamentals.",
    skills: ["NumPy", "Python", "Data Analysis", "Scientific Computing"],
  },
  {
    id: "udemy-android-16",
    name: "The Complete Android 16 Course [Part 1]",
    image:
      "/images/certificate/Udemy-Android-16-course-using-java-and-kotlin.jpg",
    organization: "Udemy",
    date: "March 15, 2026",
    description:
      "In-depth Android development course covering Android 16 features, UI design patterns, and best practices using Java and Kotlin.",
    skills: ["Android", "Kotlin", "Java", "Mobile Development"],
  },
  {
    id: "udemy-python-zero-to-mastery",
    name: "Complete Python Developer in 2023: Zero to Mastery",
    image: "/images/certificate/Udemy-Python_course_zero_to_mastery.jpg",
    organization: "Udemy",
    date: "March 26, 2023",
    description:
      "Comprehensive Python programming course from basics to advanced concepts, including web development and data science applications.",
    skills: ["Python", "Web Development", "OOP", "Data Science"],
  },
  {
    id: "udemy-networking-fundamentals",
    name: "Complete Networking Fundamentals Course",
    image:
      "/images/certificate/Udemy-The_complete_networking_fundamental_course.jpg",
    organization: "Udemy",
    date: "April 26, 2023",
    description:
      "Foundational course covering OSI model, TCP/IP protocols, routing, switching, and network troubleshooting essentials.",
    skills: ["Networking", "TCP/IP", "Routing", "Network Security"],
  },
  {
    id: "coursera-advanced-java",
    name: "Advanced Java",
    image: "/images/certificate/Learn_Quest-Coursera-Advance_Java.jpg",
    organization: "LearnQuest / Coursera",
    date: "March 1, 2026",
    description:
      "Advanced Java programming course covering multithreading, collections framework, and enterprise application development.",
    skills: ["Java", "Multithreading", "Collections", "Enterprise Java"],
  },
  {
    id: "stanford-divide-conquer-algorithms",
    name: "Divide and Conquer, Sorting and Searching",
    image:
      "/images/certificate/Stanford-Coursera-Divide_and_Conquer_Sorting_and_Searching_and Randomized_Algorightm.jpg",
    organization: "Stanford University / Coursera",
    date: "September 8, 2025",
    description:
      "Advanced algorithms course from Stanford covering divide-and-conquer paradigm, sorting algorithms, searching techniques, and randomized algorithms.",
    skills: ["Algorithms", "Data Structures", "Sorting", "Complexity Analysis"],
  },
];
