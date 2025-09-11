import React from "react";
import SectionCard from "./SectionCard";
import { LinkedInIcon } from "./icons/LinkedInIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { EmailIcon } from "./icons/EmailIcon";
import { BikingIcon } from "./icons/BikingIcon";
import { HikingIcon } from "./icons/HikingIcon";
import { GamingIcon } from "./icons/GamingIcon";
import { TechIcon } from "./icons/TechIcon";
import { CvIcon } from "./icons/CvIcon";

const skills = [
  "Python",
  "Flask",
  "FastAPI",
  "Async Programming",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Scripting (Bash/Python)",
  "Git",
  "Docker",
];

const hobbies = [
  {
    name: "Biking Adventures",
    icon: <BikingIcon className="w-8 h-8 mx-auto mb-2 text-nepal-blue" />,
  },
  {
    name: "Hiking & Trekking",
    icon: <HikingIcon className="w-8 h-8 mx-auto mb-2 text-nepal-blue" />,
  },
  {
    name: "Online Gaming",
    icon: <GamingIcon className="w-8 h-8 mx-auto mb-2 text-nepal-blue" />,
  },
  {
    name: "Exploring New Tech",
    icon: <TechIcon className="w-8 h-8 mx-auto mb-2 text-nepal-blue" />,
  },
];

const About: React.FC = () => {
  return (
    <SectionCard>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <img
          src={`${import.meta.env.BASE_URL}assets/profile.png`}
          alt="Profile Picture"
          className="w-40 h-40 rounded-full object-cover ring-4 ring-nepal-blue/50"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Nabin Bogati
          </h1>
          <p className="mt-2 text-lg text-nepal-blue dark:text-nepal-blue-light font-semibold">
            Software Developer | Kathmandu, Nepal
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
            <div className="flex items-center space-x-6">
              <a
                href="mailto:nabin31bogati@gmail.com"
                aria-label="Email"
                className="text-slate-500 dark:text-slate-400 hover:text-nepal-red dark:hover:text-nepal-red-light transition-transform duration-300 hover:scale-110"
              >
                <EmailIcon className="w-7 h-7" />
              </a>
              <a
                href="https://np.linkedin.com/in/nabin-bogati-1b0a4a123"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-500 dark:text-slate-400 hover:text-nepal-red dark:hover:text-nepal-red-light transition-transform duration-300 hover:scale-110"
              >
                <LinkedInIcon className="w-7 h-7" />
              </a>
              <a
                href="https://github.com/nabinbogati"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-500 dark:text-slate-400 hover:text-nepal-red dark:hover:text-nepal-red-light transition-transform duration-300 hover:scale-110"
              >
                <GitHubIcon className="w-7 h-7" />
              </a>
            </div>
            <a
              href={`${import.meta.env.BASE_URL}assets/NabinBogati.pdf`}
              download="NabinBogati.pdf"
              aria-label="Download CV"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-nepal-blue hover:bg-nepal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue dark:focus:ring-offset-slate-900 transition-all duration-300 hover:scale-105"
            >
              <CvIcon className="w-5 h-5 mr-2 -ml-1" />
              Download CV
            </a>
          </div>

          <p className="mt-6 text-slate-600 dark:text-slate-300 max-w-2xl">
            Experienced Software Developer with over 5 years of expertise in
            backend development and system operations, with a strong background
            in designing and managing large-scale applications. I am passionate
            about continuous learning, innovation, and making a lasting impact
            through my work.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
          Technical Expertise
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 text-sm font-medium text-nepal-blue-dark dark:text-nepal-blue-light bg-nepal-blue/10 dark:bg-nepal-blue/20 rounded-full shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
          Hobbies & Interests
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {hobbies.map((hobby) => (
            <div
              key={hobby.name}
              className="p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg backdrop-blur-sm"
            >
              {hobby.icon}
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {hobby.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

export default About;
