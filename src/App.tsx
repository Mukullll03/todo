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
  Sparkles,
  Loader2,
  Brain,
  Layers,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Wand2,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  History,
  Info as InfoIcon,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  { id: 'd-maths', title: 'Maths', duration: '2 Hours', minutes: 120 },
  { id: 'd-eng', title: 'English', duration: '1.5 Hours', minutes: 90 },
  { id: 'd-rea', title: 'Reasoning & GA', duration: '2.5 Hours', minutes: 150 },
  { id: 'd-rev', title: 'Revision', duration: '30 Mins Daily', minutes: 30 }
];

export default function App() {
  const [activeMonth, setActiveMonth] = useState(1);
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

  // AI States
  const [aiModal, setAiModal] = useState<{ type: 'tutor' | 'simplify' | 'mnemonics' | 'flashcards' | 'mock', topic?: string, subject?: string, tasks?: any[] } | null>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [mockSubmitted, setMockSubmitted] = useState(false);
  const [mockCurrentIndex, setMockCurrentIndex] = useState(0);

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
    const total = syllabusData.reduce((acc, m) => acc + m.subjects.reduce((sa, s) => sa + s.tasks.length, 0), 0);
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

  // AI Feature Handlers
  const handleAiAction = async (type: any, params: any) => {
    setAiModal({ type, ...params });
    setIsAiLoading(true);
    setAiResponse(null);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setMockAnswers({});
    setMockSubmitted(false);
    setMockCurrentIndex(0);

    try {
      let prompt = "";
      let responseFormat: "text" | "json" = "text";

      switch(type) {
        case 'tutor':
          prompt = `You are an expert SSC tutor. Provide a concise summary of key concepts for "${params.topic}". Then provide 1 relevant practice question with an answer. Format with clear headings.`;
          break;
        case 'simplify':
          prompt = `Explain "${params.topic}" like I'm 5. Use a real-world analogy. Mix easy English and Roman Hindi (Hinglish) for relatability. Keep it short.`;
          break;
        case 'mnemonics':
          prompt = `Create 3-5 catchy mnemonics or memory tricks for these topics in ${params.subject}: ${params.tasks.map((t:any) => t.text).join(', ')}.`;
          break;
        case 'flashcards':
          prompt = `Create 5 study flashcards for ${params.subject} on topics: ${params.tasks.map((t:any) => t.text).join(', ')}. Return valid JSON array of objects with "front" and "back" keys only, no markdown formatting.`;
          responseFormat = "json";
          break;
        case 'mock':
          const mockTopics = syllabusData.flatMap(m => m.subjects.flatMap(s => s.tasks)).filter(t => completedTasks.includes(t.id)).map(t => t.text);
          if (mockTopics.length === 0) {
            setAiResponse("Please complete at least one topic to generate a mock test!");
            setIsAiLoading(false);
            return;
          }
          prompt = `Generate a 5-question multiple choice mock test based on these studied topics: ${mockTopics.slice(-10).join(', ')}. Each question must have 4 options and 1 correct answer index (0-3). Return a JSON array of objects with question, options (array of 4 strings), correctIndex (number 0-3), and explanation fields.`;
          responseFormat = "json";
          break;
      }

      const response = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, responseFormat })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (responseFormat === "json") {
        setAiResponse(data.content);
      } else {
        setAiResponse(data.content);
      }
    } catch (error) {
      console.error(error);
      setAiResponse("Something went wrong with the AI service. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const activeMonthData = syllabusData.find(m => m.month === activeMonth)!;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 border-x border-slate-200 min-h-screen bg-white">
      {/* Navigation Rail / Header */}
      <header className="mb-8 md:mb-12 border-b border-slate-200 pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Target size={24} className="md:w-7 md:h-7" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 font-display">SSC MASTERY <span className="text-indigo-600">180</span></h1>
            </div>
            <p className="text-slate-500 max-w-md text-base md:text-lg font-medium leading-relaxed">
              Your intelligent companion for the 180-day challenge. Designed for precision, powered by AI.
            </p>
          </div>
          
          <div className="glass p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border-slate-200 shadow-xl shadow-slate-100 flex items-center gap-4 md:gap-6 w-full md:w-auto min-w-0 md:min-w-[280px]">
            <div className="relative w-20 h-20">
               <svg className="w-20 h-20 transform -rotate-90">
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                   strokeDasharray={226} strokeDashoffset={226 - (226 * percentage) / 100}
                   className="text-indigo-600 transition-all duration-1000 ease-out" 
                 />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-900">{percentage}%</div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Growth</p>
                {currentStreak > 0 && (
                  <span className="flex items-center gap-0.5 bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                    <Flame size={10} fill="currentColor" /> {currentStreak}D STREAK
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-slate-900">{completedCount} <span className="text-slate-400 text-lg">/ {totalTasksCount}</span></p>
              <button 
                onClick={() => handleAiAction('mock', {})}
                className="mt-1 flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform"
              >
                Launch Mock Test <ChevronRight size={12} />
              </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {dailyTasksList.map(task => {
                const done = completedDailyTasks.includes(task.id);
                return (
                  <button 
                    key={task.id}
                    onClick={() => toggleDailyTask(task.id)}
                    className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all flex items-start gap-3 group
                      ${done ? 'bg-white border-transparent opacity-60' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md'}`}
                  >
                    <div className={`mt-0.5 ${done ? 'text-green-500' : 'text-slate-300 group-hover:text-indigo-500'}`}>
                      {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm md:text-base leading-tight ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                      <p className="text-[10px] md:text-xs text-slate-500 font-medium">{task.duration}</p>
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
                {/* Month Tabs */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit max-w-full overflow-x-auto scrollbar-hide">
                  {syllabusData.map(m => (
                    <button 
                      key={m.month}
                      onClick={() => setActiveMonth(m.month)}
                      className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap
                        ${activeMonth === m.month ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {m.title.split(':')[0]}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center px-1">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 font-display">{activeMonthData.title}</h2>
                    <p className="text-xs md:text-slate-500 font-medium">{activeMonthData.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeMonthData.subjects.map(subject => (
                    <div key={subject.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-3 font-bold text-slate-800">
                          <SubjectIcon icon={subject.icon} className={`w-5 h-5 ${subject.color}`} /> {subject.name}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleAiAction('mnemonics', { subject: subject.name, tasks: subject.tasks })} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="Memory Tricks"><Lightbulb size={18} /></button>
                          <button onClick={() => handleAiAction('flashcards', { subject: subject.name, tasks: subject.tasks })} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="Flashcards"><Layers size={18} /></button>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        {subject.tasks.map(task => {
                          const done = completedTasks.includes(task.id);
                          return (
                            <div 
                              key={task.id}
                              className={`group flex items-center justify-between p-3 rounded-xl transition-all hover:bg-slate-50 cursor-pointer
                                ${done ? 'opacity-60' : ''}`}
                              onClick={() => toggleTask(task.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`${done ? 'text-green-500' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                                  {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                </div>
                                <span className={`font-semibold text-slate-700 ${done ? 'line-through text-slate-400 font-normal' : ''}`}>{task.text}</span>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); handleAiAction('simplify', { topic: task.text }); }} className="p-1.5 hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 rounded-lg"><Wand2 size={16} /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleAiAction('tutor', { topic: task.text }); }} className="p-1.5 hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 rounded-lg"><Sparkles size={16} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
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
              <motion.div key="insights" className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Trophy size={48} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">Achievement Insight Tracking Coming Soon</h3>
                <p className="text-slate-400 max-w-xs mx-auto">We're analyzing your study patterns to give you deep insights into your learning velocity.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* AI Modal Overlay */}
      <AnimatePresence>
        {aiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiModal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 md:px-8 py-4 md:py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-lg">
                    {aiModal.type === 'tutor' && <Sparkles size={18} className="md:w-5 md:h-5" />}
                    {aiModal.type === 'mock' && <Brain size={18} className="md:w-5 md:h-5" />}
                    {aiModal.type === 'flashcards' && <Layers size={18} className="md:w-5 md:h-5" />}
                    {aiModal.type === 'mnemonics' && <Lightbulb size={18} className="md:w-5 md:h-5" />}
                    {aiModal.type === 'simplify' && <Wand2 size={18} className="md:w-5 md:h-5" />}
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-xl uppercase tracking-tight text-slate-900 font-display">
                      {aiModal.type === 'tutor' && 'AI Context Tutor'}
                      {aiModal.type === 'mock' && 'Adaptive Mock Test'}
                      {aiModal.type === 'flashcards' && 'Intelligent Cards'}
                      {aiModal.type === 'mnemonics' && 'Memory Matrix'}
                      {aiModal.type === 'simplify' && 'Simplifier (ELI5)'}
                    </h3>
                    <p className="text-[10px] md:text-sm font-semibold text-slate-500 line-clamp-1">{aiModal.topic || aiModal.subject || 'Strategic Challenge'}</p>
                  </div>
                </div>
                <button onClick={() => setAiModal(null)} className="p-2 md:p-3 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"><X size={18} /></button>
              </div>

              {/* Content */}
              <div className="p-5 md:p-8 max-h-[70vh] overflow-y-auto">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Synchronizing Intelligence...</p>
                  </div>
                ) : aiModal.type === 'flashcards' ? (
                  <div className="flex flex-col items-center gap-8 py-8">
                    <motion.div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className={`relative w-full h-64 cursor-pointer group`}
                      style={{ perspective: '1000px' }}
                    >
                      <motion.div 
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="w-full h-full"
                      >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center p-8 text-center shadow-sm group-hover:border-indigo-200 transition-colors">
                          <span className="absolute top-6 left-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</span>
                          <p className="text-2xl font-black text-slate-900 leading-tight">{aiResponse[flashcardIndex]?.front}</p>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[2rem] border-2 border-indigo-500 flex flex-col items-center justify-center p-8 text-center text-white shadow-xl">
                          <span className="absolute top-6 left-8 text-[10px] font-black text-indigo-200 uppercase tracking-widest">Answer</span>
                          <p className="text-2xl font-bold leading-relaxed">{aiResponse[flashcardIndex]?.back}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                    <div className="flex items-center gap-6">
                      <button onClick={() => { setFlashcardIndex(i => Math.max(0, i-1)); setIsFlipped(false); }} disabled={flashcardIndex === 0} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl disabled:opacity-30 transition-colors"><ArrowLeft size={24} /></button>
                      <span className="font-black text-slate-400 uppercase text-xs tracking-tighter">Card {flashcardIndex + 1} of {aiResponse.length}</span>
                      <button onClick={() => { setFlashcardIndex(i => Math.min(aiResponse.length-1, i+1)); setIsFlipped(false); }} disabled={flashcardIndex === aiResponse.length - 1} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl disabled:opacity-30 transition-colors"><ArrowRight size={24} /></button>
                    </div>
                  </div>
                ) : aiModal.type === 'mock' && Array.isArray(aiResponse) ? (
                  <div className="space-y-8 py-4">
                    {!mockSubmitted ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {mockCurrentIndex + 1} of {aiResponse.length}</span>
                          <div className="flex gap-1">
                            {aiResponse.map((_, i) => (
                              <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i === mockCurrentIndex ? 'bg-indigo-600' : mockAnswers[i] !== undefined ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                            ))}
                          </div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 leading-tight">{aiResponse[mockCurrentIndex].question}</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {aiResponse[mockCurrentIndex].options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => setMockAnswers({ ...mockAnswers, [mockCurrentIndex]: idx })}
                              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group
                                ${mockAnswers[mockCurrentIndex] === idx ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                                ${mockAnswers[mockCurrentIndex] === idx ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'}`}>
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className={`font-bold ${mockAnswers[mockCurrentIndex] === idx ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between gap-4 pt-4">
                          <button 
                            disabled={mockCurrentIndex === 0}
                            onClick={() => setMockCurrentIndex(i => i - 1)}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 transition-all hover:bg-slate-200"
                          >
                            Previous
                          </button>
                          {mockCurrentIndex === aiResponse.length - 1 ? (
                            <button 
                              disabled={Object.keys(mockAnswers).length < aiResponse.length}
                              onClick={() => setMockSubmitted(true)}
                              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                            >
                              Finish Test
                            </button>
                          ) : (
                            <button 
                              onClick={() => setMockCurrentIndex(i => i + 1)}
                              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-800"
                            >
                              Next Question
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white text-center shadow-xl shadow-indigo-100">
                          <Trophy className="mx-auto mb-4" size={48} />
                          <h4 className="text-3xl font-black mb-1">Test Completed!</h4>
                          <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm">
                            Score: {Object.entries(mockAnswers).filter(([idx, ans]) => aiResponse[parseInt(idx)].correctIndex === ans).length} / {aiResponse.length}
                          </p>
                        </div>
                        <div className="space-y-6">
                           {aiResponse.map((q, i) => {
                             const userAns = mockAnswers[i];
                             const isCorrect = userAns === q.correctIndex;
                             return (
                               <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-slate-50 space-y-4">
                                 <div className="flex items-start justify-between gap-4">
                                   <p className="font-black text-slate-900 leading-tight flex-1">{i + 1}. {q.question}</p>
                                   {isCorrect ? <CheckCircle2 className="text-green-500 shrink-0" /> : <X className="text-red-500 shrink-0" />}
                                 </div>
                                 <div className="space-y-2">
                                   <div className={`p-3 rounded-xl text-sm font-bold flex justify-between ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     <span>Your Answer: {q.options[userAns]}</span>
                                   </div>
                                   {!isCorrect && (
                                     <div className="p-3 rounded-xl text-sm font-bold bg-green-100 text-green-700">
                                       Correct Answer: {q.options[q.correctIndex]}
                                     </div>
                                   )}
                                   <p className="text-xs text-slate-500 font-medium italic mt-2">"{q.explanation}"</p>
                                 </div>
                               </div>
                             );
                           })}
                        </div>
                        <button onClick={() => setAiModal(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Return to Dashboard</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="prose prose-slate prose-lg max-w-none prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight">
                    {/* Basic Markdown Parser for AI response */}
                    {typeof aiResponse === 'string' ? aiResponse.split('\n').map((line, i) => {
                      if (line.startsWith('#')) return <h4 key={i} className="text-slate-900 border-b border-slate-100 pb-2 mt-6 mb-4">{line.replace(/#/g, '').trim()}</h4>;
                      if (line.startsWith('*') || line.startsWith('-')) return <li key={i} className="text-slate-700 ml-4 mb-2">{line.replace(/[*|-]/g, '').trim()}</li>;
                      return <p key={i} className="mb-4">{line}</p>;
                    }) : JSON.stringify(aiResponse)}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                   <Sparkles size={12} /> Powered by Gemini Intelligent Engine
                </div>
                {!isAiLoading && (
                  <button 
                    onClick={() => handleAiAction(aiModal.type, aiModal)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Refresh Perspective <RotateCcw size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
