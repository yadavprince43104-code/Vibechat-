import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Phone, Video, MoreVertical, Paperclip, 
  Smile, Mic, Send, Check, CheckCheck, Play, Pause, 
  Image as ImageIcon, Camera, FileText, Sparkles, 
  Trash2, X 
} from 'lucide-react';
import { UserProfile, Message } from '../types';

interface ChatRoomProps {
  currentUser: UserProfile;
  contact: UserProfile;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string, mediaType?: 'image' | 'voice', mediaUrl?: string) => void;
  onBack: () => void;
  onOpenContactInfo: () => void;
  onSwitchToContact: () => void;
  onClearChat: () => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

const QUICK_EMOJIS = ['😊', '😂', '❤️', '👍', '🔥', '🎉', '🥺', '🙏', '☕', '🚀', '👏', '😍'];
const REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
];

export const ChatRoom: React.FC<ChatRoomProps> = ({
  currentUser,
  contact,
  messages,
  isTyping,
  onSendMessage,
  onBack,
  onOpenContactInfo,
  onSwitchToContact,
  onClearChat,
  onReactToMessage,
  onDeleteMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simulate sending a voice note
  const handleSendVoiceNote = () => {
    onSendMessage('Voice message', 'voice', undefined);
  };

  // Send sample photo
  const handleSendSamplePhoto = (url: string) => {
    onSendMessage('Photo shared', 'image', url);
    setShowAttachMenu(false);
  };

  const triggerCallNotice = (type: 'Audio' | 'Video') => {
    setCallNotice(`Calling ${contact.name} (${type} Call)...`);
    setTimeout(() => setCallNotice(null), 3500);
  };

  const formatMsgTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="whatsapp-chat-room" className="flex flex-col h-full bg-[#efeae2] relative overflow-hidden">
      {/* Top Conversation Header */}
      <div className="bg-emerald-700 text-white px-3 py-2 flex items-center justify-between shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-2 min-w-0">
          <button
            id="chat-back-btn"
            onClick={onBack}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
            title="Back to Chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            id="chat-contact-header-info"
            onClick={onOpenContactInfo}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
                referrerPolicy="no-referrer"
              />
              {contact.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-700" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-sm leading-tight text-white truncate">
                {contact.name}
              </h2>
              <p className="text-[11px] text-emerald-100 truncate">
                {isTyping ? (
                  <span className="font-medium text-emerald-200 animate-pulse">typing...</span>
                ) : contact.status === 'online' ? (
                  'online'
                ) : (
                  contact.lastSeen || 'offline'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            id="video-call-btn"
            onClick={() => triggerCallNotice('Video')}
            className="p-2 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
            title="Video Call"
          >
            <Video className="w-4.5 h-4.5" />
          </button>

          <button
            id="audio-call-btn"
            onClick={() => triggerCallNotice('Audio')}
            className="p-2 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
            title="Voice Call"
          >
            <Phone className="w-4.5 h-4.5" />
          </button>

          <div className="relative">
            <button
              id="chat-options-menu-btn"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
              title="More"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-xs font-medium animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    onOpenContactInfo();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <span>View Contact</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    onSwitchToContact();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Switch to {contact.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    if (confirm('Clear chat history with this contact?')) {
                      onClearChat();
                    }
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call toast alert */}
      <AnimatePresence>
        {callNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-4 right-4 z-40 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center justify-between"
          >
            <span>{callNotice}</span>
            <button onClick={() => setCallNotice(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages Container with WhatsApp Wallpaper */}
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-2 relative"
        style={{
          backgroundImage: `radial-gradient(#d1d7db 0.8px, transparent 0.8px)`,
          backgroundSize: '16px 16px',
        }}
      >
        {/* End-to-end encryption pill */}
        <div className="flex justify-center my-2">
          <div className="bg-[#ffeecd] border border-[#f0d8a8] text-[#54656f] text-[11px] px-3 py-1.5 rounded-lg max-w-[85%] text-center shadow-xs">
            🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
          </div>
        </div>

        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="bg-white/85 text-slate-500 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md shadow-xs border border-slate-200/50">
            Today
          </span>
        </div>

        {/* Messages List */}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isReactionOpen = activeReactionMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-xs relative cursor-pointer ${
                  isMe
                    ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                    : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/60'
                }`}
                onClick={() => setActiveReactionMessageId(isReactionOpen ? null : msg.id)}
              >
                {/* Media Image */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="rounded-xl overflow-hidden mb-1.5 border border-slate-200">
                    <img
                      src={msg.mediaUrl}
                      alt="Attachment"
                      className="w-full max-h-60 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Voice Note Simulation */}
                {msg.type === 'voice' ? (
                  <div className="flex items-center gap-2.5 py-1 min-w-[180px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id);
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 hover:bg-emerald-700 shadow-xs"
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-emerald-600 transition-all duration-300 ${
                            playingVoiceId === msg.id ? 'w-full animate-pulse' : 'w-1/3'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        0:{msg.mediaDuration || '04'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words leading-relaxed text-[13px]">
                    {msg.text}
                  </p>
                )}

                {/* Timestamp & Read Status */}
                <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5 select-none">
                  <span className="text-[10px] text-slate-500">
                    {formatMsgTime(msg.timestamp)}
                  </span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>

                {/* Reaction Pill Badge */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div
                    className={`absolute -bottom-2.5 ${
                      isMe ? 'right-2' : 'left-2'
                    } bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-sm text-xs flex items-center gap-0.5`}
                  >
                    {msg.reactions.map((r, i) => (
                      <span key={i}>{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Reaction Picker Tray on Click / Tap */}
              {isReactionOpen && (
                <div
                  className={`absolute -top-9 z-40 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg px-2 py-1 flex items-center gap-1.5 ${
                    isMe ? 'right-0' : 'left-0'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {REACTION_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        onReactToMessage(msg.id, em);
                        setActiveReactionMessageId(null);
                      }}
                      className="hover:scale-125 transition-transform text-sm p-1"
                    >
                      {em}
                    </button>
                  ))}
                  <div className="h-3 w-px bg-slate-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteMessage(msg.id);
                      setActiveReactionMessageId(null);
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Real-time Typing Bubble */}
        {isTyping && (
          <div className="flex items-center gap-1 bg-white border border-slate-200/60 rounded-2xl rounded-tl-xs px-3.5 py-2.5 w-fit shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.18s]" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.36s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Attachment Dropup Menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-16 left-4 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 w-64 space-y-2"
          >
            <p className="text-xs font-semibold text-slate-700 mb-1">Share Attachment</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => handleSendSamplePhoto(SAMPLE_PHOTO_PRESETS[0])}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 text-emerald-700"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Photos</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendSamplePhoto(SAMPLE_PHOTO_PRESETS[1])}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 text-emerald-700"
              >
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Camera</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSendMessage('Document: Project_Brief.pdf', 'text');
                  setShowAttachMenu(false);
                }}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 text-emerald-700"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Document</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Emojis Palette */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-t border-slate-200 px-3 py-2 shrink-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {QUICK_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + em);
                    inputRef.current?.focus();
                  }}
                  className="text-xl p-1.5 hover:scale-125 transition-transform"
                >
                  {em}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Chat Input Bar */}
      <div className="p-2 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2 shrink-0 z-20">
        {/* Emoji Button */}
        <button
          id="chat-emoji-toggle-btn"
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowAttachMenu(false);
          }}
          className={`p-2 rounded-full transition-colors ${
            showEmojiPicker ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 hover:text-slate-700'
          }`}
          title="Emojis"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <button
          id="chat-attach-toggle-btn"
          type="button"
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            setShowEmojiPicker(false);
          }}
          className={`p-2 rounded-full transition-colors ${
            showAttachMenu ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 hover:text-slate-700'
          }`}
          title="Attach"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 bg-white rounded-2xl px-3 py-1.5 border border-slate-200 flex items-center shadow-xs">
          <input
            id="chat-message-input"
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Voice Note or Send Button */}
        {inputText.trim().length > 0 ? (
          <button
            id="chat-send-btn"
            type="button"
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-all"
            title="Send message"
          >
            <Send className="w-4.5 h-4.5 -ml-0.5" />
          </button>
        ) : (
          <button
            id="chat-voice-btn"
            type="button"
            onClick={handleSendVoiceNote}
            className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-all"
            title="Click to send voice message note"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
};
