import React, { useState, useEffect } from 'react';
import { 
  Wifi, Battery, Signal, Smartphone, Maximize2, 
  Volume2, VolumeX, Sparkles, RotateCcw, Users 
} from 'lucide-react';
import { UserProfile } from '../types';

interface MobileFrameProps {
  children: React.ReactNode;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  simulationEnabled: boolean;
  onToggleSimulation: (enabled: boolean) => void;
  onResetData: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  currentUser,
  allUsers,
  onSwitchUser,
  soundEnabled,
  onToggleSound,
  simulationEnabled,
  onToggleSimulation,
  onResetData,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isFullWidth, setIsFullWidth] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Prototype Helper Bar (Visible on desktop) */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3 py-1.5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 text-xs shadow-lg">
        {/* Active persona */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">User:</span>
          <div className="relative group">
            <button className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-4.5 h-4.5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="truncate max-w-[100px]">{currentUser.name}</span>
            </button>
            <div className="hidden group-hover:block absolute left-0 top-6 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 border-b border-slate-700/50">
                Switch Persona
              </p>
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSwitchUser(u.id)}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs hover:bg-slate-700/50 ${
                    u.id === currentUser.id ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <span className="truncate">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-emerald-900/40 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onToggleSimulation(!simulationEnabled)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition-colors ${
              simulationEnabled
                ? 'bg-emerald-900/40 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="When active, contacts automatically reply to test real-time chat & notifications"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Auto-Reply</span>
          </button>

          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
            title={isFullWidth ? 'Switch to Phone Frame' : 'Switch to Full Width'}
          >
            {isFullWidth ? <Smartphone className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              if (confirm('Reset prototype data to default chats?')) {
                onResetData();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50"
            title="Reset prototype data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Screen */}
      <main
        id="mobile-phone-container"
        className={`w-full bg-white text-slate-900 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullWidth
            ? 'max-w-4xl h-[92vh] sm:rounded-3xl shadow-2xl border border-slate-700'
            : 'max-w-[420px] h-[100dvh] sm:h-[840px] sm:rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:border-[8px] sm:border-slate-800'
        }`}
      >
        {/* Mobile Phone Status Bar */}
        <div
          id="mobile-status-bar"
          className="bg-emerald-700 text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight select-none shrink-0"
        >
          <span>{currentTime || '09:41'}</span>

          {/* Notch / Speaker hole representation */}
          <div className="w-20 h-3.5 bg-slate-900 rounded-full hidden sm:block shadow-inner" />

          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Inner Mobile Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Mobile Home Bar Indicator (hidden on small devices where OS provides it) */}
        <div className="hidden sm:flex justify-center py-1.5 bg-white shrink-0">
          <div className="w-28 h-1 bg-slate-300 rounded-full" />
        </div>
      </main>
    </div>
  );
};
