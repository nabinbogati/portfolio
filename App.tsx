import React, { useState, useEffect } from 'react';
// 1. ADD THIS IMPORT
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import { Theme, Section } from './types';
import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Education from './components/Education';
// 2. IMPORT YOUR NEW COMPONENT
import Privacy from './components/PrivacyPolicy'; 

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    /* ... keep your existing theme logic ... */
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme && Object.values(Theme).includes(storedTheme)) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return Theme.Dark;
    }
    return Theme.Light;
  });

  const [activeSection, setActiveSection] = useState<Section>(Section.About);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === Theme.Light ? Theme.Dark : Theme.Light);
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  };
  
  const renderSection = () => {
    switch (activeSection) {
      case Section.About: return <About />;
      case Section.Experience: return <Experience />;
      case Section.Projects: return <Projects />;
      case Section.Education: return <Education />;
      case Section.Blog: return <Blog />;
      default: return <About />;
    }
  };

  // 3. UPDATE THE RETURN STATEMENT
  return (
    <Router>
      <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans antialiased">
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Header 
                activeSection={activeSection} 
                setActiveSection={setActiveSection}
                theme={theme}
                toggleTheme={toggleTheme}
              />
              <main className="mt-8">
                {renderSection()}
              </main>
            </div>
          } />doti

          {/* 4. ADD THE PRIVACY ROUTE */}
          <Route path="/connecting-dots/privacy-policy" element={
            <div className="max-w-6xl mx-auto px-4 py-8">
               <Privacy />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;