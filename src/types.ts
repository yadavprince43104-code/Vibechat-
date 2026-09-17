export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  avatarBg?: string;
  about: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: number; // epoch ms
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'voice' | 'system';
  mediaUrl?: string;
  mediaDuration?: number; // seconds for voice notes
  reactions?: MessageReaction[];
  replyToId?: string;
}

export interface Chat {
  id: string;
  contactId: string; // The other user's ID
  unreadCount: number;
  lastMessage?: Message;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  draftText?: string;
}

export interface NotificationItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  messageText: string;
  timestamp: number;
  chatId: string;
}
