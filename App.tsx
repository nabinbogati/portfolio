import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import Projects from './components/Projects';
import Now from './components/Now';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';

const App: React.FC = () => {
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
    <div className="min-h-screen font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Work />
        <About />
        <Projects />
        <Now />
        <Experience />
        <Education />
        <Contact />
      </main>
    </div>
  );
};

export default App;
