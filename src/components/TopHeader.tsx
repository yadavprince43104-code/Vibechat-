import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MoreVertical, User, RotateCcw, 
  Volume2, VolumeX, MessageSquarePlus, 
  Users, Check, X 
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopHeaderProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  activeTab: 'chats' | 'status' | 'calls';
  onTabChange: (tab: 'chats' | 'status' | 'calls') => void;
  totalUnreadCount: number;
  onOpenProfile: () => void;
  onOpenNewChat: () => void;
  onSwitchUser: (userId: string) => void;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  allUsers,
  activeTab,
  onTabChange,
  totalUnreadCount,
  onOpenProfile,
  onOpenNewChat,
  onSwitchUser,
  onResetData,
  soundEnabled,
  onToggleSound,
  searchQuery,
  onSearchChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="whatsapp-top-header" className="bg-emerald-700 text-white shrink-0 shadow-md">
      {/* Upper Brand & Controls Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        {isSearching ? (
          <div className="flex items-center gap-2 w-full bg-emerald-800/80 rounded-xl px-3 py-1.5 transition-all">
            <Search className="w-4 h-4 text-emerald-200 shrink-0" />
            <input
              id="top-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chats or messages..."
              autoFocus
              className="w-full bg-transparent text-white text-xs placeholder:text-emerald-200/70 focus:outline-none"
            />
            <button
              id="close-search-btn"
              onClick={() => {
                setIsSearching(false);
                onSearchChange('');
              }}
              className="text-emerald-200 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-lg tracking-tight">Vibechat</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-emerald-800/80 text-emerald-200 rounded-md">
                Prototype
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Quick Persona Switcher Chip */}
              <button
                id="active-user-pill-btn"
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 bg-emerald-800/70 hover:bg-emerald-800 px-2 py-1 rounded-full text-xs font-medium border border-emerald-600/40 transition-colors"
                title="Switch active user to test one-to-one messaging"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[11px] truncate max-w-[80px] font-semibold">{currentUser.name.split(' ')[0]}</span>
              </button>

              {/* Search Icon */}
              <button
                id="open-search-btn"
                onClick={() => setIsSearching(true)}
                className="p-2 rounded-full hover:bg-emerald-800/80 text-emerald-100 hover:text-white transition-colors"
                title="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* 3 Dots Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  id="header-more-menu-btn"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-full hover:bg-emerald-800/80 text-emerald-100 hover:text-white transition-colors"
                  title="More Options"
                >
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-xs font-medium animate-in fade-in zoom-in-95 duration-100">
                    <button
                      id="menu-new-chat-btn"
                      onClick={() => {
                        setShowMenu(false);
                        onOpenNewChat();
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
                      <span>New Chat</span>
                    </button>

                    <button
                      id="menu-profile-btn"
                      onClick={() => {
                        setShowMenu(false);
                        onOpenProfile();
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>My Profile & Settings</span>
                    </button>

                    <button
                      id="menu-toggle-sound-btn"
                      onClick={() => {
                        onToggleSound();
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        )}
                        <span>Notification Chime</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{soundEnabled ? 'ON' : 'OFF'}</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      id="menu-reset-data-btn"
                      onClick={() => {
                        setShowMenu(false);
                        if (confirm('Reset prototype data to original demo messages?')) {
                          onResetData();
                        }
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Prototype Data</span>
                    </button>
                  </div>
                )}

                {/* Quick Persona Switcher Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 text-xs font-medium animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Switch Active User</span>
                    </div>
                    {allUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isCurrent ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-6 h-6 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs">{u.name}</p>
                            </div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs Navigation Bar (Chats, Status, Calls) */}
      <div className="flex text-xs font-semibold uppercase tracking-wider border-t border-emerald-600/40">
        <button
          id="tab-chats-btn"
          type="button"
          onClick={() => onTabChange('chats')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors relative ${
            activeTab === 'chats' ? 'text-white' : 'text-emerald-200/80 hover:text-white'
          }`}
        >
          <span>Chats</span>
          {totalUnreadCount > 0 && (
            <span className="bg-white text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
              {totalUnreadCount}
            </span>
          )}
          {activeTab === 'chats' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-white rounded-t-full" />
          )}
        </button>

        <button
          id="tab-status-btn"
          type="button"
          onClick={() => onTabChange('status')}
          className={`flex-1 py-2.5 text-center transition-colors relative ${
            activeTab === 'status' ? 'text-white' : 'text-emerald-200/80 hover:text-white'
          }`}
        >
          <span>Status</span>
          {activeTab === 'status' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-white rounded-t-full" />
          )}
        </button>

        <button
          id="tab-calls-btn"
          type="button"
          onClick={() => onTabChange('calls')}
          className={`flex-1 py-2.5 text-center transition-colors relative ${
            activeTab === 'calls' ? 'text-white' : 'text-emerald-200/80 hover:text-white'
          }`}
        >
          <span>Calls</span>
          {activeTab === 'calls' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-white rounded-t-full" />
          )}
        </button>
      </div>
    </div>
  );
};
