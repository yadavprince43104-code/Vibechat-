import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Camera, User, Phone, Info, Check, 
  Users, Volume2, VolumeX, Sparkles 
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface UserProfileModalProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
  onSwitchUser: (userId: string) => void;
  simulationEnabled: boolean;
  onToggleSimulation: (enabled: boolean) => void;
}

const ABOUT_PRESETS = [
  'Hey there! I am using WhatsApp.',
  'Available for quick chats 💬',
  'Busy at work 💻',
  'In a meeting 📅',
  'At the gym 💪',
  'Battery about to die 🪫',
  'Coffee first ☕',
  'Exploring new horizons ✈️',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  allUsers,
  isOpen,
  onClose,
  onSaveProfile,
  onSwitchUser,
  simulationEnabled,
  onToggleSimulation,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [about, setAbout] = useState(currentUser.about);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [status, setStatus] = useState<UserProfile['status']>(currentUser.status);
  const [soundOn, setSoundOn] = useState(soundManager.isEnabled());
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...currentUser,
      name: name.trim() || currentUser.name,
      phone: phone.trim() || currentUser.phone,
      about: about.trim() || currentUser.about,
      avatar,
      status,
    });
    onClose();
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setEnabled(next);
    if (next) {
      soundManager.playIncomingNotification();
    }
  };

  return (
    <div 
      id="user-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        id="user-profile-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-200" />
            <h2 className="font-semibold text-lg">My Profile</h2>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 text-sm">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                referrerPolicy="no-referrer"
              />
              <button
                id="change-avatar-button"
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform active:scale-95"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Click camera to change photo</p>

            {/* Avatar picker tray */}
            {showAvatarPicker && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 w-full">
                <p className="text-xs font-semibold text-slate-600 mb-2">Select an Avatar Preset</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(url);
                        setShowAvatarPicker(false);
                      }}
                      className={`relative rounded-full overflow-hidden border-2 transition-all ${
                        avatar === url ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-10 h-10 object-cover" referrerPolicy="no-referrer" />
                      {avatar === url && (
                        <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                  <input
                    type="url"
                    placeholder="Or paste image URL..."
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  {customAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(customAvatarUrl);
                        setShowAvatarPicker(false);
                      }}
                      className="mt-1.5 w-full bg-emerald-600 text-white text-xs py-1 rounded-lg font-medium"
                    >
                      Apply Custom URL
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Your Name
            </label>
            <input
              id="profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors font-medium text-slate-800"
            />
            <p className="text-[11px] text-slate-400">This is visible to your WhatsApp contacts.</p>
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </label>
            <input
              id="profile-phone-input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors font-medium text-slate-800"
            />
          </div>

          {/* About / Status Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> About
            </label>
            <textarea
              id="profile-about-input"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={2}
              placeholder="Hey there! I am using WhatsApp."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors text-slate-800 resize-none text-xs"
            />
            
            {/* Quick About Presets */}
            <div className="pt-1">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Quick Presets:</p>
              <div className="flex flex-wrap gap-1.5">
                {ABOUT_PRESETS.slice(0, 4).map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAbout(preset)}
                    className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-slate-600 border border-slate-200 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Presence Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['online', 'busy', 'offline'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize border transition-all flex items-center justify-center gap-1.5 ${
                    status === st
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      st === 'online'
                        ? 'bg-emerald-500'
                        : st === 'busy'
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Prototype Settings & Switch User Box */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>Message & Chime Sounds</span>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  soundOn ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simulate Contact Replies</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleSimulation(!simulationEnabled)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  simulationEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Switch User persona */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Switch Persona (Test 1-to-1 Chat):</span>
              </div>
              <div className="space-y-1.5">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      disabled={isCurrent}
                      onClick={() => {
                        onSwitchUser(u.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-emerald-100/60 border border-emerald-300 text-emerald-900 font-semibold'
                          : 'hover:bg-slate-200/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span>{u.name}</span>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-[11px] text-indigo-600 font-medium hover:underline">
                          Switch →
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50">
          <button
            id="cancel-profile-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            id="save-profile-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
