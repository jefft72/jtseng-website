import React from 'react';
import profileImage from '/src/assets/DSC08402.jpeg';
import Typewriter from './Typewriter';
import GithubStats from './GithubStats.tsx';
import { Linkedin, Github, Instagram } from 'lucide-react';

const Landing: React.FC = () => {
  const workingOn = 'Revolutionizing dining hall experiences with UPlate; AI Generated Podcasts for the latest in tech; Building tech for non profits';
  const SOCIALS = {
    linkedin: 'https://www.linkedin.com/in/jeffrey-tseng-9b3582261/',
    github: 'https://github.com/jefft72',
    instagram: 'https://www.instagram.com/jeffrey_tseng_/', 
  };
  return (
    <section className="snap-section">
      <div className="container mx-auto px-6 h-screen flex items-center">
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {/* Avatar */}
          <div className="flex items-center justify-center">
            <img
              src={profileImage}
              alt="Avatar"
              className="w-48 h-48 rounded-md object-cover border border-slate-600 shadow-2xl"
            />
          </div>

          {/* Typewriter + socials */}
          <div className="flex flex-col items-start justify-center">
            {/* Socials row */}
            <div className="flex items-center gap-6 mb-3 text-gray-400">
              <span className="text-sm">Find me on:</span>
              <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition">
                <Linkedin size={20} />
              </a>
              <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition">
                <Github size={20} />
              </a>
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Jeffrey Tseng</h1>
            <Typewriter text="welcome to my portfolio" speed={40} className="text-xl text-baby" />
          </div>

          {/* Charts (hidden on mobile to avoid crowding) */}
          <div className="hidden md:flex items-center">
            <div className="w-full">
              <div className="mb-4">
                <div className="text-white font-semibold">Development activity</div>
                <div className="text-gray-400 text-sm">Currently working on: <span className="text-baby">{workingOn}</span></div>
                <div className="text-gray-400 text-sm mt-2">GitHub activity:</div>
              </div>
              <GithubStats variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
