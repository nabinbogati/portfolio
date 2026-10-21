import React, { useEffect, useState } from "react";
import { Section, Theme } from "../types";
import { profile } from "../data/profile";
import { useActiveSection } from "../hooks/useActiveSection";
import ThemeToggle from "./ThemeToggle";
import { MenuIcon } from "./icons/MenuIcon";
import { CloseIcon } from "./icons/CloseIcon";

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const navItems = Object.values(Section);
// "top" is the hero; observing it clears the highlight when scrolled back up.
const observedIds = ["top", ...navItems];

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const activeSection = useActiveSection(observedIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (item: Section) =>
    `font-mono text-sm transition-colors duration-200 ${
      activeSection === item
        ? "text-accent-600 dark:text-accent-400"
        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/80"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          aria-label="Back to top"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 font-mono text-sm font-semibold text-accent-400 transition-transform duration-300 group-hover:scale-105 dark:bg-zinc-800">
            {profile.initials}
          </span>
          <span className="hidden font-mono text-sm text-zinc-900 sm:inline dark:text-white">
            nabin.bogati
          </span>
        </a>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <li key={item}>
                <a href={`#${item}`} className={linkClass(item)}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <span className="mx-3 hidden h-5 w-px bg-zinc-200 md:block dark:bg-zinc-800" />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul id="mobile-menu" className="mx-auto max-w-6xl space-y-1 px-4 pb-4 sm:px-6 md:hidden">
          {navItems.map((item) => (
            <li key={item}>
              <a
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${linkClass(item)}`}
              >
                <span className="text-zinc-400 dark:text-zinc-600">#</span> {item}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Header;
