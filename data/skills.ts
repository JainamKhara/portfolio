// data/skills.ts
export type SkillCategory = 
  | 'Languages' 
  | 'Frameworks/Libraries' 
  | 'ML/Data' 
  | 'Cloud/DevOps' 
  | 'Concepts';

export interface Skill {
  name: string;
  category: SkillCategory;
  logoKey: string; // Used to generate the CDN URL
}

export const skills: Record<SkillCategory, Skill[]> = {
  'Languages': [
    { name: 'C', category: 'Languages', logoKey: 'c' },
    { name: 'C++', category: 'Languages', logoKey: 'cplusplus' },
    { name: 'HTML', category: 'Languages', logoKey: 'html5' },
    { name: 'CSS', category: 'Languages', logoKey: 'css3' },
    { name: 'Java', category: 'Languages', logoKey: 'java' },
    { name: 'Python', category: 'Languages', logoKey: 'python' },
    { name: 'JavaScript', category: 'Languages', logoKey: 'javascript' },
    { name: 'TypeScript', category: 'Languages', logoKey: 'typescript' },
    { name: 'SQL', category: 'Languages', logoKey: 'mysql' },
    { name: 'PHP', category: 'Languages', logoKey: 'php' },

    // { name: 'Rust', category: 'Languages', logoKey: 'rust' },
  ],
  'Frameworks/Libraries': [
    { name: 'React.js', category: 'Frameworks/Libraries', logoKey: 'react' },
    { name: 'Node.js', category: 'Frameworks/Libraries', logoKey: 'nodejs' },
    { name: 'Next.js', category: 'Frameworks/Libraries', logoKey: 'nextjs' },
    { name: 'Express.js', category: 'Frameworks/Libraries', logoKey: 'express' },
    { name: 'Tailwind CSS', category: 'Frameworks/Libraries', logoKey: 'tailwindcss' },
    { name: 'Android SDK', category: 'Frameworks/Libraries', logoKey: 'android' },
    { name: 'Three.js', category: 'Frameworks/Libraries', logoKey: 'threejs' },
    { name: 'React Native', category: 'Frameworks/Libraries', logoKey: 'react' },
  ],
  'ML/Data': [
    { name: 'TensorFlow', category: 'ML/Data', logoKey: 'tensorflow' },
    { name: 'PyTorch', category: 'ML/Data', logoKey: 'pytorch' },
    { name: 'Pandas', category: 'ML/Data', logoKey: 'pandas' },
    { name: 'Numpy', category: 'ML/Data', logoKey: 'numpy' },
    { name: 'Matplotlib', category: 'ML/Data', logoKey: 'matplotlib' },
    { name: 'Scikit-learn', category: 'ML/Data', logoKey: 'python' },
  ],
  'Cloud/DevOps': [
    { name: 'GCP', category: 'Cloud/DevOps', logoKey: 'googlecloud' },
    { name: 'Docker', category: 'Cloud/DevOps', logoKey: 'docker' },
    { name: 'Firebase', category: 'Cloud/DevOps', logoKey: 'firebase' },
    { name: 'Supabase', category: 'Cloud/DevOps', logoKey: 'supabase' },
    { name: 'MongoDB', category: 'Cloud/DevOps', logoKey: 'mongodb' },
    { name: 'PostgreSQL', category: 'Cloud/DevOps', logoKey: 'postgresql' },
  ],
  'Concepts': [
    { name: 'System Design', category: 'Concepts', logoKey: 'github' },
    { name: 'Data Structures & Algorithms', category: 'Concepts', logoKey: 'github' },
    { name: 'Distributed Systems', category: 'Concepts', logoKey: 'github' },
    { name: 'API Design', category: 'Concepts', logoKey: 'swagger' },
    { name: 'Microservices', category: 'Concepts', logoKey: 'docker' },
    { name: 'Security', category: 'Concepts', logoKey: 'github' },
  ],
};

// Helper functions
export const getAllSkills = () => {
  return Object.values(skills).flat();
};

export const getCategories = () => {
  return Object.keys(skills) as SkillCategory[];
};