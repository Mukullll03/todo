import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  BrainCircuit, 
  Globe, 
  Calculator, 
  Clock, 
  Target,
  Trophy,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  RotateCcw,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  History,
  Info as InfoIcon,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icon mapping for syllabus subjects
const SubjectIcon = ({ icon, className }: { icon: string; className?: string }) => {
  switch (icon) {
    case 'calculator': return <Calculator className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    case 'brain-circuit': return <BrainCircuit className={className} />;
    case 'globe': return <Globe className={className} />;
    default: return null;
  }
};

// Centralized Data Structure based on the SSC 3-Month Plan
const syllabusData = [
  {
    month: 1, title: 'Month 1: Foundation', subtitle: 'Days 1 - 30',
    subjects: [
      { id: 'maths', name: 'Quantitative Aptitude', icon: 'calculator', color: 'text-blue-500', tasks: [
        { id: 'm1-math-1', text: 'Percentages (Days 1-10)' },
        { id: 'm1-math-2', text: 'Ratio & Proportion (Days 11-20)' },
        { id: 'm1-math-3', text: 'Profit, Loss & Discount (Days 21-30)' }
      ]},
      { id: 'english', name: 'English Comprehension', icon: 'book-open', color: 'text-indigo-500', tasks: [
        { id: 'm1-eng-1', text: 'Grammar: Noun, Pronoun, Subject-Verb Agreement' },
        { id: 'm1-eng-2', text: 'Vocab: Daily 10 Idioms/Phrases' },
        { id: 'm1-eng-3', text: 'Vocab: Daily 10 One-Word Substitutions' }
      ]},
      { id: 'reasoning', name: 'General Intelligence', icon: 'brain-circuit', color: 'text-purple-500', tasks: [
        { id: 'm1-rea-1', text: 'Coding-Decoding' },
        { id: 'm1-rea-2', text: 'Analogy' },
        { id: 'm1-rea-3', text: 'Classification (Odd One Out)' }
      ]},
      { id: 'ga', name: 'General Awareness', icon: 'globe', color: 'text-green-500', tasks: [
        { id: 'm1-ga-1', text: 'Polity (Articles, Constitution basics)' },
        { id: 'm1-ga-2', text: 'Static GK (National Parks, Dances, Festivals)' }
      ]}
    ]
  },
  {
    month: 2, title: 'Month 2: Momentum', subtitle: 'Days 31 - 60',
    subjects: [
      { id: 'maths', name: 'Quantitative Aptitude', icon: 'calculator', color: 'text-blue-500', tasks: [
        { id: 'm2-math-1', text: 'Time & Work, Pipes & Cisterns (Days 31-45)' },
        { id: 'm2-math-2', text: 'Simple & Compound Interest (Days 46-60)' }
      ]},
      { id: 'english', name: 'English Comprehension', icon: 'book-open', color: 'text-indigo-500', tasks: [
        { id: 'm2-eng-1', text: 'Grammar: Tenses, Prepositions' },
        { id: 'm2-eng-2', text: 'Reading: Daily 15 mins RC or Cloze Test' }
      ]},
      { id: 'reasoning', name: 'General Intelligence', icon: 'brain-circuit', color: 'text-purple-500', tasks: [
        { id: 'm2-rea-1', text: 'Syllogism' },
        { id: 'm2-rea-2', text: 'Blood Relations' },
        { id: 'm2-rea-3', text: 'Direction & Distance' }
      ]},
      { id: 'ga', name: 'General Awareness', icon: 'globe', color: 'text-green-500', tasks: [
        { id: 'm2-ga-1', text: 'Modern History (Indian National Movement)' },
        { id: 'm2-ga-2', text: 'Current Affairs (Previous 2 months)' }
      ]}
    ]
  },
  {
    month: 3, title: 'Month 3: The 50% Mark', subtitle: 'Days 61 - 90',
    subjects: [
      { id: 'maths', name: 'Quantitative Aptitude', icon: 'calculator', color: 'text-blue-500', tasks: [
        { id: 'm3-math-1', text: 'Speed, Time & Distance, Trains (Days 61-75)' },
        { id: 'm3-math-2', text: 'Average, Mixture & Alligation (Days 76-90)' }
      ]},
      { id: 'english', name: 'English Comprehension', icon: 'book-open', color: 'text-indigo-500', tasks: [
        { id: 'm3-eng-1', text: 'Grammar: Active/Passive Voice' },
        { id: 'm3-eng-2', text: 'Grammar: Direct/Indirect Speech' },
        { id: 'm3-eng-3', text: 'Practice: Mixed Error Spotting' }
      ]},
      { id: 'reasoning', name: 'General Intelligence', icon: 'brain-circuit', color: 'text-purple-500', tasks: [
        { id: 'm3-rea-1', text: 'Number Series & Missing Numbers' },
        { id: 'm3-rea-2', text: 'Non-Verbal Reasoning (Paper folding, Mirror)' }
      ]},
      { id: 'ga', name: 'General Awareness', icon: 'globe', color: 'text-green-500', tasks: [
        { id: 'm3-ga-1', text: 'Geography (Rivers, Mountains, Solar system)' },
        { id: 'm3-ga-2', text: 'Basic Biology' }
      ]}
    ]
  }
];

