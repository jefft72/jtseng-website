import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
type Props = { fullPage?: boolean };

const About: React.FC<Props> = ({ fullPage = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  // Example projects — replace with real repo data or CMS later
  const projects = [
    {
      title: 'UPlate',
      short: 'AI meal planner & dining engagement app.',
      long: 'AI-powered meal planner integrating Generative APIs, Flutter frontend with offline-first sync and Firestore backend.',
      tech: ['Flutter', 'Firebase', 'Vertex AI'],
      repoUrl: 'https://github.com/jefft72/uplate',
      liveUrl: '',
      image: '/src/assets/uplate-thumb.jpg',
    },
    {
      title: 'jtseng.org',
      short: 'Personal portfolio engine and CMS.',
      long: 'Dynamic full-stack personal portfolio with React + TypeScript frontend and Node APIs.',
      tech: ['React', 'TypeScript', 'Node'],
      repoUrl: 'https://github.com/jefft72/jtseng.org',
      liveUrl: '/',
      image: '/src/assets/site-thumb.jpg',
    },
    {
      title: 'AI Podcasts',
      short: 'Auto-generated podcast pipeline for tech topics.',
      long: 'Pipeline that produces short AI-generated podcast episodes using LLMs and TTS, with automated publishing.',
      tech: ['Python', 'LLMs', 'GCP'],
      repoUrl: '',
      liveUrl: '',
      image: '/src/assets/podcast-thumb.jpg',
    },
  ];

  return (
    <section id="about" className={fullPage ? 'snap-section' : 'section'}>
      <div className="container mx-auto px-6 py-8 md:py-0 flex items-center justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="max-w-6xl w-full"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">What I'm currently working on</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-md"></div>
          </motion.div>

          {/* Projects gallery: scrollable on small screens, grid on md+ */}
          <motion.div variants={itemVariants} className="project-grid-scroll mt-6">
            {projects.map((p) => (
              <div key={p.title} className="project-card-wrapper">
                <ProjectCard project={p} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
