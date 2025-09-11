
import React from 'react';
import SectionCard from './SectionCard';

const Blog: React.FC = () => {
  return (
    <SectionCard>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Blog</h2>
        <p className="text-slate-600 dark:text-slate-300">
          My thoughts on technology, design, and development will be here soon. Stay tuned!
        </p>
        <div className="mt-8 flex justify-center">
            <svg className="w-16 h-16 text-nepal-blue/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </div>
      </div>
    </SectionCard>
  );
};

export default Blog;
