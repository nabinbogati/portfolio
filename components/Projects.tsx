import React, { useState } from "react";
import SectionCard from "./SectionCard";
import Modal from "./Modal";
import { GitHubIcon } from "./icons/GitHubIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";

interface Project {
  title: string;
  description: string;
  detailedDescription: string;
  imageUrl: string;
  tags: string[];
  links: {
    github?: string;
    live?: string;
  };
  type: "professional" | "personal" | "office";
}

const projects: Project[] = [
  {
    title: "Multiplayer Game Backend",
    description:
      "Architected a scalable backend for large-scale online games, ensuring high availability and low latency for thousands of concurrent users.",
    detailedDescription:
      "This project involved designing and implementing a robust backend system capable of handling thousands of concurrent connections for a real-time multiplayer game. The architecture was built using Python and Flask, with a PostgreSQL database for persistent data storage and Redis for caching and managing session data. Key challenges included optimizing network latency, ensuring data consistency, and creating a scalable infrastructure on DigitalOcean to support a growing user base.",
    imageUrl:
      "https://play-lh.googleusercontent.com/98wVaNrNvDGkmz5MwtrHkpNVgtUnKaMSqntl5ZVAMzYR0z4IXADMPN8Rq-3MtvfQ-m6s=w240-h480-rw",
    tags: [
      "Backend",
      "Python",
      "FastAPI",
      "AioHttp",
      "WebSockets",
      "PostgreSQL",
      "Scalability",
    ],
    links: {
      live: "https://play.google.com/store/apps/details?id=io.teslatech.callbreak&hl=en",
    },
    type: "professional",
  },
  {
    title: "Tic-Tac-Toe Game",
    description:
      "A classic Tic-Tac-Toe game implemented in Python, playable in the command line.",
    detailedDescription:
      "A fun personal project to implement the classic game of Tic-Tac-Toe in Python. This project focuses on core programming logic, including game state management, player input handling, and win/draw condition checking. It's a great exercise in fundamental programming concepts and runs entirely in the command-line interface.",
    imageUrl: "./assets/projects/tic-tac-toe.png",
    tags: ["Python", "CLI", "Game"],
    links: {
      github: "https://github.com/nabinbogati/tic-tac-toe",
    },
    type: "personal",
  },
  {
    title: "Dotfiles",
    description:
      "My personal configuration files for tools like bash, vim, and git to streamline my development workflow.",
    detailedDescription:
      "This repository contains my personal 'dotfiles,' which are the configuration files for various command-line tools I use daily, including my shell (Bash), text editor (Vim), and version control system (Git). Maintaining these files in a repository allows me to easily set up my preferred development environment on any new machine and keep my configurations consistent.",
    imageUrl: "./assets/projects/dotfiles.png",
    tags: ["Shell", "Vim", "Config", "Linux"],
    links: {
      github: "https://github.com/nabinbogati/dotfiles",
    },
    type: "personal",
  },
];

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const professionalProjects = projects.filter(
    (p) => p.type === "professional",
  );
  const personalProjects = projects.filter((p) => p.type === "personal");

  const renderProjectCard = (project: Project, index: number) => {
    return (
      <button
        key={index}
        onClick={() => setSelectedProject(project)}
        className="text-left rounded-lg overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800/80 transform hover:-translate-y-2 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue dark:focus:ring-offset-slate-900 w-full"
        aria-label={`View details for ${project.title}`}
      >
        <div className="relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-56 object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {project.title}
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300 h-24">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-semibold text-nepal-blue-dark dark:text-nepal-blue-light bg-nepal-blue/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </button>
    );
  };

  return (
    <>
      <SectionCard>
        {personalProjects.length > 0 && (
          <div className="mb-12">
            <div className="text-center">
              <h3 className="inline-block text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 border-b-2 border-nepal-blue/30 pb-2">
                Personal Projects
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {personalProjects.map(renderProjectCard)}
            </div>
          </div>
        )}

        {professionalProjects.length > 0 && (
          <div>
            <div className="text-center">
              <h3 className="inline-block text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 border-b-2 border-nepal-blue/30 pb-2">
                Professional Projects
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {professionalProjects.map(renderProjectCard)}
            </div>
          </div>
        )}
      </SectionCard>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && (
          <div>
            <img
              src={selectedProject.imageUrl}
              alt={selectedProject.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {selectedProject.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-semibold text-nepal-blue-dark dark:text-nepal-blue-light bg-nepal-blue/10 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {selectedProject.detailedDescription}
            </p>

            <div className="flex items-center justify-center gap-4">
              {selectedProject.links.github && (
                <a
                  href={selectedProject.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900"
                >
                  <GitHubIcon className="w-5 h-5 mr-2" />
                  Source Code
                </a>
              )}
              {selectedProject.links.live && (
                <a
                  href={selectedProject.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nepal-blue hover:bg-nepal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue dark:focus:ring-offset-slate-900"
                >
                  <ExternalLinkIcon className="w-5 h-5 mr-2" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Projects;
