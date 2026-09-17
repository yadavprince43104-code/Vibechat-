import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, UserPlus } from 'lucide-react';
import { UserProfile } from '../types';

interface NewChatModalProps {
  isOpen: boolean;
  contacts: UserProfile[];
  onClose: () => void;
  onSelectContact: (contact: UserProfile) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  contacts,
  onClose,
  onSelectContact,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.about.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      id="new-chat-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        id="new-chat-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-semibold text-base leading-tight">New Chat</h3>
              <p className="text-[11px] text-emerald-200">{contacts.length} contacts</p>
            </div>
          </div>
          <button
            id="close-new-chat-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="new-chat-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or number..."
              className="w-full pl-9 pr-3 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Contacts list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length > 0 ? (
            filtered.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => {
                  onSelectContact(contact);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  {contact.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{contact.name}</p>
                  <p className="text-xs text-slate-500 truncate">{contact.about}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No contacts found matching &quot;{search}&quot;.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
