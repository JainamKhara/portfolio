export interface Education {
    id: string;
    degree: string;
    institution: string;
    university: string;
    location: string;
    startDate: string;
    endDate: string;
    cgpa?: string;
    description?: string;
  }
  
export const education: Education[] = [
    {
      id: "diploma",
      degree: "Diploma in Computer Engineering",
      institution: "C. U. Shah Govt. Polytechnic - 609",
      university: "Gujarat Technological University",
      location: "Surendranagar, Gujarat, India",
      startDate: "2021",
      endDate: "2024",
      cgpa: "8.09/10.00"
    },
    {
      id: "deegre",
      degree: "Bachelor's in Computer Science",
      institution: "SAL Institute and Technologies and Engineering Research",
      university: "Gujarat Technological University",
      location: "Ahmedabad, Gujarat, India",
      startDate: "2024",
      endDate: "2027",
      cgpa: "8.13/10.00"
    }
  ];