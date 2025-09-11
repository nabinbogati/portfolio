
import React from 'react';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl shadow-md p-6 sm:p-8 ring-1 ring-black/5 animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

export default SectionCard;
