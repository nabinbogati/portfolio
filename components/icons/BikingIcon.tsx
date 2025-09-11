
import React from 'react';

export const BikingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5"/>
    <circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 17.5h-5.5l1.5-5.5L8 9H5"/>
    <path d="m9 14 3-3 3 3"/>
    <path d="m15 9-3 3"/>
  </svg>
);
