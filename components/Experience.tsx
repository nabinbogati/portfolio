import React from "react";
import SectionCard from "./SectionCard";

const experiences = [
  {
    role: "Lead Backend Developer",
    company: "Teslatech Pvt.Ltd | Dhobighat, Lalitpur",
    period: "April 2023 – Current",
    description: [
      "Architected and implemented scalable backend systems for large-scale online multiplayer games.",
      "Provided technical leadership and mentorship to a team of 4-5 developers.",
      "Managed and administered VPS environments on DigitalOcean.",
    ],
  },
  {
    role: "Backend Developer",
    company: "Teslatech Pvt.Ltd | Dhobighat, Lalitpur",
    period: "February 2019 – April 2023",
    description: [
      "Designed, developed, and maintained RESTful APIs ensuring scalability and security.",
      "Led the design and efficient management of relational (PostgreSQL) and NoSQL (Redis, MongoDB) databases.",
      "Architected and deployed a resilient publish-subscribe (pub/sub) messaging architecture using Centrifugo.",
      "Developed and maintained automation scripts for routine system administration tasks.",
    ],
  },
  {
    role: "Backend Intern",
    company: "Dryice Pvt.Ltd | Kupondole, Lalitpur",
    period: "July 2018 – January 2019",
    description: [
      "Created automated test cases for web applications.",
      "Built REST API-driven web applications using Django REST Framework.",
      "Developed a web crawler to scrape and compare stock prices from Yahoo Finance.",
    ],
  },
  {
    role: "Cloud Analyst",
    company: "Cloud Factory Nepal | Bakhundole, Lalitpur",
    period: "January 2017 – June 2018",
    description: [
      "Performed data analysis using Excel.",
      "Provided QA assistance.",
    ],
  },
];

const Experience: React.FC = () => {
  return (
    <SectionCard>
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">
        Professional Experience
      </h2>
      <div className="relative border-l-2 border-nepal-blue/30 ml-4">
        {experiences.map((exp, index) => (
          <div key={index} className="mb-10 ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-nepal-blue rounded-full -left-4 ring-4 ring-white dark:ring-slate-900">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="flex items-center mb-1 text-xl font-semibold text-slate-900 dark:text-white">
              {exp.role}
            </h3>
            <p className="text-md font-medium text-nepal-red dark:text-nepal-red-light">
              {exp.company}
            </p>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
              {exp.period}
            </time>
            <ul className="list-disc list-inside space-y-1 text-base font-normal text-gray-600 dark:text-gray-300">
              {exp.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default Experience;
