// app/(routes)/about/page.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { education } from "@/data/education";
import { skills, SkillCategory } from "@/data/skills";

export default function AboutPage() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Me
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get to know more about my background and skills
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-4">Who I Am</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I&apos;m Jainam Khara, a Full Stack Developer with a passion for creating innovative webistes and applications. I&apos;m currently pursuing a Bachelor&apos;s in Computer Science at SAL Institute and Technologies and Engineering Research, where I continue to expand my knowledge and skills.
              </p>
              <p>
                With expertise in Next.js, React, Android and various other technologies, I enjoy building scalable and user-friendly applications that solve real-world problems. My background in computer science has given me a strong foundation in algorithms, data structures, and system design, which I apply to create efficient and maintainable code.
              </p>
              <p>
                I&apos;m particularly interested in the intersection of web development and App development technology, where I&apos;ve developed several projects that leverage the power of decentralized systems to create secure and transparent applications.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <Card key={edu.id}>
                  <CardHeader className="p-4">
                    <CardTitle>
                      <div>
                        <h3 className="text-lg font-bold">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">Collage : {edu.institution}</p>
                        <p className="text-sm text-muted-foreground">University : {edu.university}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {edu.startDate} - {edu.endDate}
                      </span>
                      <span className="text-muted-foreground">{edu.location}</span>
                    </div>
                    {edu.cgpa && (
                      <Badge variant="outline" className="mt-2">
                        CGPA: {edu.cgpa}
                      </Badge>
                    )}
                    {edu.description && (
                      <p className="mt-2 text-sm">{edu.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            
            {Object.keys(skills).map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills[category as SkillCategory].map((skill) => (
                    <Badge key={skill.name} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            <h2 className="text-2xl font-bold mt-8 mb-4">Achievements</h2>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">•</span>
                    <span>
                      Solved 100+ Leetcode Questions.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">•</span>
                    <span>
                      Completed 10+ Projects.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}