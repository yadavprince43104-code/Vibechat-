import { UserProfile, Message, Chat } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_alex',
    name: 'Alex Rivers',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-emerald-600',
    about: 'Hey there! I am using WhatsApp.',
    status: 'online',
    lastSeen: 'Online',
  },
  {
    id: 'user_sarah',
    name: 'Sarah Chen',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-teal-600',
    about: 'Living life in full color 🌿 | Coffee first',
    status: 'online',
    lastSeen: 'Online',
  },
  {
    id: 'user_david',
    name: 'David Miller',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-indigo-600',
    about: 'Design engineer @ TechCraft. Away till 6pm.',
    status: 'offline',
    lastSeen: 'Today at 3:15 PM',
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-amber-600',
    about: 'Available for quick catch-ups! 🚀',
    status: 'online',
    lastSeen: 'Online',
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-rose-600',
    about: 'Gym, code, repeat 💪',
    status: 'busy',
    lastSeen: 'Yesterday at 9:40 PM',
  },
  {
    id: 'user_maya',
    name: 'Maya Patel',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-cyan-600',
    about: 'Exploring new horizons ✈️📸',
    status: 'online',
    lastSeen: 'Online',
  },
];

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;

export const INITIAL_MESSAGES: Message[] = [
  // Alex and Sarah conversation
  {
    id: 'msg_s1',
    chatId: 'chat_sarah',
    senderId: 'user_sarah',
    recipientId: 'user_alex',
    text: 'Hey Alex! Did you get a chance to check out the mobile UI prototype?',
    timestamp: now - 35 * minute,
    status: 'read',
  },
  {
    id: 'msg_s2',
    chatId: 'chat_sarah',
    senderId: 'user_alex',
    recipientId: 'user_sarah',
    text: 'Yes! It looks super clean. The one-to-one messaging feels snappy and very intuitive.',
    timestamp: now - 28 * minute,
    status: 'read',
    reactions: [{ emoji: '👍', userId: 'user_sarah' }],
  },
  {
    id: 'msg_s3',
    chatId: 'chat_sarah',
    senderId: 'user_sarah',
    recipientId: 'user_alex',
    text: 'Awesome! Let me know if the chat notifications and sound alerts work well on your end.',
    timestamp: now - 12 * minute,
    status: 'read',
  },
  {
    id: 'msg_s4',
    chatId: 'chat_sarah',
    senderId: 'user_alex',
    recipientId: 'user_sarah',
    text: 'Testing notifications right now! 🔔',
    timestamp: now - 4 * minute,
    status: 'read',
  },

  // Alex and David conversation
  {
    id: 'msg_d1',
    chatId: 'chat_david',
    senderId: 'user_david',
    recipientId: 'user_alex',
    text: 'Hey mate, are we still meeting up for coffee tomorrow afternoon?',
    timestamp: now - 2 * hour,
    status: 'read',
  },
  {
    id: 'msg_d2',
    chatId: 'chat_david',
    senderId: 'user_alex',
    recipientId: 'user_david',
    text: 'Definitely! How about 2:30 PM at the usual cafe downtown?',
    timestamp: now - 95 * minute,
    status: 'read',
  },
  {
    id: 'msg_d3',
    chatId: 'chat_david',
    senderId: 'user_david',
    recipientId: 'user_alex',
    text: 'Perfect, see you there! ☕',
    timestamp: now - 85 * minute,
    status: 'read',
    reactions: [{ emoji: '❤️', userId: 'user_alex' }],
  },

  // Alex and Elena conversation
  {
    id: 'msg_e1',
    chatId: 'chat_elena',
    senderId: 'user_elena',
    recipientId: 'user_alex',
    text: 'Hey Alex, just sent over the revised presentation slides. Take a look whenever you are free.',
    timestamp: now - 4 * hour,
    status: 'read',
  },
  {
    id: 'msg_e2',
    chatId: 'chat_elena',
    senderId: 'user_alex',
    recipientId: 'user_elena',
    text: 'Thanks Elena! Reviewing them shortly.',
    timestamp: now - 3 * hour,
    status: 'delivered',
  },

  // Alex and Marcus conversation
  {
    id: 'msg_m1',
    chatId: 'chat_marcus',
    senderId: 'user_marcus',
    recipientId: 'user_alex',
    text: 'Morning! Gym session at 6 AM was intense today 💪',
    timestamp: now - 18 * hour,
    status: 'read',
  },

  // Alex and Maya conversation
  {
    id: 'msg_my1',
    chatId: 'chat_maya',
    senderId: 'user_maya',
    recipientId: 'user_alex',
    text: 'Look at this view from the summit hike yesterday!',
    timestamp: now - 24 * hour,
    status: 'read',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_sarah',
    contactId: 'user_sarah',
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: 'chat_david',
    contactId: 'user_david',
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'chat_elena',
    contactId: 'user_elena',
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'chat_marcus',
    contactId: 'user_marcus',
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'chat_maya',
    contactId: 'user_maya',
    unreadCount: 0,
    isPinned: false,
  },
];

export const SMART_AUTO_REPLIES = [
  "Got it! That sounds great.",
  "Sounds like a plan! Let's touch base soon.",
  "Thanks for letting me know! 👍",
  "Haha totally agree with you on that! 😂",
  "Awesome, I appreciate the quick update!",
  "Sure thing, talk to you in a bit!",
  "Great point! I'll keep that in mind.",
  "Let me check and get right back to you! ⏳",
  "Working on it now, will ping you once done! 🚀",
  "All good on my side! 😊",
];
