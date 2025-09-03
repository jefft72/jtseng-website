import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Users } from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { name: 'Frontend Development', icon: Code, description: 'React, TypeScript, Next.js' },
    { name: 'Synthetic Aperture Radar Development', icon: Code, description: 'In collaboration with MIT\'s Lincoln Laboratories' },
    { name: 'Driven', icon: Zap, description: 'Disciplined with a willingness to learn and grow in new environments' },
    { name: 'Collaboration', icon: Users, description: 'Years of public speaking and leadership experience' },
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
    <section id="about" className="py-20 bg-slate-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                Freshman at Purdue studying Computer Science and Math, with a 
                concentration in Machine Learning. 
                Bringing ideas to life through code.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                My interests are in software engineering, machine learning, and computer vision. 
                My experience includes developing synthetic aperture radars, data analaysis in bioinformatics
                through R, and autonomous vehicle development.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                When I'm not coding, you can find me exercising, reading, or socializing with friends.
                Find my contact info in the contact section, and let's connect!
              </p>
            </motion.div>

            {/* Skills Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group p-6 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                      <skill.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8"
          >
            {[
              { number: '3', label: 'Software Engineering Internships' },
              { number: '5+', label: 'Years of Coding Experience' },
              { number: '<24 Hours', label: 'Response Time' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
