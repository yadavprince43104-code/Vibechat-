import React from 'react';
import { 
  Check, CheckCheck, MessageSquarePlus, 
  Pin, Image, Mic, Sparkles 
} from 'lucide-react';
import { UserProfile, Chat, Message } from '../types';

interface ChatListProps {
  currentUserId: string;
  chats: Chat[];
  contacts: UserProfile[];
  messages: Message[];
  typingContactIds: Set<string>;
  onSelectChat: (contactId: string) => void;
  onOpenNewChat: () => void;
  searchQuery: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  currentUserId,
  chats,
  contacts,
  messages,
  typingContactIds,
  onSelectChat,
  onOpenNewChat,
  searchQuery,
}) => {
  // Helper to get contact profile
  const getContact = (contactId: string): UserProfile | undefined => {
    return contacts.find((c) => c.id === contactId);
  };

  // Helper to get latest message for a contact
  const getLatestMessage = (contactId: string): Message | undefined => {
    const chatMsgs = messages.filter(
      (m) =>
        (m.senderId === currentUserId && m.recipientId === contactId) ||
        (m.senderId === contactId && m.recipientId === currentUserId)
    );
    return chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : undefined;
  };

  // Helper to count unread messages from this contact to current user
  const getUnreadCount = (contactId: string): number => {
    return messages.filter(
      (m) =>
        m.senderId === contactId &&
        m.recipientId === currentUserId &&
        m.status !== 'read'
    ).length;
  };

  // Format message time
  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const latestMsg = getLatestMessage(c.id);
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (latestMsg && latestMsg.text.toLowerCase().includes(q))
    );
  });

  // Sort contacts by latest message timestamp (most recent first)
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const msgA = getLatestMessage(a.id);
    const msgB = getLatestMessage(b.id);
    const timeA = msgA ? msgA.timestamp : 0;
    const timeB = msgB ? msgB.timestamp : 0;
    return timeB - timeA;
  });

  return (
    <div id="whatsapp-chat-list" className="flex-1 overflow-y-auto relative bg-white divide-y divide-slate-100">
      {sortedContacts.length > 0 ? (
        sortedContacts.map((contact) => {
          const latestMsg = getLatestMessage(contact.id);
          const unreadCount = getUnreadCount(contact.id);
          const isTyping = typingContactIds.has(contact.id);
          const isFromMe = latestMsg?.senderId === currentUserId;
          const chatMeta = chats.find((c) => c.contactId === contact.id);

          return (
            <div
              key={contact.id}
              id={`chat-item-${contact.id}`}
              onClick={() => onSelectChat(contact.id)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
            >
              {/* Avatar + Status indicator */}
              <div className="relative shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                {contact.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">
                    {contact.name}
                  </h3>
                  <span
                    className={`text-[11px] shrink-0 font-medium ${
                      unreadCount > 0 ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {formatTime(latestMsg?.timestamp)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 text-xs text-slate-500 truncate mr-2">
                    {isTyping ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        typing...
                      </span>
                    ) : latestMsg ? (
                      <>
                        {isFromMe && (
                          <span className="shrink-0 mr-0.5">
                            {latestMsg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" />
                            ) : latestMsg.status === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-400 inline" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-400 inline" />
                            )}
                          </span>
                        )}
                        {latestMsg.type === 'image' ? (
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Image className="w-3 h-3 text-emerald-600" /> Photo
                          </span>
                        ) : latestMsg.type === 'voice' ? (
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Mic className="w-3 h-3 text-emerald-600" /> Voice message ({latestMsg.mediaDuration || 3}s)
                          </span>
                        ) : (
                          <span className="truncate">{latestMsg.text}</span>
                        )}
                      </>
                    ) : (
                      <span className="italic text-slate-400 truncate">Tap to start chatting</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {chatMeta?.isPinned && (
                      <Pin className="w-3 h-3 text-slate-400 fill-slate-400 rotate-45" />
                    )}
                    {unreadCount > 0 && (
                      <span className="bg-emerald-600 text-white font-bold text-[10px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-8 text-center text-slate-400 space-y-2">
          <p className="text-sm font-medium">No conversations found</p>
          <p className="text-xs">Tap the green button below to start a new chat!</p>
        </div>
      )}

      {/* Floating Action Button for New Chat */}
      <button
        id="fab-new-chat-btn"
        type="button"
        onClick={onOpenNewChat}
        className="absolute bottom-5 right-5 w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all z-20"
        title="Start New Chat"
      >
        <MessageSquarePlus className="w-6 h-6" />
      </button>
    </div>
  );
};
