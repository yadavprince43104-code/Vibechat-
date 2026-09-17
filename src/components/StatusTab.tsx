import React, { useState } from 'react';
import { Plus, Camera, Eye, X } from 'lucide-react';
import { UserProfile } from '../types';

interface StatusTabProps {
  currentUser: UserProfile;
  contacts: UserProfile[];
}

export const StatusTab: React.FC<StatusTabProps> = ({ currentUser, contacts }) => {
  const [selectedStatus, setSelectedStatus] = useState<{
    user: UserProfile;
    imageUrl: string;
    caption: string;
    time: string;
  } | null>(null);

  const mockStatuses = [
    {
      user: contacts[0] || currentUser,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      caption: 'Weekend getaway to the coast 🌊🌴',
      time: '24 minutes ago',
    },
    {
      user: contacts[1] || currentUser,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
      caption: 'Morning brew perfection ☕✨',
      time: '2 hours ago',
    },
    {
      user: contacts[3] || currentUser,
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      caption: 'Excited for today’s launch! 🚀',
      time: '5 hours ago',
    },
  ];

  return (
    <div id="whatsapp-status-tab" className="flex-1 overflow-y-auto bg-white p-4 space-y-4">
      {/* My Status Card */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-13 h-13 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-600 rounded-full border-2 border-white text-white flex items-center justify-center">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 text-sm">My Status</h3>
          <p className="text-xs text-slate-500">Tap to add status update</p>
        </div>
        <button className="p-2 text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">
          <Camera className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Recent Updates Header */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Recent updates
        </p>
        <div className="space-y-3">
          {mockStatuses.map((st, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedStatus(st)}
              className="flex items-center gap-3.5 p-1 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="p-0.5 rounded-full ring-2 ring-emerald-500 shrink-0">
                <img
                  src={st.user.avatar}
                  alt={st.user.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-sm truncate">{st.user.name}</h4>
                <p className="text-xs text-slate-400">{st.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStatus && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedStatus(null)}
        >
          {/* Progress bar */}
          <div className="w-full max-w-sm absolute top-4 left-1/2 -translate-x-1/2 px-4 flex gap-1 z-20">
            <div className="h-1 bg-white/40 flex-1 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-[progress_5s_linear]" />
            </div>
          </div>

          <div
            className="w-full max-w-sm relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedStatus.user.avatar}
                  alt={selectedStatus.user.name}
                  className="w-8 h-8 rounded-full object-cover border border-white"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-semibold text-xs text-white">{selectedStatus.user.name}</p>
                  <p className="text-[10px] text-slate-300">{selectedStatus.time}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStatus(null)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Story Image */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
              <img
                src={selectedStatus.imageUrl}
                alt="Story"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xs text-white p-3 rounded-xl text-center text-xs">
                {selectedStatus.caption}
              </div>
            </div>

            {/* Bottom views */}
            <div className="p-3 bg-black/80 flex items-center justify-center gap-1 text-slate-300 text-xs">
              <Eye className="w-4 h-4" />
              <span>42 views</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
