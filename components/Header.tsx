import React from 'react';
import { Section, Theme } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const navItems = Object.values(Section);

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, theme, toggleTheme }) => {
  return (
    <header className="sticky top-4 z-50">
      <nav className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-xl shadow-lg ring-1 ring-black/5">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo */}
          <div className="flex-initial">
            <button
              onClick={() => setActiveSection(Section.About)}
              className="flex items-center justify-center w-10 h-10 bg-nepal-blue rounded-lg text-white font-bold text-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-900 focus:ring-nepal-blue"
              aria-label="Go to About section"
            >
              NB
            </button>
          </div>
          
          {/* Centered navigation for desktop */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300
                  ${activeSection === item
                    ? 'bg-nepal-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Theme toggle on the right */}
          <div className="flex-initial">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden flex flex-wrap justify-center px-2 pt-2 pb-3 space-x-1">
           {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-all duration-300 mb-1
                  ${activeSection === item
                    ? 'bg-nepal-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                {item}
              </button>
            ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;