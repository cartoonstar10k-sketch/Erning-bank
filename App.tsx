
import React, { useState, useEffect, useCallback } from 'react';
import { UserState, AppView, Task, Prize } from './types';
import { INITIAL_USER_STATE, UI_STRINGS, LANGUAGES, COUNTRIES } from './constants';
import { gemini } from './services/geminiService';

// --- Components ---

const Navbar: React.FC<{ activeView: AppView; setView: (v: AppView) => void }> = ({ activeView, setView }) => {
  const tabs: { id: AppView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'tasks', label: 'Tasks', icon: '⚡' },
    { id: 'prizes', label: 'Rewards', icon: '🏆' },
    { id: 'settings', label: 'More', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeView === tab.id ? 'text-green-400 scale-110' : 'text-zinc-500'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
          {activeView === tab.id && <div className="w-1 h-1 bg-green-400 rounded-full mt-1"></div>}
        </button>
      ))}
    </nav>
  );
};

const Header: React.FC<{ user: UserState }> = ({ user }) => {
  const t = UI_STRINGS[user.language] || UI_STRINGS.en;
  return (
    <div className="pt-8 pb-4 px-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-zinc-500 text-sm font-medium">{t.welcome}</h1>
          <p className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            User_88293
          </p>
        </div>
        <div className="flex gap-2">
          <div className="glass-panel px-3 py-1 rounded-full flex items-center gap-2 border-green-500/20">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-xs font-bold text-green-400 uppercase tracking-tighter">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-2xl border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl rounded-full -mr-10 -mt-10"></div>
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">{t.paisa} Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">₹{user.balance.toLocaleString()}</span>
            <span className="text-xs text-green-400 font-bold">↑ 12%</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-white/5">
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">{t.currentLevel}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{user.level}</span>
            <span className="text-xs text-zinc-500 font-bold">/ 100</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
              style={{ width: `${user.xp}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ user: UserState; onStartTask: () => void }> = ({ user, onStartTask }) => {
  const t = UI_STRINGS[user.language] || UI_STRINGS.en;
  
  return (
    <div className="px-6 pb-24 space-y-6">
      <div className="relative group cursor-pointer" onClick={onStartTask}>
        <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative glass-panel p-6 rounded-3xl border-green-500/30 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-500/10 p-3 rounded-2xl">
              <span className="text-3xl">🎯</span>
            </div>
            <span className="bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded">HOT TASK</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Mega Prize Level {user.level}</h3>
          <p className="text-zinc-400 text-sm mb-4">Complete your daily quest to unlock ₹500 extra bonus.</p>
          <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-green-400 transition-colors">
            {t.startTask.toUpperCase()}
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{t.bigPrizes}</h3>
          <span className="text-green-400 text-xs font-bold uppercase tracking-widest">View All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {[
            { id: '1', name: 'iPhone 16 Pro', cost: 150000, img: '📱' },
            { id: '2', name: 'MacBook M3', cost: 250000, img: '💻' },
            { id: '3', name: 'Amazon Vouchers', cost: 5000, img: '🎟️' },
          ].map((prize) => (
            <div key={prize.id} className="min-w-[160px] glass-panel p-4 rounded-2xl flex flex-col items-center gap-3">
              <div className="text-4xl bg-white/5 w-16 h-16 rounded-full flex items-center justify-center float">{prize.img}</div>
              <div className="text-center">
                <p className="text-sm font-bold truncate w-24">{prize.name}</p>
                <p className="text-xs text-green-400 font-bold">₹{prize.cost.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-white/5">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span>📈</span> Global Stats
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">🌍</div>
              <div>
                <p className="text-xs font-bold">Total Players</p>
                <p className="text-sm text-zinc-400">12.4M Globally</p>
              </div>
            </div>
            <span className="text-green-400 text-xs font-bold">+2.1k Today</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-lg">💰</div>
              <div>
                <p className="text-xs font-bold">Paid Out (2026)</p>
                <p className="text-sm text-zinc-400">₹450.8 Crores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskView: React.FC<{ 
  user: UserState; 
  onTaskComplete: (reward: number) => void;
  onBack: () => void;
}> = ({ user, onTaskComplete, onBack }) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);

  const fetchNewTask = useCallback(async () => {
    setLoading(true);
    try {
      const task = await gemini.generateTask(user.level, user.language);
      setCurrentTask(task);
      setFeedback(null);
      setAnswer('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user.level, user.language]);

  useEffect(() => {
    fetchNewTask();
  }, [fetchNewTask]);

  const handleSubmit = async () => {
    if (!currentTask || !answer) return;
    setLoading(true);
    try {
      const result = await gemini.verifyTask(currentTask.description, answer);
      setFeedback({ success: result.success, text: result.feedback });
      if (result.success) {
        setTimeout(() => {
          onTaskComplete(currentTask.reward);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentTask) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold animate-pulse">Scanning the Grid...</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 glass-panel rounded-full flex items-center justify-center">←</button>
        <h2 className="text-2xl font-black">Active Quest</h2>
      </div>

      {currentTask && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-zinc-400">
                {currentTask.type} • {currentTask.difficulty}
              </span>
              <span className="text-green-400 font-black text-lg">₹{currentTask.reward}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{currentTask.title}</h3>
            <p className="text-zinc-400 mb-6">{currentTask.description}</p>

            {feedback ? (
              <div className={`p-4 rounded-2xl mb-4 ${feedback.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                <p className="font-bold flex items-center gap-2">
                  {feedback.success ? '✅ Success!' : '❌ Try Again'}
                </p>
                <p className="text-sm mt-1">{feedback.text}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-green-500 outline-none transition-all h-32 resize-none text-white"
                />
                <button
                  disabled={loading || !answer}
                  onClick={handleSubmit}
                  className="w-full bg-green-500 text-black font-black py-4 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  {loading ? 'VERIFYING...' : 'SUBMIT ANSWER'}
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <button 
              onClick={fetchNewTask}
              className="text-zinc-500 text-sm font-bold underline decoration-zinc-800"
            >
              Skip this task (Costs 2 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsView: React.FC<{ user: UserState; setUser: (u: UserState) => void }> = ({ user, setUser }) => {
  return (
    <div className="px-6 pb-24 space-y-6">
      <h2 className="text-2xl font-black mb-8">Configurations</h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-zinc-500 text-xs font-bold uppercase block mb-2">Display Language</span>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setUser({...user, language: lang.code})}
                className={`glass-panel p-3 rounded-xl flex items-center justify-between transition-all ${
                  user.language === lang.code ? 'border-green-500 bg-green-500/5' : 'border-white/5'
                }`}
              >
                <span className="text-sm">{lang.name}</span>
                <span>{lang.flag}</span>
              </button>
            ))}
          </div>
        </label>

        <label className="block mt-6">
          <span className="text-zinc-500 text-xs font-bold uppercase block mb-2">Payout Region</span>
          <select 
            value={user.country}
            onChange={(e) => setUser({...user, country: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-green-500 outline-none appearance-none"
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <div className="pt-8 space-y-3">
        <button className="w-full glass-panel border-white/10 p-4 rounded-2xl flex items-center justify-between">
           <span className="font-bold">Transaction History</span>
           <span className="text-zinc-500">→</span>
        </button>
        <button className="w-full glass-panel border-white/10 p-4 rounded-2xl flex items-center justify-between">
           <span className="font-bold">Security & 2FA</span>
           <span className="text-zinc-500">→</span>
        </button>
        <button className="w-full border-2 border-red-500/20 text-red-500 font-bold p-4 rounded-2xl">
           Logout Account
        </button>
      </div>

      <p className="text-center text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-12">
        FortuneQuest v4.2.0 • Build 2026.08.12
      </p>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserState>(INITIAL_USER_STATE);
  const [view, setView] = useState<AppView>('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Persistent storage simulation
    const saved = localStorage.getItem('fq_user_data');
    if (saved) setUser(JSON.parse(saved));
    
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('fq_user_data', JSON.stringify(user));
  }, [user]);

  const handleTaskComplete = (reward: number) => {
    setUser(prev => {
      const newXp = prev.xp + 25;
      const levelUp = newXp >= 100;
      return {
        ...prev,
        balance: prev.balance + reward,
        xp: levelUp ? 0 : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
        tasksCompleted: prev.tasksCompleted + 1
      };
    });
    setView('dashboard');
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-[150px] -top-64 -left-64 rounded-full"></div>
           <div className="absolute w-[500px] h-[500px] bg-emerald-500/20 blur-[150px] -bottom-64 -right-64 rounded-full"></div>
        </div>
        <div className="relative flex flex-col items-center">
          <div className="text-6xl mb-4 float">💎</div>
          <h1 className="text-4xl font-black tracking-tighter italic">
            FORTUNE<span className="text-green-400">QUEST</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-[0.4em] text-[10px] mt-2 uppercase">Earn the Future</p>
        </div>
        <div className="mt-20 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 70%; transform: translateX(50%); }
            100% { width: 0%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-20 overflow-x-hidden">
      <Header user={user} />
      
      <main className="mt-4 transition-all duration-300">
        {view === 'dashboard' && <DashboardView user={user} onStartTask={() => setView('tasks')} />}
        {view === 'tasks' && <TaskView user={user} onTaskComplete={handleTaskComplete} onBack={() => setView('dashboard')} />}
        {view === 'settings' && <SettingsView user={user} setUser={setUser} />}
        {view === 'prizes' && (
           <div className="px-6 text-center pt-20">
             <div className="text-6xl mb-6">🏆</div>
             <h2 className="text-2xl font-black mb-2">Prize Vault Locked</h2>
             <p className="text-zinc-500 mb-8">Reach Level 5 to unlock grand physical prize redemptions including electronics and gift cards.</p>
             <button onClick={() => setView('tasks')} className="bg-white text-black font-black px-8 py-4 rounded-2xl w-full">EARN XP NOW</button>
           </div>
        )}
      </main>

      <Navbar activeView={view} setView={setView} />
    </div>
  );
}
