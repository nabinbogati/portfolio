import React, { useState } from "react";
import SectionCard from "./SectionCard";
import Modal from "./Modal";
import { CertificateIcon } from "./icons/CertificateIcon";

const learningItems = [
  "JavaScript, TypeScript & React - Advancing towards full-stack development.",
  "Design Patterns – Learning best practices for scalable system design.",
  "Reading - “The power of now - Eckhart Tolle (Spiritual Growth)”",
];

interface Certification {
  name: string;
  issuer: string;
  date: string;
  imageUrl: string;
  description: string;
}

const certifications: Certification[] = [
  {
    name: "Crash Course on Python",
    issuer: "Google",
    date: "Issued Mar 27, 2020",
    imageUrl: "./assets/certificates/python_crash_course.png",
    description:
      "An introductory course designed by Google to build foundational Python programming skills. Topics include syntax, control flow, data types, functions, loops, and basic error handling. The course emphasizes hands-on coding and prepares learners to write simple programs and automate routine tasks using Python.",
  },
  {
    name: "Using Python to Interact with the Operating System",
    issuer: "",
    date: "Issued Apr 21, 2020",
    imageUrl: "./assets/certificates/python_for_systems.png",
    description:
      "This course focuses on using Python for system-level tasks, including file and directory management, automation with scripts, environment variables, subprocesses, and error handling. Developed by Google, the curriculum emphasizes practical skills for automating administrative tasks and interacting with the underlying operating system through Python.",
  },
  {
    name: "Foundational C# with Microsoft",
    issuer: "FreeCodeCamp.org",
    date: "Issued Jan 19, 2025",
    imageUrl: "./assets/certificates/csharp_fundamentals.png",
    description:
      "This certification demonstrates a fundamental level of C# knowledge. It validates an understanding of the C# framework as described in the Course Guide, including its principles, practices, and rules. It affirms the ability to apply Scrum in real-world situations and guide a team in its adoption.",
  },
];

const Education: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <>
      <SectionCard>
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">
          Academic Qualifications
        </h2>

        <div className="mb-10">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-nepal-blue/20 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                <svg
                  className="w-6 h-6 text-nepal-blue"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12l4 2.222M23 12l-4 2.222M1 12v-1a11.953 11.953 0 0111-11v0a11.953 11.953 0 0111 11v1"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Nagarjuna College of Information Technology
              </h3>
              <p className="text-md text-slate-600 dark:text-slate-300">
                Bachelor in Computer Science and Information Technology
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                November 2014 - December 2018
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="text-center">
            <h3 className="inline-block text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 border-b-2 border-nepal-blue/30 pb-2">
              Current Learning & Development
            </h3>
          </div>
          <ul className="space-y-3">
            {learningItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
              >
                <svg
                  className="w-6 h-6 text-nepal-red flex-shrink-0 mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-slate-700 dark:text-slate-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-center">
            <h3 className="inline-block text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 border-b-2 border-nepal-blue/30 pb-2">
              Certifications
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <button
                key={index}
                onClick={() => setSelectedCert(cert)}
                className="text-left rounded-lg overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800/80 transform hover:-translate-y-2 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue dark:focus:ring-offset-slate-900"
                aria-label={`View details for ${cert.name}`}
              >
                <img
                  src={cert.imageUrl.replace("/800/600", "/400/300")}
                  alt={`${cert.name} certificate`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {cert.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {cert.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)}>
        {selectedCert && (
          <div>
            <img
              src={selectedCert.imageUrl}
              alt={selectedCert.name}
              className="w-full h-auto object-contain rounded-lg mb-4"
            />
            <div className="flex items-start gap-4">
              <CertificateIcon className="w-10 h-10 text-nepal-blue flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedCert.name}
                </h2>
                <p className="text-md font-semibold text-nepal-red dark:text-nepal-red-light">
                  {selectedCert.issuer}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {selectedCert.date}
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {selectedCert.description}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Education;
