import { UserProfile, Message, Chat } from '../types';
import { INITIAL_USERS, INITIAL_MESSAGES, INITIAL_CHATS } from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'whatsapp_proto_users_v1',
  ACTIVE_USER_ID: 'whatsapp_proto_active_user_id_v1',
  MESSAGES: 'whatsapp_proto_messages_v1',
  CHATS: 'whatsapp_proto_chats_v1',
  SIMULATION_ENABLED: 'whatsapp_proto_simulation_enabled',
};

// Cross-tab broadcast channel for real-time synchronization
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('whatsapp_prototype_sync');
  } catch {
    syncChannel = null;
  }
}

export const broadcastStateChange = (type: string, payload?: unknown) => {
  if (syncChannel) {
    syncChannel.postMessage({ type, payload });
  }
};

export const subscribeToSync = (callback: (type: string, payload?: unknown) => void) => {
  if (!syncChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      callback(event.data.type, event.data.payload);
    }
  };
  syncChannel.addEventListener('message', handler);
  return () => {
    syncChannel?.removeEventListener('message', handler);
  };
};

export const loadUsers = (): UserProfile[] => {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_USERS;
};

export const saveUsers = (users: UserProfile[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  broadcastStateChange('USERS_UPDATED', users);
};

export const loadActiveUserId = (): string => {
  if (typeof window === 'undefined') return 'user_alex';
  const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
  return id || 'user_alex';
};

export const saveActiveUserId = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
  broadcastStateChange('ACTIVE_USER_CHANGED', id);
};

export const loadMessages = (): Message[] => {
  if (typeof window === 'undefined') return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_MESSAGES;
};

export const saveMessages = (messages: Message[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  broadcastStateChange('MESSAGES_UPDATED', messages);
};

export const loadChats = (): Chat[] => {
  if (typeof window === 'undefined') return INITIAL_CHATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_CHATS;
};

export const saveChats = (chats: Chat[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  broadcastStateChange('CHATS_UPDATED', chats);
};

export const getSimulationEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(STORAGE_KEYS.SIMULATION_ENABLED);
  return val === null ? true : val === 'true';
};

export const setSimulationEnabled = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SIMULATION_ENABLED, String(enabled));
};

// Reset all prototype data to defaults
export const resetToDefaults = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.CHATS);
  broadcastStateChange('RESET_DATA');
};

// Generate consistent chat ID between two participants
export const getChatId = (userA: string, userB: string): string => {
  const sorted = [userA, userB].sort();
  return `chat_${sorted[0]}_${sorted[1]}`;
};
