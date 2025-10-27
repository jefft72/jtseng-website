import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
type Props = { fullPage?: boolean };

const About: React.FC<Props> = ({ fullPage = false }) => {
  const skills = [
    { name: 'Full‑Stack Web', icon: Code, description: 'React, TypeScript, Node.js/FastAPI' },
    { name: 'Radar Systems (SAR)', icon: Code, description: 'Python/C++, NumPy, SciPy, Matlab' },
    { name: 'Mobile + AI', icon: Code, description: 'Flutter, Firebase, TensorFlow, Vertex AI' },
    { name: 'Leadership & Teaching', icon: Code, description: 'Code reviews, Git workflow, Mentoring' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
  <section id="about" className={fullPage ? 'snap-section' : 'section'}>
      <div className="container mx-auto px-6 py-8 md:py-0 flex items-center justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-6xl w-full"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Me
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-md"></div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-xl text-gray-300 leading-relaxed">
                Full stack developer with hands‑on experience leading and developing user‑first apps and websites,
                RAG backends, and defensive backend radar systems.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Currently a CS + Math student at Purdue (GPA 4.0/4.0), seeking a 2026 software engineering internship.
              </p>
              <div className="text-gray-400">
                <div className="font-semibold text-white mb-1">Relevant courses</div>
                <ul className="space-y-1">
                  <li>CS390: Web Applications Programming</li>
                  <li>CS193: Computer Science Tools</li>
                  <li>CS180: Problem Solving & OOP</li>
                  <li>MA261: Multivariable Calculus</li>
                </ul>
              </div>
            </motion.div>

            {/* Skills Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group p-4 panel hover:border-blue-500 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 chip-blue">
                      <skill.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/**/}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
