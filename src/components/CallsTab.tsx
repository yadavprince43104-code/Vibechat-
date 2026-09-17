import React, { useState } from 'react';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, X } from 'lucide-react';
import { UserProfile } from '../types';

interface CallsTabProps {
  contacts: UserProfile[];
}

export const CallsTab: React.FC<CallsTabProps> = ({ contacts }) => {
  const [callAlert, setCallAlert] = useState<string | null>(null);

  const mockCalls = [
    {
      contact: contacts[0],
      type: 'video' as const,
      direction: 'incoming' as const,
      time: 'Today, 2:15 PM',
      missed: false,
    },
    {
      contact: contacts[1],
      type: 'audio' as const,
      direction: 'outgoing' as const,
      time: 'Yesterday, 8:30 PM',
      missed: false,
    },
    {
      contact: contacts[2],
      type: 'audio' as const,
      direction: 'incoming' as const,
      time: 'September 14, 11:20 AM',
      missed: true,
    },
    {
      contact: contacts[3],
      type: 'video' as const,
      direction: 'outgoing' as const,
      time: 'September 12, 5:45 PM',
      missed: false,
    },
  ];

  const handleCall = (name: string, type: 'Audio' | 'Video') => {
    setCallAlert(`Starting ${type} call with ${name}...`);
    setTimeout(() => setCallAlert(null), 3000);
  };

  return (
    <div id="whatsapp-calls-tab" className="flex-1 overflow-y-auto bg-white p-4 space-y-3 relative">
      {callAlert && (
        <div className="bg-emerald-800 text-white text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-md mb-2">
          <span>{callAlert}</span>
          <button onClick={() => setCallAlert(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        Recent Calls
      </p>

      <div className="divide-y divide-slate-100">
        {mockCalls.map((call, idx) => {
          if (!call.contact) return null;
          return (
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={call.contact.avatar}
                  alt={call.contact.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4
                    className={`font-semibold text-sm ${
                      call.missed ? 'text-rose-600' : 'text-slate-800'
                    }`}
                  >
                    {call.contact.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    {call.missed ? (
                      <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />
                    ) : call.direction === 'incoming' ? (
                      <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{call.time}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCall(call.contact.name, call.type === 'video' ? 'Video' : 'Audio')
                }
                className="p-2.5 text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
                title={`Call ${call.contact.name}`}
              >
                {call.type === 'video' ? (
                  <Video className="w-4.5 h-4.5" />
                ) : (
                  <Phone className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
