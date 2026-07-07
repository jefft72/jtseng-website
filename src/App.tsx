import AgentCursor from './components/AgentCursor';
import CommandPalette from './components/CommandPalette';
import KeyboardLayer from './components/KeyboardLayer';
import DotGrid from './components/DotGrid';
import TopBar from './sections/TopBar';
import Reading from './sections/Reading';
import Travel from './sections/Travel';
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
        <Travel />
        <Contact />
      </main>
      <AgentCursor />
      <CommandPalette />
      <KeyboardLayer />
    </>
  );
}

export default App;
