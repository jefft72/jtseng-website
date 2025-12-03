import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

type Props = { fullPage?: boolean };

const Resume: React.FC<Props> = ({ fullPage = false }) => {
  const [activeTab, setActiveTab] = useState('experience');

  const resumeData = {
    overview: {
      title: 'Professional Summary',
      content:
        'Full stack developer with hands-on experience leading and developing user-first apps and websites, RAG backends, and defensive backend radar systems. Seeking a 2026 software engineering internship.',
    },
    experience: {
      title: 'Experience',
      content: [
        {
          title: 'Team Lead',
          company: 'Hack the Future, Purdue University',
          period: 'Oct 2025 – Present',
          bullets: [
            'Led cross-functional teams of 10+ student engineers to design and deploy full-stack applications for local nonprofits',
            'Integrated React, Node.js/FastAPI, and MongoDB; performed code reviews and Git workflow management',
            'Collaborated with nonprofit clients to implement user-centric solutions',
          ],
        },
        {
          title: 'Technical Teaching Assistant',
          company: 'Google Developer Groups, Purdue University',
          period: 'Aug 2025 – Present',
          bullets: [
            'Designed and deployed take-home projects for 300+ students covering React, Google Cloud, Vertex AI, and TensorFlow',
            'Mentored 150+ developer students on Flutter, Firebase, and full-stack projects',
            'Selected as 1 of 2 technical mentors from 250+ applicants',
          ],
        },
        {
          title: 'Synthetic Aperture Radar Developer',
          company: 'MIT Beaver Works, Cambridge, MA',
          period: 'Jul 2024 – Aug 2024',
          bullets: [
            'Developed back-projection imaging algorithms in Python and C++ using NumPy/SciPy/Matlab',
            'Processed radar data enabling high-resolution imaging of 2.6 in. soda cans across 10×10 meters',
            'Built an F550 Hexacopter; integrated a PulsOn 440 radar with Raspberry Pi via socket programming for live telemetry',
          ],
        },
      ],
    },
    projects: {
      title: 'Projects',
      content: [
        {
          name: 'UPlate',
          details: [
            'AI-powered meal planner integrating Google Gemini Generative AI API',
            'Flutter UI with multi-page onboarding and offline-first SQLite; async sync to Firestore',
          ],
        },
        {
          name: 'jtseng.org',
          details: [
            'Dynamic, full-stack personal portfolio website',
            'Frontend in React + TypeScript; Node.js backend for APIs and project data',
          ],
        },
      ],
    },
    skills: {
      title: 'Technical Skills',
      content: [
        { category: 'Languages', skills: ['Python', 'Java', 'HTML', 'CSS', 'C++', 'C', 'TypeScript'] },
        { category: 'Libraries & Tools', skills: ['NumPy', 'SciPy', 'Matlab', 'Gazebo', 'ROS', 'Node', 'React', 'Tailwind'] },
        { category: 'Relevant Courses', skills: ['CS390 Web Apps', 'CS193 Tools', 'CS180 OOP', 'MA261 Multivariable Calculus'] },
      ],
    },
    education: {
      title: 'Education',
      content: [
        {
          degree: 'B.S. in Computer Science & Mathematics',
          school: 'Purdue University, West Lafayette, IN',
          year: 'Graduation: May 2028 | GPA: 4.0/4.0',
        },
      ],
    },
  };

  const tabs = [
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'overview', label: 'Overview' },
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
                className="p-6 panel hover:border-blue-500 transition-all duration-300 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  <span className="text-blue-400 font-medium">{exp.period}</span>
                </div>
                <p className="text-blue-300 font-medium mb-2">{exp.company}</p>
                {exp.bullets ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    {exp.bullets.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">{exp.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            {(data.content as any[]).map((p: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 panel text-left"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{p.name}</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  {p.details.map((d: string, di: number) => (
                    <li key={di}>{d}</li>
                  ))}
                </ul>
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
                className="p-6 panel"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{skillGroup.category}</h3>
                {/* Minimal inline list without bubble chips */}
                <p className="text-gray-300 leading-relaxed">
                  {skillGroup.skills.join(' • ')}
                </p>
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
                className="p-6 panel text-left"
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
            className="text-lg text-gray-300 leading-relaxed text-left"
          >
            {data.content as string}
          </motion.p>
        );
    }
  };

  return (
    <section id="resume" className={fullPage ? 'snap-section' : 'section'}>
      <div className="container mx-auto px-6 py-8 flex flex-col justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-6xl mx-auto w-full"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resume
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-md mb-8"></div>
            
            {/* View/Download Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-3 px-4">
              <a href="/JeffreyTsengResume.pdf" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline"
                >
                  View PDF
                </motion.button>
              </a>
              <a href="/JeffreyTsengResume.pdf" download="JeffreyTsengResume.pdf">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                >
                  <Download size={20} />
                  Download Resume
                </motion.button>
              </a>
            </div>
          </motion.div>

          {/* Interactive Resume Content */}
          <motion.div variants={itemVariants} className="panel p-4 md:p-8">
            {/* Tab Navigation - pyramid on mobile (2 top, 3 bottom), row on desktop */}
            <div className="md:hidden flex flex-col items-center gap-3 mb-8 px-4">
              {/* Top row - 2 tabs */}
              <div className="flex justify-center gap-6">
                {tabs.slice(0, 2).map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
              {/* Bottom row - 3 tabs */}
              <div className="flex justify-center gap-6">
                {tabs.slice(2).map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>
            {/* Desktop - single row */}
            <div className="hidden md:flex justify-center gap-6 mb-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
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

