import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Instagram } from 'lucide-react';
import profileImage from '../assets/DSC08402.JPEG';
import GithubStats from './GithubStats';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start gap-6 flex-shrink-0"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src={profileImage}
                alt="Jeffrey Tseng"
                className="w-48 h-48 rounded-lg object-cover border-4 border-white/20 shadow-2xl"
              />
            </motion.div>
            
            <div className="flex flex-col items-center lg:items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white whitespace-nowrap">Jeffrey Tseng</h1>
              <p className="text-xl text-blue-300">welcome to my portfolio</p>
              
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/jeffrey-tseng-9b3582261/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="https://github.com/jefft72"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://www.instagram.com/jeffrey_tseng_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full lg:flex-1 lg:max-w-2xl"
          >
            <GithubStats />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