const dailyTasksList = [
  { id: 'd-live-mock', title: 'Live Mock', duration: '', minutes: 0 },
  { id: 'd-calc', title: 'Calculation - 10 m', duration: '', minutes: 10 },
  { id: 'd-tables', title: 'Tables - 10', duration: '', minutes: 0 },
  { id: 'd-squares', title: 'Squares - 10', duration: '', minutes: 0 },
  { id: 'd-cubes', title: 'Cubes - 10', duration: '', minutes: 0 },
  { id: 'd-grammar', title: '120 Rules of Grammar', duration: '', minutes: 0 },
  { id: 'd-pqrs', title: 'PQRS', duration: '', minutes: 0 },
  { id: 'd-cloze', title: '1 cloze test', duration: '', minutes: 0 },
  { id: 'd-passage', title: '1 Passage', duration: '', minutes: 0 },
  { id: 'd-vocab', title: 'Vocab - 30 m', duration: '', minutes: 30 },
  { id: 'd-editorial', title: 'Editorial', duration: '', minutes: 0 },
  { id: 'd-maths', title: 'Maths', duration: '2 Hours', minutes: 120 },
  { id: 'd-eng', title: 'English', duration: '1.5 Hours', minutes: 90 },
  { id: 'd-rea', title: 'Reasoning & GA', duration: '2.5 Hours', minutes: 150 },
  { id: 'd-rev', title: 'Revision', duration: '30 Mins Daily', minutes: 30 }
];

