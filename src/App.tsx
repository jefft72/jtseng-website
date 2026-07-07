import TopBar from './sections/TopBar';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Stack from './sections/Stack';
import Contact from './sections/Contact';

function App() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
    </>
  );
}

export default App;
