import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import resumePdf from '../../modern-portfolio/public/JeffreyTsengResume.pdf?url';

type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  bullets: string[];
};

type ProjectItem = {
  name: string;
  bullets: string[];
};

type SkillGroup = {
  category: string;
  skills: string[];
};

type EducationItem = {
  degree: string;
  school: string;
  year: string;
  details: string;
};

const Resume: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const overview =
    'Full-stack engineer with professional experience architecting high-fidelity React and Framer frontends, scalable RAG-based AI backends, and React Native mobile applications.';

  const experience: ExperienceItem[] = [
    {
      title: 'Technical Teaching Assistant',
      company: 'Google Developer Groups, Purdue University',
      period: 'August 2025 - Present',
      bullets: [
        'Designed and deployed take-home projects for 300+ students teaching React, Google Cloud, Vertex AI, and TensorFlow.',
        'Mentored 150+ developer-role students on Flutter, Firebase, and full-stack projects.',
        'Selected as one of two technical mentors from over 250 applicants.',
      ],
    },
    {
      title: 'Team Lead',
      company: 'Hack the Future, Purdue University',
      period: 'October 2025 - Present',
      bullets: [
        'Led cross-functional teams of 10+ student engineers building full-stack applications for local nonprofits.',
        'Integrated React, Node.js, FastAPI, and MongoDB while managing code reviews and Git workflows.',
        'Collaborated directly with nonprofit clients to implement user-centric solutions that fit their needs.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Crcle.ai, West Lafayette, IN',
      period: 'October 2025 - Present',
      bullets: [
        'Designed and implemented RAG workflows to improve LLM context accuracy.',
        'Developed high-performance React Native mobile interfaces with consistent iOS and Android UI/UX.',
        'Built browser integrations that connect user workflows with AI backends for instant context retrieval.',
      ],
    },
  ];

  const projects: ProjectItem[] = [
    {
      name: 'UPlate',
      bullets: [
        'Managing over 150 active users at any given time.',
        'Engineered an AI-powered meal planner using the Google Gemini Generative AI API.',
        'Built a custom Flutter onboarding flow for collecting user biometrics and macronutrient goals.',
        'Implemented offline-first SQLite persistence with asynchronous Firestore synchronization.',
      ],
    },
    {
      name: 'jtseng.org',
      bullets: [
        'Architected and deployed a dynamic full-stack personal portfolio website.',
        'Engineered the frontend with React and TypeScript for a responsive, mobile-first interface.',
        'Developed a Node.js backend for API requests and project data.',
      ],
    },
  ];

  const skills: SkillGroup[] = [
    { category: 'Languages', skills: ['React', 'TypeScript', 'Python', 'Java', 'JavaScript', 'Flutter', 'React Native'] },
    { category: 'AI & Data', skills: ['RAG', 'LLMs', 'Hugging Face', 'NumPy', 'SciPy', 'Matlab'] },
    { category: 'Tools', skills: ['Gazebo', 'ROS', 'Node', 'Tailwind', 'Firebase', 'MongoDB'] },
  ];

  const education: EducationItem[] = [
    {
      degree: 'Bachelor of Science in Computer Science and Mathematics',
      school: 'Purdue University, West Lafayette, IN',
      year: 'Expected Graduation: May 2028',
      details: 'GPA: 3.5/4.0 | Relevant classes: Web App Programming, Programming in C, Object Oriented Programming, Discrete Math, Linear Algebra',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
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
    switch (activeTab) {
      case 'experience':
        return (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <motion.div
                key={`${exp.title}-${exp.company}`}
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
                <ul className="text-gray-300 space-y-2">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{project.name}</h3>
                <ul className="text-gray-300 space-y-2">
                  {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{skillGroup.category}</h3>
                <div className="space-y-2">
                  {skillGroup.skills.map((skill) => (
                    <div
                      key={skill}
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
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{edu.degree}</h3>
                <p className="text-blue-300 font-medium mb-1">{edu.school}</p>
                <p className="text-gray-400 mb-2">{edu.year}</p>
                <p className="text-gray-300">{edu.details}</p>
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
            {overview}
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
              <motion.a
                href={resumePdf}
                download="JeffreyTsengResume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Download size={20} />
                Download PDF
              </motion.a>

              <motion.a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full flex items-center gap-2 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
              >
                <Eye size={20} />
                View Online
              </motion.a>
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