// New Syllabus Data for Subject-Based View
const subjectSyllabusData = {
  maths: {
    title: 'Maths',
    sections: [
      {
        name: 'Arithmetic',
        items: ['Number System', 'HCF & LCM', 'Simplification', 'Percentage', 'Ratio & Proportion', 'Average', 'Profit Loss & Discount', 'Simple & Compound Interest', 'Time & Work', 'Pipe & Cistern', 'Time Speed & Distance', 'Boat & Stream', 'Mixture & Alligation', 'Partnership']
      },
      {
        name: 'Advance Maths',
        items: ['Algebra', 'Geometry', 'Trigonometry', 'Mensuration (2D & 3D)', 'Coordinate Geometry', 'Height & Distance', 'Data Interpretation']
      }
    ]
  },
  english: {
    title: 'English',
    sections: [
      {
        name: 'Grammar',
        items: ['Parts Of Speech', 'Noun', 'Conjunction', 'Subject - Verb Agreement', 'Noun + Conjunction', 'Verb', 'Question Tag', 'Tense', 'Conditional Sentences', 'Voice', 'Narration', 'Article', 'Preposition', 'Pronoun', 'Adjective', 'Adverb']
      },
      {
        name: 'Vocab',
        items: ['Root Words', 'Confused Words', 'Synonyms & Antonyms through Mnemonics', 'Idioms', 'One Word Substitution', 'Phrasal Verbs', 'Fixed Preposition', 'Spelling Errors', 'Fill in the blank', 'Homonyms']
      }
    ]
  },
  reasoning: {
    title: 'Reasoning',
    sections: [
      {
        name: 'Reasoning',
        items: ['Alphabet Test', 'Coding-Decoding', 'Number Series', 'Alphanumeric Series', 'Analogy', 'Classification / Odd One Out', 'Blood Relations', 'Direction & Distance', 'Order & Ranking', 'Syllogism', 'Venn Diagram', 'Mathematical Operations', 'Clock & Calendar', 'Inequalities', 'Input-Output', 'Data Sufficiency', 'Figure Counting', 'Mirror/Water Image', 'Paper Folding & Cutting', 'Dice & Cube', 'Seating Arrangement', 'Puzzles']
      }
    ]
  },
  gk: {
    title: 'GK - GS',
    sections: [
      {
        name: 'History',
        items: ['Ancient', 'Medieval', 'Modern']
      },
      {
        name: 'Geography',
        items: ['Indian', 'World', 'Physical']
      },
      {
        name: 'Polity',
        items: ['Constitution', 'Articles', 'Amendments', 'Schedules', 'Parliament', 'Judiciary']
      },
      {
        name: 'Economics',
        items: ['Indian Economy', 'Five Year Plans', 'Budget', 'Macro/Micro Basics']
      },
      {
        name: 'General Science',
        items: ['Physics', 'Chemistry', 'Biology']
      },
      {
        name: 'Static GK',
        items: ['National Parks', 'Wildlife Sanctuaries', 'Folk & Classical Dances', 'Festivals', 'Important Days', 'Books & Authors', 'Awards & Honors', 'Sports', 'International Organizations']
      },
      {
        name: 'Current Affairs',
        items: []
      }
    ]
  }
};

