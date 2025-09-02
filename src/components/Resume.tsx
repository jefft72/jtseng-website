import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye } from 'lucide-react';

const Resume: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const resumeData = {
    overview: {
      title: 'Professional Overview',
      content: 'Experienced developer with a passion for creating innovative web solutions and delivering exceptional user experiences.',
    },
    experience: {
      title: 'Experience',
      content: [
        {
          title: 'Web Developer',
          company: 'Tech Solutions Inc.',
          period: '2022 - Present',
          description: 'Developed and maintained web applications using modern frameworks and best practices.',
        },
        {
          title: 'Frontend Developer',
          company: 'Digital Agency',
          period: '2021 - 2022',
          description: 'Created responsive web designs and implemented interactive user interfaces.',
        },
      ],
    },
    skills: {
      title: 'Technical Skills',
      content: [
        { category: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
        { category: 'Backend', skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'] },
        { category: 'Tools', skills: ['Git', 'Docker', 'AWS', 'Vercel'] },
      ],
    },
    education: {
      title: 'Education',
      content: [
        {
          degree: 'Bachelor of Computer Science',
          school: 'University of Technology',
          year: '2020',
        },
      ],
    },
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const renderContent = () => {
    const data = resumeData[activeTab as keyof typeof resumeData];
    
    switch (activeTab) {
      case 'experience':
        return (
          <div className="space-y-6">
            {(data.content as any[]).map((exp: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  <span className="text-blue-400 font-medium">{exp.period}</span>
                </div>
                <p className="text-blue-300 font-medium mb-2">{exp.company}</p>
                <p className="text-gray-300">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        );
      
      case 'skills':
        return (
          <div className="grid md:grid-cols-3 gap-6">
            {(data.content as any[]).map((skillGroup: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{skillGroup.category}</h3>
                <div className="space-y-2">
                  {skillGroup.skills.map((skill: string, skillIndex: number) => (
                    <div
                      key={skillIndex}
                      className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        );
      
      case 'education':
        return (
          <div className="space-y-6">
            {(data.content as any[]).map((edu: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{edu.degree}</h3>
                <p className="text-blue-300 font-medium mb-1">{edu.school}</p>
                <p className="text-gray-400">{edu.year}</p>
              </motion.div>
            ))}
          </div>
        );
      
      default:
        return (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-gray-300 leading-relaxed"
          >
            {data.content as string}
          </motion.p>
        );
    }
  };

  return (
    <section id="resume" className="py-20 bg-slate-900/50">
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
              Resume
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Download size={20} />
                Download PDF
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full flex items-center gap-2 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
              >
                <Eye size={20} />
                View Online
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Resume Content */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px]"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
