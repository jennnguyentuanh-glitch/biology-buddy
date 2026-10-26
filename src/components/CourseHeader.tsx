import React from 'react';

export const CourseHeader: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
        Biology Buddy
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
        Edexcel & Cambridge Aligned
      </p>
    </div>
  );
};
