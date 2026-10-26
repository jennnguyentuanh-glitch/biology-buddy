import React, { useState } from 'react';
import { Topic, Subtopic, Mode } from '../types';
import { ChevronDown, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';

interface TopicAccordionProps {
  topics: Topic[];
  activeMode: Mode;
  onSelectSubtopic: (subtopic: Subtopic) => void;
  loadingSubtopicId: string | null;
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({
  topics,
  activeMode,
  onSelectSubtopic,
  loadingSubtopicId
}) => {
  // Default open first 2 units
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-2': true,
    'unit-3': false,
    'unit-4': false,
    'unit-5': false,
    'unit-6': false
  });

  const toggleTopic = (topicId: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-3">
      {topics.map((topic) => {
        const isOpen = openTopics[topic.id] ?? false;

        return (
          <div
            key={topic.id}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
          >
            {/* Topic Header Row */}
            <button
              onClick={() => toggleTopic(topic.id)}
              className="w-full text-left px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div className="text-slate-400 dark:text-slate-500">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                  {topic.title}
                </h2>
              </div>

              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                {topic.subtopics.length} chapters
              </span>
            </button>

            {/* Expanded Content: Simple Text Rows */}
            {isOpen && (
              <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {topic.subtopics.map((subtopic) => {
                  const isLoading = loadingSubtopicId === subtopic.id;

                  return (
                    <div
                      key={subtopic.id}
                      onClick={() => onSelectSubtopic(subtopic)}
                      className="group px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectSubtopic(subtopic);
                        }
                      }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 w-5">
                          {subtopic.code}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {subtopic.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500 dark:text-slate-400" />
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                            <span className="capitalize">{activeMode}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
