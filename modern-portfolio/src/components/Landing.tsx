import React from 'react';
import profileImage from '/src/assets/DSC08402.jpeg';
import Typewriter from './Typewriter';
import GithubStats from './GithubStats.tsx';

const Landing: React.FC = () => {
  const workingOn = 'Leading full-stack teams at Hack the Future';
  return (
    <section className="snap-section">
      <div className="container mx-auto px-6 h-screen flex items-center">
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Avatar */}
          <div className="flex items-center justify-center">
            <img
              src={profileImage}
              alt="Avatar"
              className="w-48 h-48 rounded-md object-cover border border-slate-600 shadow-2xl"
            />
          </div>

          {/* Typewriter text */}
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-5xl font-bold text-white mb-4">Jeffrey Tseng</h1>
            <Typewriter text="welcome to my portfolio" speed={40} className="text-xl text-baby" />
          </div>

          {/* Charts */}
          <div className="flex items-center">
            <div className="w-full">
              <div className="mb-4">
                <div className="text-white font-semibold">Development activity</div>
                <div className="text-gray-400 text-sm">Currently working on: <span className="text-baby">{workingOn}</span></div>
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
