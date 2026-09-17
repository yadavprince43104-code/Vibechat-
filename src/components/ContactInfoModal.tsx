import React from 'react';
import { motion } from 'motion/react';
import { 
  X, Phone, Video, Bell, BellOff, ShieldCheck, 
  MessageSquare, UserCheck, ArrowRightLeft, Image 
} from 'lucide-react';
import { UserProfile, Message } from '../types';

interface ContactInfoModalProps {
  contact: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onSwitchToContact: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  messages: Message[];
}

export const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  contact,
  isOpen,
  onClose,
  onStartCall,
  onSwitchToContact,
  isMuted,
  onToggleMute,
  messages,
}) => {
  if (!isOpen) return null;

  // Filter media messages in this chat
  const mediaMessages = messages.filter((m) => m.type === 'image' && m.mediaUrl);

  return (
    <div
      id="contact-info-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        id="contact-info-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-base">Contact Info</h3>
          <button
            id="close-contact-info-btn"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-5 text-slate-800">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  contact.status === 'online'
                    ? 'bg-emerald-500'
                    : contact.status === 'busy'
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-3">{contact.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{contact.phone}</p>
            <span className="mt-1.5 inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {contact.lastSeen || (contact.status === 'online' ? 'Online' : 'Offline')}
            </span>

            {/* Quick action buttons */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 w-full">
              <button
                type="button"
                onClick={() => onStartCall('audio')}
                className="flex flex-col items-center gap-1 text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Audio</span>
              </button>

              <button
                type="button"
                onClick={() => onStartCall('video')}
                className="flex flex-col items-center gap-1 text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Video</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex flex-col items-center gap-1 text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Message</span>
              </button>
            </div>
          </div>

          {/* About Status Section */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">About</p>
            <p className="text-sm font-medium text-slate-800">{contact.about}</p>
          </div>

          {/* Media / Photos Shared */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-emerald-600" />
                Media, links & docs
              </span>
              <span className="text-slate-400 font-mono">{mediaMessages.length} items</span>
            </div>
            {mediaMessages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {mediaMessages.map((m) => (
                  <div key={m.id} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={m.mediaUrl} alt="Shared media" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                No media shared yet in this chat.
              </p>
            )}
          </div>

          {/* Settings & Testing Persona */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {/* Mute Notifications */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                {isMuted ? <BellOff className="w-4 h-4 text-rose-500" /> : <Bell className="w-4 h-4 text-slate-600" />}
                <div>
                  <p className="text-xs font-semibold text-slate-800">Mute Notifications</p>
                  <p className="text-[10px] text-slate-500">Silence chat alerts for {contact.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleMute}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  isMuted ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Encryption badge */}
            <div className="flex items-center gap-2.5 p-2.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-800">End-to-end encryption</p>
                <p className="text-[10px] text-slate-400">Messages and calls are secured with end-to-end encryption.</p>
              </div>
            </div>

            {/* Switch to this contact persona button */}
            <button
              type="button"
              onClick={() => {
                onSwitchToContact();
                onClose();
              }}
              className="w-full mt-2 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Switch to this user & chat back</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