export default function App() {
  const [activeSubject, setActiveSubject] = useState<'maths' | 'english' | 'reasoning' | 'gk'>('maths');
  const [activeView, setActiveView] = useState<'syllabus' | 'calendar' | 'insights'>('syllabus');
  
  // Persistence
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sscCompletedTasks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [completedDailyTasks, setCompletedDailyTasks] = useState<string[]>(() => {
    try {
      const savedDaily = localStorage.getItem('sscDailyTasks');
      const lastDate = localStorage.getItem('sscLastResetDate');
      const today = new Date().toDateString();
      if (lastDate !== today) return [];
      return savedDaily ? JSON.parse(savedDaily) : [];
    } catch { return []; }
  });

  const [dailyHistory, setDailyHistory] = useState<Record<string, string[]>>(() => {
    try {
      const savedHistory = localStorage.getItem('sscDailyHistory');
      return savedHistory ? JSON.parse(savedHistory) : {};
    } catch { return {}; }
  });

  const [syllabusHistory, setSyllabusHistory] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('sscSyllabusHistory');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Calendar
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ date: Date, dateStr: string, tasks: string[] } | null>(null);

  // Analytics Filters
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'week' | 'month' | 'allTime'>('month');
  const [analyticsChart, setAnalyticsChart] = useState<'weekly' | 'subject' | 'heatmap'>('weekly');

  // Syncs
  useEffect(() => localStorage.setItem('sscCompletedTasks', JSON.stringify(completedTasks)), [completedTasks]);
  useEffect(() => {
    localStorage.setItem('sscDailyTasks', JSON.stringify(completedDailyTasks));
    localStorage.setItem('sscDailyHistory', JSON.stringify(dailyHistory));
    localStorage.setItem('sscSyllabusHistory', JSON.stringify(syllabusHistory));
    localStorage.setItem('sscLastResetDate', new Date().toDateString());
  }, [completedDailyTasks, dailyHistory, syllabusHistory]);

  // Midnight Reset Logic
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('sscLastResetDate');
      if (lastDate && lastDate !== today) {
        setCompletedDailyTasks([]);
        localStorage.setItem('sscLastResetDate', today);
      }
    }, 60000);
    return () => clearInterval(checkMidnight);
  }, []);

  // Stats & Streaks
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    // Start checking from today (if tasks done) or yesterday
    let checkDate = new Date();
    
    // Check if any tasks were done today
    const todayStr = checkDate.toDateString();
    const hasToday = (dailyHistory[todayStr] && dailyHistory[todayStr].length > 0) || (completedDailyTasks.length > 0);
    
    if (!hasToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    while (true) {
      const dateStr = checkDate.toDateString();
      const tasks = dailyHistory[dateStr] || (dateStr === new Date().toDateString() ? completedDailyTasks : []);
      if (tasks && tasks.length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      // Safety break for older history
      if (streak > 365) break;
    }
    return streak;
  }, [dailyHistory, completedDailyTasks]);

  const { totalTasksCount, completedCount, percentage } = useMemo(() => {
    const total = Object.values(subjectSyllabusData).reduce((acc, subject) => 
      acc + subject.sections.reduce((sectionAcc, section) => sectionAcc + section.items.length, 0), 0
    );
    const completed = completedTasks.length;
    return { totalTasksCount: total, completedCount: completed, percentage: Math.round((completed / total) * 100) };
  }, [completedTasks]);

  // Handlers
  const toggleTask = (id: string) => {
    const today = new Date().toDateString();
    setCompletedTasks(p => {
      const isRemoving = p.includes(id);
      const updated = isRemoving ? p.filter(x => x !== id) : [...p, id];
      
      setSyllabusHistory(h => {
        const dayTasks = h[today] || [];
        const newDayTasks = isRemoving ? dayTasks.filter(x => x !== id) : [...dayTasks, id];
        return { ...h, [today]: newDayTasks };
      });
      
      return updated;
    });
  };

  const toggleDailyTask = (id: string) => {
    const today = new Date().toDateString();
    setCompletedDailyTasks(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setDailyHistory(h => ({ ...h, [today]: updated }));
      return updated;
    });
  };





  // Analytics Helper Functions
  const getWeeklyData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayTasks = syllabusHistory[dateStr] || (dateStr === new Date().toDateString() ? completedTasks : []);
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        tasks: dayTasks.length,
        subjects: new Set(dayTasks.map(id => {
          const task = syllabusData.flatMap(m => m.subjects.flatMap(s => s.tasks)).find(t => t.id === id);
          return syllabusData.flatMap(m => m.subjects).find(s => s.tasks.find(t => t.id === id))?.name || 'Unknown';
        })).size
      });
    }
    return weekData;
  };

  const getMonthlyData = () => {
    const monthData = {};
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      const dayTasks = syllabusHistory[dateStr] || [];
      const weekNum = Math.ceil((date.getDate()) / 7);
      
      if (!monthData[`Week ${weekNum}`]) {
        monthData[`Week ${weekNum}`] = 0;
      }
      monthData[`Week ${weekNum}`] += dayTasks.length;
    }
    
    return Object.entries(monthData).map(([week, tasks]) => ({ week, tasks }));
  };

  const getSubjectBreakdown = () => {
    const subjectMap = {};
    completedTasks.forEach(taskId => {
      const task = syllabusData.flatMap(m => m.subjects.flatMap(s => s.tasks)).find(t => t.id === taskId);
      const subject = syllabusData.flatMap(m => m.subjects).find(s => s.tasks.find(t => t.id === taskId))?.name || 'Unknown';
      subjectMap[subject] = (subjectMap[subject] || 0) + 1;
    });
    return Object.entries(subjectMap).map(([name, value]) => ({ name, value }));
  };

  const getHeatmapData = () => {
    const heatmapData = [];
    for (let i = 83; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayTasks = syllabusHistory[dateStr] || (dateStr === new Date().toDateString() ? completedTasks : []);
      heatmapData.push({
        date: dateStr,
        count: dayTasks.length,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return heatmapData;
  };

  const getStatistics = () => {
    const totalCompleted = completedTasks.length;
    const daysWithTasks = Object.keys(syllabusHistory).filter(date => syllabusHistory[date].length > 0).length;
    const avgPerDay = daysWithTasks > 0 ? Math.round(totalCompleted / daysWithTasks * 10) / 10 : 0;
    const topSubject = getSubjectBreakdown().sort((a, b) => b.value - a.value)[0]?.name || 'N/A';
    
    return {
      totalCompleted,
      streak: currentStreak,
      avgPerDay,
      daysActive: daysWithTasks,
      completionRate: percentage,
      topSubject
    };
  };

  const stats = getStatistics();
  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 border-x border-slate-200 min-h-screen bg-white">
      {/* Navigation Rail / Header */}
      <header className="mb-8 md:mb-12 border-b border-slate-200 pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <img src="/logo.jpg" alt="SSC To-Do Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shadow-lg shadow-indigo-200 object-cover" />
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 font-display">SSC TO <span className="text-indigo-600">- DO</span></h1>
            </div>
            <p className="text-slate-500 max-w-md text-base md:text-lg font-medium leading-relaxed">
              Plan daily, master SSC. Your smart study companion for systematic excellence.
            </p>
          </div>
          
          {/* Progress Stats Card */}
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl border-slate-200 shadow-xl shadow-slate-100 w-full md:w-auto md:min-w-fit">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              {/* Circular Progress */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray={226} strokeDashoffset={226 - (226 * percentage) / 100}
                    className="text-indigo-600 transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-900">{percentage}%</div>
              </div>
              
              {/* Stats Info */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Overall Progress</p>
                <p className="text-lg md:text-xl font-black text-slate-900">{completedCount} of {totalTasksCount} topics mastered</p>
                {currentStreak > 0 && (
                  <span className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-black">
                    <Flame size={12} fill="currentColor" /> {currentStreak} Day Streak
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Daily & Views */}
        <div className="lg:col-span-3 space-y-6 md:space-y-8">
          <section className="bg-slate-50 p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-slate-100">
            <h2 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
              <Clock size={14} /> Daily Blueprint
            </h2>
            
            {/* Daily Checklist at the top */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Tasks</p>
              <div className="space-y-2">
                {dailyTasksList.slice(0, 11).map(task => {
                  const done = completedDailyTasks.includes(task.id);
                  return (
                    <button 
                      key={task.id}
                      onClick={() => toggleDailyTask(task.id)}
                      className={`w-full text-left p-2 md:p-3 rounded-lg md:rounded-xl border transition-all flex items-start gap-2 group
                        ${done ? 'bg-white border-transparent opacity-60' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md'}`}
                    >
                      <div className={`mt-0.5 ${done ? 'text-green-500' : 'text-slate-300 group-hover:text-indigo-500'}`}>
                        {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-bold text-xs md:text-sm leading-tight ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Study */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Main Study</p>
            <div className="space-y-2">
              {dailyTasksList.slice(11).map(task => {
                const done = completedDailyTasks.includes(task.id);
                return (
                  <button 
                    key={task.id}
                    onClick={() => toggleDailyTask(task.id)}
                    className={`w-full text-left p-2 md:p-3 rounded-lg md:rounded-xl border transition-all flex items-start gap-2 group
                      ${done ? 'bg-white border-transparent opacity-60' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md'}`}
                    >
                      <div className={`mt-0.5 ${done ? 'text-green-500' : 'text-slate-300 group-hover:text-indigo-500'}`}>
                        {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-bold text-xs md:text-sm leading-tight ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                        <p className="text-[9px] md:text-[10px] text-slate-500 font-medium">{task.duration}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </section>

          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {[
              { id: 'syllabus', icon: LayoutDashboard, label: 'Course' },
              { id: 'calendar', icon: Calendar, label: 'History' },
              { id: 'insights', icon: Trophy, label: 'Stats' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap md:whitespace-normal
                  ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 bg-white md:bg-transparent border border-slate-100 md:border-0'}`}
              >
                <item.icon size={18} /> <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Col: Content Area */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeView === 'syllabus' && (
              <motion.div 
                key="syllabus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Subject Tabs */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit max-w-full overflow-x-auto scrollbar-hide">
                  {[
                    { key: 'maths', label: 'Maths' },
                    { key: 'english', label: 'English' },
                    { key: 'reasoning', label: 'Reasoning' },
                    { key: 'gk', label: 'GK - GS' }
                  ].map(tab => (
                    <button 
                      key={tab.key}
                      onClick={() => setActiveSubject(tab.key as any)}
                      className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap
                        ${activeSubject === tab.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center px-1">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 font-display">Syllabus</h2>
                    <p className="text-xs md:text-slate-500 font-medium">Master each topic systematically</p>
                  </div>
                </div>

                {/* Syllabus Card with Interactive Checkboxes */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="bg-slate-50 px-6 py-6 border-b border-slate-200 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-800">{subjectSyllabusData[activeSubject].title} Syllabus</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {subjectSyllabusData[activeSubject].sections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-3">
                          <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <div className="w-1 h-6 bg-indigo-600 rounded-full" />
                            {section.name}
                          </h4>
                          <div className="space-y-2 pl-4">
                            {section.items.map((item, itemIdx) => {
                              const taskId = `${activeSubject}-${sectionIdx}-${itemIdx}`;
                              const done = completedTasks.includes(taskId);
                              return (
                                <div 
                                  key={taskId}
                                  className={`group flex items-center gap-3 p-3 rounded-lg transition-all bg-slate-50/50 hover:bg-slate-100 cursor-pointer
                                    ${done ? 'opacity-60' : ''}`}
                                  onClick={() => toggleTask(taskId)}
                                >
                                  <div className={`flex-shrink-0 ${done ? 'text-green-500' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                                    {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                  </div>
                                  <span className={`text-sm font-medium text-slate-700 ${done ? 'line-through text-slate-400 font-normal' : ''}`}>{item}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'calendar' && (
              <motion.div 
                key="calendar"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h2 className="text-2xl font-black text-slate-900 font-display flex items-center gap-3">
                    <CalendarDays className="text-indigo-600" /> STREAK CALENDAR
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => setCalendarDate(new Date())}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                    >
                      Jump to Today
                    </button>
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                      <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="text-slate-400 hover:text-slate-900 transition-colors"><ChevronLeft size={20} /></button>
                      <span className="font-black text-sm uppercase tracking-widest text-slate-600 w-32 text-center select-none">
                        {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center mr-2">Quick Jump:</span>
                  {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + offset);
                    const label = date.toLocaleString('default', { month: 'short' });
                    const isActive = calendarDate.getMonth() === date.getMonth() && calendarDate.getFullYear() === date.getFullYear();
                    return (
                      <button
                        key={offset}
                        onClick={() => setCalendarDate(new Date(date.getFullYear(), date.getMonth(), 1))}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap
                          ${isActive ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                      >
                        {label} {date.getFullYear()}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-7 gap-1.5 md:gap-3">
                  {['S','M','T','W','T','F','S'].map((d, i) => <div key={`${d}-${i}`} className="text-center text-[10px] md:text-xs font-black text-slate-400 py-2 md:py-4 uppercase tracking-tighter">{d}</div>)}
                  {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, i) => <div key={i} />)}
                  {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                    const dateStr = date.toDateString();
                    const isToday = dateStr === new Date().toDateString();
                    const tasks = dailyHistory[dateStr] || (isToday ? completedDailyTasks : []);
                    const syllabusTasks = syllabusHistory[dateStr] || [];
                    const level = tasks.length;

                    return (
                      <button 
                        key={day}
                        onClick={() => setSelectedDayDetail({ date, dateStr, tasks, syllabusTasks } as any)}
                        className={`aspect-square rounded-lg md:rounded-2xl border-2 flex items-center justify-center font-bold text-sm md:text-lg transition-all relative group
                          ${isToday ? 'border-indigo-600' : 'border-transparent'}
                          ${level === 4 ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 
                            level === 3 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100' :
                            level > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-300 hover:border-slate-200'}`}
                      >
                        {day}
                        {level > 0 && <div className="absolute top-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/40" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 md:mt-8 flex flex-wrap gap-4 md:gap-6 items-center text-[10px] md:text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white border border-slate-200" /> Missed</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-100" /> Started</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> Mastered</span>
                </div>
              </motion.div>
            )}

            {activeView === 'insights' && (
              <motion.div 
                key="insights"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-8"
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Completed</p>
                    <p className="text-2xl md:text-3xl font-black text-indigo-600">{stats.totalCompleted}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">tasks done</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Streak</p>
                    <p className="text-2xl md:text-3xl font-black text-orange-500 flex items-center gap-1">{stats.streak} <Flame size={20} /></p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">days</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Per Day</p>
                    <p className="text-2xl md:text-3xl font-black text-cyan-500">{stats.avgPerDay}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">tasks</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Days</p>
                    <p className="text-2xl md:text-3xl font-black text-emerald-500">{stats.daysActive}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">studied</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Completion</p>
                    <p className="text-2xl md:text-3xl font-black text-purple-500">{stats.completionRate}%</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">overall</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Subject</p>
                    <p className="text-sm md:text-base font-black text-slate-900 line-clamp-2">{stats.topSubject}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">most studied</p>
                  </div>
                </div>

                {/* Chart Controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg md:text-xl font-black text-slate-900">Study Patterns</h3>
                    <div className="flex flex-wrap gap-2">
                      {['weekly', 'subject', 'heatmap'].map(type => (
                        <button
                          key={type}
                          onClick={() => setAnalyticsChart(type as any)}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm uppercase tracking-widest transition-all ${
                            analyticsChart === type 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {type === 'weekly' ? 'Weekly' : type === 'subject' ? 'By Subject' : 'Heatmap'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Charts */}
                  {analyticsChart === 'weekly' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getWeeklyData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="tasks" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {analyticsChart === 'subject' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getSubjectBreakdown()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} (${value})`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getSubjectBreakdown().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}

                  {analyticsChart === 'heatmap' && (
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-7 gap-1.5 min-w-max">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="w-12 text-center text-[10px] font-bold text-slate-400 uppercase mb-3">{day}</div>
                        ))}
                        {getHeatmapData().map((data, idx) => {
                          const maxTasks = Math.max(...getHeatmapData().map(d => d.count));
                          const intensity = data.count === 0 ? 0 : Math.ceil((data.count / maxTasks) * 4);
                          const colors = ['bg-slate-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-800'];
                          return (
                            <div
                              key={idx}
                              title={`${data.displayDate}: ${data.count} tasks`}
                              className={`w-12 h-12 rounded-lg ${colors[intensity]} border border-slate-200 cursor-help transition-all hover:scale-110`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Monthly Overview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4">Last 30 Days</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getMonthlyData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                      <Line type="monotone" dataKey="tasks" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>



      {/* Day Details Modal */}
      <AnimatePresence>
        {selectedDayDetail && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDayDetail(null)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="relative bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{selectedDayDetail.date.toLocaleDateString(undefined, { weekday:'long', month:'short', day:'numeric' })}</h3>
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest">Performance Snapshot</p>
                  {(selectedDayDetail as any).tasks.length > 0 && (
                    <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                      <Clock size={10} /> {Math.round((selectedDayDetail as any).tasks.reduce((acc: number, id: string) => {
                        const task = dailyTasksList.find(t => t.id === id);
                        return acc + (task?.minutes || 0);
                      }, 0) / 60 * 10) / 10}h
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Daily Routine</p>
                    <div className="space-y-2">
                      {dailyTasksList.map(t => {
                        const done = selectedDayDetail.tasks.includes(t.id);
                        return (
                          <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${done ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                            {done ? <CheckCircle2 className="text-green-500" size={20} /> : <Circle className="text-slate-300" size={20} />}
                            <div className="flex flex-col">
                              <span className={`font-bold text-sm transition-all ${done ? 'text-green-900' : 'text-slate-500'}`}>{t.title}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{t.duration}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {(selectedDayDetail as any).syllabusTasks && (selectedDayDetail as any).syllabusTasks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                         <BookOpen size={10} /> Syllabus Progress
                      </p>
                      <div className="space-y-1">
                        {(selectedDayDetail as any).syllabusTasks.map((taskId: string) => {
                          const taskName = syllabusData.flatMap(m => m.subjects.flatMap(s => s.tasks)).find(t => t.id === taskId)?.text;
                          return (
                            <div key={taskId} className="flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-100/50 rounded-lg">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              <span className="text-xs font-bold text-indigo-900 line-clamp-1">{taskName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button onClick={() => setSelectedDayDetail(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Close Insight</button>
                </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      <style>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
