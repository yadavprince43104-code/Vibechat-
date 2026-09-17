import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationBannerProps {
  notification: NotificationItem | null;
  onOpenChat: (chatId: string) => void;
  onDismiss: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onOpenChat,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          id="chat-notification-banner"
          initial={{ y: -60, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="absolute top-12 left-3 right-3 z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-xl border border-slate-700/60 cursor-pointer"
          onClick={() => {
            onOpenChat(notification.chatId);
            onDismiss();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={notification.senderAvatar}
                alt={notification.senderName}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/50"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-xs font-semibold text-white truncate">
                    {notification.senderName}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                {notification.messageText}
              </p>
            </div>

            <button
              id="dismiss-notification-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
