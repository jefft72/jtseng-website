import React from 'react';
import profileImage from '/src/assets/DSC08402.jpeg';
import Typewriter from './Typewriter';
import GithubStats from './GithubStats.tsx';
import { Linkedin, Github, Instagram } from 'lucide-react';

const Landing: React.FC = () => {
  const SOCIALS = {
    linkedin: 'https://www.linkedin.com/in/jeffrey-tseng-9b3582261/',
    github: 'https://github.com/jefft72',
    instagram: 'https://www.instagram.com/jeffrey_tseng_/', 
  };
  return (
    <section id="hero" className="snap-section">
      <div className="container mx-auto px-6">
  <div className="flex flex-col md:flex-row items-center md:items-start justify-center max-w-7xl mx-auto" style={{ gap: '6rem' }}>
          {/* Left Column: Avatar + Name + Typewriter + Socials */}
          <div className="flex flex-col items-center md:items-start flex-shrink-0" style={{ gap: '2.5rem', minWidth: '260px' }}>
            <img
              src={profileImage}
              alt="Jeffrey Tseng"
              className="w-48 h-48 rounded-md object-cover border border-slate-600 shadow-2xl"
            />
            
            <div className="flex flex-col items-center md:items-start" style={{ gap: '1.25rem' }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white whitespace-nowrap">Jeffrey Tseng</h1>
              <Typewriter text="welcome to my portfolio" speed={40} className="text-xl text-baby" />
              
              {/* Socials row */}
              <div className="flex items-center gap-4 text-gray-400">
                <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-baby transition">
                  <Linkedin size={24} />
                </a>
                <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-baby transition">
                  <Github size={24} />
                </a>
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-baby transition">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: GitHub contributions */}
          <div className="w-full flex flex-1 justify-center md:justify-start" style={{ maxWidth: '52rem' }}>
            <div style={{ width: '100%' }}>
              <GithubStats variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
