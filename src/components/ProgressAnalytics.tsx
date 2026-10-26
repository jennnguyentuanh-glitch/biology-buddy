import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Line, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine,
  Cell
} from 'recharts';
import { Topic, WeeklyScoreData, TopicMasteryData } from '../types';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Target, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

interface ProgressAnalyticsProps {
  topics: Topic[];
  weeklyScores: WeeklyScoreData[];
  masteryData: TopicMasteryData[];
  onSelectTopicToStudy?: (topicNumber: number) => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  topics,
  weeklyScores,
  masteryData,
  onSelectTopicToStudy
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'weekly' | 'topics'>('all');

  // Compute overall aggregate KPI statistics
  const currentWeekScore = weeklyScores[weeklyScores.length - 1]?.score || 0;
  const previousWeekScore = weeklyScores[weeklyScores.length - 2]?.score || 0;
  const scoreDelta = currentWeekScore - previousWeekScore;

  const totalMasteredTopics = masteryData.filter((t) => t.mastered >= 70).length;
  const totalAverageScore = Math.round(
    masteryData.reduce((acc, t) => acc + (t.averageScore || 70), 0) / (masteryData.length || 1)
  );

  const totalQuizzesTaken = weeklyScores.reduce((acc, w) => acc + w.quizzes, 0);

  // Custom Tooltip for Weekly Line Chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as WeeklyScoreData;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800 space-y-1">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
            <span>{data.label}</span>
            <span className="font-mono text-emerald-400 font-bold">{data.score}%</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-400 pt-0.5">
            <span>Quizzes Completed:</span>
            <span className="font-medium text-white">{data.quizzes} tests</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-400">
            <span>Target Benchmark:</span>
            <span className="font-medium text-indigo-300">75% (Grade 9)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Topic Mastery Breakdown Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TopicMasteryData;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800 space-y-1.5 max-w-xs">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
            {data.topicName}
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Mastered:
              </span>
              <span className="font-mono font-bold">{data.mastered}%</span>
            </div>
            <div className="flex items-center justify-between text-indigo-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Learning:
              </span>
              <span className="font-mono font-bold">{data.inProgress}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" /> Unstudied:
              </span>
              <span className="font-mono font-bold">{data.unstudied}%</span>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Average Quiz Score:</span>
            <span className="font-mono font-bold text-white">{data.averageScore}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200">
        {/* Header Strip with Expand/Collapse toggle */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Study Progress & Mastery Analytics
                </h2>
                <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualize quiz score progression over time and syllabus topic mastery breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* View filter tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveMetricTab('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeMetricTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Charts
              </button>
              <button
                onClick={() => setActiveMetricTab('weekly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeMetricTab === 'weekly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly Scores
              </button>
              <button
                onClick={() => setActiveMetricTab('topics')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeMetricTab === 'topics'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Topic Mastery
              </button>
            </div>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
              aria-label={isExpanded ? 'Collapse analytics' : 'Expand analytics'}
              title={isExpanded ? 'Collapse analytics' : 'Expand analytics'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-5 sm:p-6 space-y-6">
            {/* 4 Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Metric 1 */}
              <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Current Quiz Avg</span>
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {currentWeekScore}%
                  </span>
                  <span className={`text-[11px] font-semibold ${scoreDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {scoreDelta >= 0 ? `+${scoreDelta}%` : `${scoreDelta}%`} vs prev
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  IGCSE Grade 9 boundary: 75%
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Topics Mastered</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {totalMasteredTopics} / {topics.length}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {Math.round((totalMasteredTopics / (topics.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  ≥ 70% threshold reached
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Tests Completed</span>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {totalQuizzesTaken}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Across all 5 syllabus modules
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Retention Readiness</span>
                  <Target className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-600 font-mono">
                    {totalAverageScore}%
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    On Track
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Predicted Exam Grade: 8 - 9
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Chart: Quiz Scores Per Week (Line Chart) */}
              {(activeMetricTab === 'all' || activeMetricTab === 'weekly') && (
                <div className={`bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                  activeMetricTab === 'weekly' ? 'lg:col-span-2' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        Quiz Score Trajectory (Per Week)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Weekly average test performance vs. IGCSE target pass line
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        <span className="text-slate-600 font-medium">Your Score</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-b border-dashed border-slate-500" />
                        <span className="text-slate-400 font-medium">Target 75%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Line/Area Chart */}
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={weeklyScores}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke="#94a3b8" 
                          fontSize={11} 
                          tickLine={false}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis 
                          domain={[50, 100]} 
                          ticks={[50, 60, 70, 80, 90, 100]}
                          stroke="#94a3b8" 
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          unit="%"
                        />
                        <Tooltip content={<CustomLineTooltip />} />
                        <ReferenceLine 
                          y={75} 
                          stroke="#94a3b8" 
                          strokeDasharray="4 4" 
                          strokeWidth={1.5}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="none" 
                          fill="url(#scoreGradient)" 
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={2.8}
                          dot={{ r: 4, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Score improved by +{currentWeekScore - weeklyScores[0]?.score || 18}% over the last 6 weeks
                    </span>
                    <span className="text-slate-400">
                      Based on {totalQuizzesTaken} recorded sessions
                    </span>
                  </div>
                </div>
              )}

              {/* Right Chart: Breakdown of Mastered Topics (Bar Chart) */}
              {(activeMetricTab === 'all' || activeMetricTab === 'topics') && (
                <div className={`bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                  activeMetricTab === 'topics' ? 'lg:col-span-2' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        Breakdown of Mastered Topics
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Percentage of subtopics mastered, currently learning, or unstudied
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                        <span className="text-slate-600 font-medium">Mastered</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                        <span className="text-slate-600 font-medium">Learning</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
                        <span className="text-slate-400 font-medium">Unstudied</span>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Stacked Bar Chart */}
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={masteryData}
                        layout="vertical"
                        margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis 
                          type="number" 
                          domain={[0, 100]} 
                          ticks={[0, 25, 50, 75, 100]}
                          stroke="#94a3b8" 
                          fontSize={11}
                          tickLine={false}
                          unit="%"
                        />
                        <YAxis 
                          type="category" 
                          dataKey="shortName" 
                          stroke="#64748b" 
                          fontSize={11} 
                          tickLine={false}
                          axisLine={{ stroke: '#e2e8f0' }}
                          width={110}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="mastered" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="inProgress" stackId="a" fill="#818cf8" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="unstudied" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-slate-600 font-medium">
                      Recommended Focus: <strong className="text-indigo-600">Topic 3 (Plant Physiology)</strong>
                    </span>
                    <span className="text-emerald-700 font-medium">
                      Topic 1 & 2 leading in mastery
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
