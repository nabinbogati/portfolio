import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import Header from './components/Header';
import NeuralNet from './components/NeuralNet';
import Hero from './components/Hero';
import Work from './components/Work';
import Agents from './components/Agents';
import About from './components/About';
import Projects from './components/Projects';
import Now from './components/Now';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import { usePageEffects } from './hooks/usePageEffects';

const App: React.FC = () => {
  usePageEffects();

  // index.html sets the initial class before first paint; start from it.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains(Theme.Dark) ? Theme.Dark : Theme.Light,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === Theme.Light ? Theme.Dark : Theme.Light);
    root.classList.add(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the theme still applies.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  };

  return (
    <div className="isolate min-h-screen font-sans">
      <NeuralNet />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Work />
        <Agents />
        <Projects />
        <Now />
        <About />
        <Experience />
        <Education />
        <Contact />
      </main>
    </div>
  );
};

export default App;
