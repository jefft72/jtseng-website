import AgentCursor from './components/AgentCursor';
import CommandPalette from './components/CommandPalette';
import DotGrid from './components/DotGrid';
import TopBar from './sections/TopBar';
import Reading from './sections/Reading';
import OffDuty from './sections/OffDuty';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Stack from './sections/Stack';
import Contact from './sections/Contact';

function App() {
  return (
    <>
      <DotGrid />
      <TopBar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Stack />
        <Reading />
        <OffDuty />
        <Contact />
      </main>
      <AgentCursor />
      <CommandPalette />
    </>
  );
}

export default App;
