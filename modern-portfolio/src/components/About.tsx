import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard, { type Project } from './ProjectCard';
import ProjectOverlay from './ProjectOverlay';
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

  // project flipping page
  const projects: Project[] = [
    {
      title: 'UPlate',
      short: 'AI meal planner & dining engagement app.',
      long: 'AI-powered meal planner integrating Generative APIs, Flutter frontend with offline-first sync and Firestore backend.',
      tech: ['Flutter', 'Firebase', 'Vertex AI'],
      repoUrl: 'https://jefft72.github.io/UPlate/',
      liveUrl: '',
      image: '/src/assets/UPlateThumbnail.png',
    },
    {
      title: 'Hack the Future',
      short: 'Helping nonprofits build tech solutions.',
      long: 'Coming soon.',
      tech: ['React', 'TypeScript', 'Node'],
      repoUrl: '',
      liveUrl: '/',
      image: '/src/assets/HTFThumbnail.png',
    },
    {
      title: 'Google\'s Developer Group',
      short: 'Developing workshops teaching Google and AI tools.',
      long: 'Mentoring 150+ students, providing technical assistance on Flutter, Firebase, and AI projects.',
      tech: ['JavaScript', 'LLMs', 'APIs', 'TTS'],
      repoUrl: '',
      liveUrl: '',
      image: '/src/assets/podcasts-thumb.jpg',
    },
    {
      title: 'Crcle.ai',
      short: 'Cutting edge AI startup supercharging intelligence.',
      long: 'Coming soon.',
      tech: ['TypeScript', 'React', 'AI'],
      repoUrl: '',
      liveUrl: '',
      image: '/src/assets/crcle-thumb.jpg',
    },
  ];

  const [active, setActive] = useState<Project | null>(null);

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
                <ProjectCard project={p} onOpen={() => setActive(p)} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <ProjectOverlay project={active} onClose={() => setActive(null)} />
    </section>
  );
};

export default About;
