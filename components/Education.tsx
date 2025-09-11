import React from 'react';
import SectionCard from './SectionCard';

const learningItems = [
  "JavaScript, TypeScript & React - Advancing towards full-stack development.",
  "Design Patterns – Learning best practices for scalable system design.",
  "Reading - “The power of now - Eckhart Tolle (Spiritual Growth)”"
];

const Education: React.FC = () => {
  return (
    <SectionCard>
      <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">Education & Learning</h2>
      
      <div className="mb-10">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-nepal-blue/20 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                    <svg className="w-6 h-6 text-nepal-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12l4 2.222M23 12l-4 2.222M1 12v-1a11.953 11.953 0 0111-11v0a11.953 11.953 0 0111 11v1" /></svg>
                </div>
            </div>
            <div className="ml-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Nagarjuna College of Information Technology</h3>
                <p className="text-md text-slate-600 dark:text-slate-300">Bachelor in Computer Science and Information Technology</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">November 2014 - December 2018</p>
            </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">Ongoing Learning & Development</h3>
        <ul className="space-y-3 max-w-2xl mx-auto">
          {learningItems.map((item, index) => (
             <li key={index} className="flex items-start p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <svg className="w-6 h-6 text-nepal-red flex-shrink-0 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-slate-700 dark:text-slate-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

    </SectionCard>
  );
};

export default Education;
