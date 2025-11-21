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
      short: 'Engineered an AI-powered meal planner by integrating the Google Gemini Generative AI API to generate personalized daily meal plans tailored to user-calculated macronutrient goals. Specific to Purdue dining halls. Coming to a dining hall near you!',
      long: 'Engineered an AI-powered meal planner by integrating the Google Gemini Generative AI API to generate personalized daily meal plans tailored to user-calculated macronutrient goals. Specific to Purdue dining halls. Coming to a dining hall near you!',
      tech: ['Flutter', 'Firebase', 'Vertex AI'],
      repoUrl: 'https://jefft72.github.io/UPlate/',
      liveUrl: '',
      image: '/src/assets/UPlateThumbnail.png',
      fit: 'contain',
      position: 'center',
      scale: 0.85,
    },
    {
      title: 'Hack the Future',
      short: 'Leading team of 10+ student engineers to design and deploy full-stack applications for local nonprofits. Working with a MERN stack and cloud services to deliver impactful solutions.',
      long: 'Leading team of 10+ student engineers to design and deploy full-stack applications for local nonprofits. Working with a MERN stack and cloud services to deliver impactful solutions.',
      tech: ['React', 'TypeScript', 'Node'],
      repoUrl: 'Private Repo',
      liveUrl: '',
      image: '/src/assets/HTFThumbnail.png',
      fit: 'cover',
      position: 'center',
    },
    {
      title: 'Google\'s Developer Group',
      short: 'Developing workshops teaching Google and AI tools. Mentoring 150+ students, providing technical assistance on Flutter, Firebase, and AI projects.',
      long: 'Developing workshops teaching Google and AI tools. Mentoring 150+ students, providing technical assistance on Flutter, Firebase, and AI projects.',
      tech: ['Firebase', 'RAG', 'Flutter'],
      repoUrl: 'Private Repo',
      liveUrl: '',
      image: '/src/assets/GDGThumbnail.png',
      fit: 'contain',
      position: 'center',
      scale: 0.7,
    },
    {
      title: 'Crcle.ai',
      short: 'Cutting edge AI startup supercharging intelligence.',
      long: 'Cutting edge AI startup supercharging intelligence.',
      tech: ['RAG', 'React Native', 'AI'],
      repoUrl: 'https://crcle.ai/',
      liveUrl: '',
      image: '/src/assets/CrclThumbnail.png',
      fit: 'contain',
      position: 'center',
    },
  ];

  const [active, setActive] = useState<Project | null>(null);
  const [overlayKey, setOverlayKey] = useState(0);

  const handleOpen = (project: Project) => {
    setActive(project);
    setOverlayKey((k) => k + 1); // Force remount for fresh animation
  };

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
            {/*<div className="w-24 h-1 bg-blue-600 mx-auto rounded-md mt-20"></div>*/}
          </motion.div>

          {/* Projects gallery: scrollable on small screens, grid on md+ */}
          <motion.div variants={itemVariants} className="project-grid-scroll mt-6">
            {projects.map((p) => (
              <div key={p.title} className="project-card-wrapper">
                <ProjectCard project={p} onOpen={() => handleOpen(p)} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <ProjectOverlay key={overlayKey} project={active} onClose={() => setActive(null)} />
    </section>
  );
};

export default About;
