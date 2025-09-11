import React from "react";
import SectionCard from "./SectionCard";

const projects = [];

const Projects: React.FC = () => {
  return (
    <SectionCard>
      <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">
        My Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg shadow-lg bg-slate-100 dark:bg-slate-800/80 transform hover:-translate-y-2 transition-transform duration-300"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {project.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
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
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default Projects;
