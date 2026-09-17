import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Message, Chat, NotificationItem } from './types';
import { 
  loadUsers, saveUsers, loadActiveUserId, saveActiveUserId, 
  loadMessages, saveMessages, loadChats, saveChats, 
  getSimulationEnabled, setSimulationEnabled, resetToDefaults, 
  subscribeToSync, getChatId 
} from './utils/storage';
import { soundManager } from './utils/audio';
import { SMART_AUTO_REPLIES } from './data/mockData';
import { MobileFrame } from './components/MobileFrame';
import { TopHeader } from './components/TopHeader';
import { ChatList } from './components/ChatList';
import { ChatRoom } from './components/ChatRoom';
import { UserProfileModal } from './components/UserProfileModal';
import { ContactInfoModal } from './components/ContactInfoModal';
import { NewChatModal } from './components/NewChatModal';
import { NotificationBanner } from './components/NotificationBanner';
import { StatusTab } from './components/StatusTab';
import { CallsTab } from './components/CallsTab';

export default function App() {
  // Master state
  const [users, setUsers] = useState<UserProfile[]>(loadUsers);
  const [activeUserId, setActiveUserId] = useState<string>(loadActiveUserId);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [chats, setChats] = useState<Chat[]>(loadChats);

  // UI Navigation state
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);

  // Interactive prototype state
  const [typingContactIds, setTypingContactIds] = useState<Set<string>>(new Set());
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  const [simulationEnabled, setSimulation] = useState<boolean>(getSimulationEnabled);

  // Sync state with storage
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveActiveUserId(activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Listen to cross-tab updates via BroadcastChannel
  useEffect(() => {
    const unsubscribe = subscribeToSync((type, payload) => {
      if (type === 'USERS_UPDATED' && Array.isArray(payload)) {
        setUsers(payload as UserProfile[]);
      } else if (type === 'MESSAGES_UPDATED' && Array.isArray(payload)) {
        setMessages(payload as Message[]);
      } else if (type === 'CHATS_UPDATED' && Array.isArray(payload)) {
        setChats(payload as Chat[]);
      } else if (type === 'ACTIVE_USER_CHANGED' && typeof payload === 'string') {
        setActiveUserId(payload);
      } else if (type === 'RESET_DATA') {
        setUsers(loadUsers());
        setActiveUserId(loadActiveUserId());
        setMessages(loadMessages());
        setChats(loadChats());
      }
    });
    return unsubscribe;
  }, []);

  // Request browser notification permission if supported (clean & unobtrusive)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Notification permission can be prompted on user gesture
      }
    }
  }, []);

  // Derived current user
  const currentUser = useMemo(() => {
    return users.find((u) => u.id === activeUserId) || users[0];
  }, [users, activeUserId]);

  // Derived contacts list (all users except current active user)
  const contacts = useMemo(() => {
    return users.filter((u) => u.id !== currentUser.id);
  }, [users, currentUser.id]);

  // Selected contact object
  const selectedContact = useMemo(() => {
    if (!selectedContactId) return null;
    return users.find((u) => u.id === selectedContactId) || null;
  }, [users, selectedContactId]);

  // Messages in currently open 1-to-1 chat
  const currentChatMessages = useMemo(() => {
    if (!selectedContactId) return [];
    return messages.filter(
      (m) =>
        (m.senderId === currentUser.id && m.recipientId === selectedContactId) ||
        (m.senderId === selectedContactId && m.recipientId === currentUser.id)
    );
  }, [messages, currentUser.id, selectedContactId]);

  // Total unread messages for active user
  const totalUnreadCount = useMemo(() => {
    return messages.filter(
      (m) => m.recipientId === currentUser.id && m.status !== 'read'
    ).length;
  }, [messages, currentUser.id]);

  // Mark messages in current conversation as read
  const markChatAsRead = useCallback(
    (contactId: string) => {
      setMessages((prev) => {
        let changed = false;
        const next = prev.map((m) => {
          if (m.senderId === contactId && m.recipientId === currentUser.id && m.status !== 'read') {
            changed = true;
            return { ...m, status: 'read' as const };
          }
          return m;
        });
        return changed ? next : prev;
      });
    },
    [currentUser.id]
  );

  // When opening a chat room, automatically mark its incoming messages as read
  useEffect(() => {
    if (selectedContactId) {
      markChatAsRead(selectedContactId);
    }
  }, [selectedContactId, markChatAsRead]);

  // Trigger an in-app notification & chime
  const notifyIncomingMessage = useCallback(
    (sender: UserProfile, text: string, chatId: string) => {
      soundManager.playIncomingNotification();

      const notifItem: NotificationItem = {
        id: `notif_${Date.now()}`,
        senderId: sender.id,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        messageText: text,
        timestamp: Date.now(),
        chatId,
      };

      setActiveNotification(notifItem);

      // Web Notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(sender.name, {
            body: text,
            icon: sender.avatar,
          });
        } catch {
          // ignore
        }
      }

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        setActiveNotification((curr) => (curr?.id === notifItem.id ? null : curr));
      }, 4500);
    },
    []
  );

  // Send a message
  const handleSendMessage = useCallback(
    (text: string, mediaType?: 'image' | 'voice', mediaUrl?: string) => {
      if (!selectedContactId) return;

      const newMsgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const newMsg: Message = {
        id: newMsgId,
        chatId: getChatId(currentUser.id, selectedContactId),
        senderId: currentUser.id,
        recipientId: selectedContactId,
        text,
        timestamp: Date.now(),
        status: 'delivered',
        type: mediaType || 'text',
        mediaUrl,
        mediaDuration: mediaType === 'voice' ? 4 : undefined,
      };

      // Play sent pop sound
      soundManager.playSentSound();

      // Add to messages
      setMessages((prev) => [...prev, newMsg]);

      // If simulation is enabled, simulate a realistic contact auto-reply
      if (simulationEnabled) {
        const contactRecipient = users.find((u) => u.id === selectedContactId);
        if (!contactRecipient) return;

        // Step 1: Contact starts typing after 1.2s
        const typingTimer = setTimeout(() => {
          setTypingContactIds((prev) => new Set(prev).add(contactRecipient.id));
        }, 1200);

        // Step 2: Contact stops typing and delivers reply after 2.8s
        const replyTimer = setTimeout(() => {
          setTypingContactIds((prev) => {
            const next = new Set(prev);
            next.delete(contactRecipient.id);
            return next;
          });

          // Mark user's message as read
          setMessages((prev) =>
            prev.map((m) => (m.id === newMsgId ? { ...m, status: 'read' as const } : m))
          );

          // Generate auto-reply text
          const randomReply =
            SMART_AUTO_REPLIES[Math.floor(Math.random() * SMART_AUTO_REPLIES.length)];

          const replyMsg: Message = {
            id: `reply_${Date.now()}`,
            chatId: getChatId(currentUser.id, contactRecipient.id),
            senderId: contactRecipient.id,
            recipientId: currentUser.id,
            text: randomReply,
            timestamp: Date.now(),
            status: 'delivered',
            type: 'text',
          };

          setMessages((prev) => [...prev, replyMsg]);

          // Show in-app notification if user is not in this chat room
          // or always show if in chat list
          notifyIncomingMessage(contactRecipient, randomReply, contactRecipient.id);
        }, 3000);

        return () => {
          clearTimeout(typingTimer);
          clearTimeout(replyTimer);
        };
      }
    },
    [selectedContactId, currentUser.id, simulationEnabled, users, notifyIncomingMessage]
  );

  // Message reactions
  const handleReactToMessage = useCallback(
    (messageId: string, emoji: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = m.reactions || [];
          const existingIdx = currentReactions.findIndex((r) => r.userId === currentUser.id);

          let updated;
          if (existingIdx >= 0) {
            if (currentReactions[existingIdx].emoji === emoji) {
              // Remove reaction
              updated = currentReactions.filter((_, i) => i !== existingIdx);
            } else {
              // Update reaction
              updated = currentReactions.map((r, i) => (i === existingIdx ? { ...r, emoji } : r));
            }
          } else {
            updated = [...currentReactions, { emoji, userId: currentUser.id }];
          }

          return { ...m, reactions: updated };
        })
      );
    },
    [currentUser.id]
  );

  // Delete message
  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  // Clear chat history with selected contact
  const handleClearChat = useCallback(() => {
    if (!selectedContactId) return;
    setMessages((prev) =>
      prev.filter(
        (m) =>
          !(
            (m.senderId === currentUser.id && m.recipientId === selectedContactId) ||
            (m.senderId === selectedContactId && m.recipientId === currentUser.id)
          )
      )
    );
  }, [selectedContactId, currentUser.id]);

  // Switch persona to test chat from other users' perspective
  const handleSwitchUser = useCallback(
    (newUserId: string) => {
      setActiveUserId(newUserId);
      saveActiveUserId(newUserId);
      setSelectedContactId(null); // return to chat list on user switch
    },
    []
  );

  // Update profile
  const handleSaveProfile = useCallback((updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  }, []);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) {
      soundManager.playIncomingNotification();
    }
  }, [soundEnabled]);

  // Toggle simulation
  const handleToggleSimulation = useCallback((enabled: boolean) => {
    setSimulation(enabled);
    setSimulationEnabled(enabled);
  }, []);

  // Reset demo data
  const handleResetData = useCallback(() => {
    resetToDefaults();
    setUsers(loadUsers());
    setActiveUserId('user_alex');
    setMessages(loadMessages());
    setChats(loadChats());
    setSelectedContactId(null);
  }, []);

  return (
    <MobileFrame
      currentUser={currentUser}
      allUsers={users}
      onSwitchUser={handleSwitchUser}
      soundEnabled={soundEnabled}
      onToggleSound={handleToggleSound}
      simulationEnabled={simulationEnabled}
      onToggleSimulation={handleToggleSimulation}
      onResetData={handleResetData}
    >
      {/* Floating in-app notification banner */}
      <NotificationBanner
        notification={activeNotification}
        onOpenChat={(chatContactId) => {
          setSelectedContactId(chatContactId);
          setActiveNotification(null);
        }}
        onDismiss={() => setActiveNotification(null)}
      />

      {/* Main View Sliding Transitions */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <motion.div
              key={`chat-room-${selectedContact.id}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-0 flex flex-col bg-white z-20"
            >
              <ChatRoom
                currentUser={currentUser}
                contact={selectedContact}
                messages={currentChatMessages}
                isTyping={typingContactIds.has(selectedContact.id)}
                onSendMessage={handleSendMessage}
                onBack={() => setSelectedContactId(null)}
                onOpenContactInfo={() => setIsContactInfoOpen(true)}
                onSwitchToContact={() => handleSwitchUser(selectedContact.id)}
                onClearChat={handleClearChat}
                onReactToMessage={handleReactToMessage}
                onDeleteMessage={handleDeleteMessage}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat-list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* WhatsApp App Header */}
              <TopHeader
                currentUser={currentUser}
                allUsers={users}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                totalUnreadCount={totalUnreadCount}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenNewChat={() => setIsNewChatOpen(true)}
                onSwitchUser={handleSwitchUser}
                onResetData={handleResetData}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Tabs Content */}
              {activeTab === 'chats' && (
                <ChatList
                  currentUserId={currentUser.id}
                  chats={chats}
                  contacts={contacts}
                  messages={messages}
                  typingContactIds={typingContactIds}
                  onSelectChat={(contactId) => setSelectedContactId(contactId)}
                  onOpenNewChat={() => setIsNewChatOpen(true)}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'status' && (
                <StatusTab currentUser={currentUser} contacts={contacts} />
              )}

              {activeTab === 'calls' && (
                <CallsTab contacts={contacts} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Modal */}
      <UserProfileModal
        currentUser={currentUser}
        allUsers={users}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={handleSaveProfile}
        onSwitchUser={handleSwitchUser}
        simulationEnabled={simulationEnabled}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* Contact Info Modal */}
      {selectedContact && (
        <ContactInfoModal
          contact={selectedContact}
          isOpen={isContactInfoOpen}
          onClose={() => setIsContactInfoOpen(false)}
          onStartCall={(callType) => {
            alert(`Calling ${selectedContact.name} (${callType})... (Prototype)`);
          }}
          onSwitchToContact={() => handleSwitchUser(selectedContact.id)}
          isMuted={false}
          onToggleMute={() => {}}
          messages={currentChatMessages}
        />
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        contacts={contacts}
        onClose={() => setIsNewChatOpen(false)}
        onSelectContact={(contact) => setSelectedContactId(contact.id)}
      />
    </MobileFrame>
  );
}
