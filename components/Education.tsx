import React, { useState } from "react";
import Section from "./Section";
import Modal from "./Modal";
import { Section as SectionId } from "../types";
import { certifications, education, Certification } from "../data/profile";
import { formatYearMonth } from "../lib/time";
import { CertificateIcon } from "./icons/CertificateIcon";

const Education: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <>
      <Section id={SectionId.Education} title="Education & certifications">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="spotlight rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-600 dark:text-accent-400">
              Degree
            </p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">
              {education.degree}
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{education.school}</p>
            <p className="mt-1 text-sm text-zinc-500">{education.location}</p>
            <p className="mt-4 font-mono text-xs text-zinc-500">
              {formatYearMonth(education.start)} – {formatYearMonth(education.end)}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-2">
            {certifications.map((cert) => (
              <button
                key={cert.name}
                onClick={() => setSelectedCert(cert)}
                className="group flex flex-col overflow-hidden spotlight rounded-2xl border border-zinc-200 bg-white text-left transition-colors hover:border-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                aria-label={`View certificate: ${cert.name}`}
              >
                <div className="overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                  <img
                    src={cert.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-sm font-semibold leading-snug text-zinc-900 dark:text-white">
                    {cert.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{cert.issuer}</p>
                  <p className="mt-auto pt-3 font-mono text-xs text-zinc-500">{cert.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)}>
        {selectedCert && (
          <div>
            <img
              src={selectedCert.imageUrl}
              alt={`${selectedCert.name} certificate`}
              className="mb-6 h-auto w-full rounded-lg object-contain"
            />
            <div className="flex items-start gap-4">
              <CertificateIcon className="mt-1 h-8 w-8 flex-shrink-0 text-accent-600 dark:text-accent-400" />
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {selectedCert.name}
                </h2>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  {selectedCert.issuer}
                </p>
                <p className="mb-4 font-mono text-xs text-zinc-500">{selectedCert.date}</p>
              </div>
            </div>
            <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
              {selectedCert.description}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Education;
