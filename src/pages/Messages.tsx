import React, { useState, useEffect, useRef } from 'react';
import { store } from '../services/store';
import { Conversation, ChatMessage } from '../types';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Lock, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Messages: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const userId = currentUser?.id || '';

  const conversations = store.getConversationsForUser(userId);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation ? store.getMessagesForConversation(activeConversation.id) : [];

  // Mark as read when conversation is opened
  useEffect(() => {
    if (activeConversationId) {
      store.markMessagesRead(activeConversationId);
    }
  }, [activeConversationId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    store.sendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activeConversationId) return;
    store.sendMessage(activeConversationId, prompt);
  };

  const quickPrompts = [
    'Would Saturday 11:00 AM work for a property walkthrough?',
    'Could you clarify the visitor and quiet hours policy?',
    'Happy to proceed with the 11-month digital lease draft.',
    'Confirming the deposit safeguard terms under Model Tenancy Act.'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Secure Messaging Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct communication unlocked through verified mutual match. Zero broker intermediaries.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
        {/* Left: Conversations List */}
        <div className="border-r border-slate-200/80 p-4 space-y-3 bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            Active Chats ({conversations.length})
          </h2>

          {conversations.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No conversations active yet. Connect through a Mutual Match first!
            </div>
          ) : (
            <div className="space-y-1.5 overflow-y-auto max-h-[520px]">
              {conversations.map((conv) => {
                const isTenant = currentUser?.role === 'tenant';
                const otherPartyName = isTenant ? conv.landlordName : conv.tenantName;
                const otherPartyAvatar = isTenant ? conv.landlordAvatar : conv.tenantAvatar;
                const unreadCount = isTenant ? conv.unreadCountTenant : conv.unreadCountLandlord;
                const isSelected = conv.id === activeConversationId;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white shadow-card border border-teal-200 ring-1 ring-teal-500/20'
                        : 'hover:bg-white/80 border border-transparent'
                    }`}
                  >
                    <img
                      src={otherPartyAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <h3 className="font-bold text-navy-900 text-xs truncate">
                          {otherPartyName}
                        </h3>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700 font-medium truncate">
                        {conv.propertyTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.lastMessageText}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Active Chat Thread */}
        <div className="md:col-span-2 flex flex-col h-[600px] bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.role === 'tenant' ? activeConversation.landlordAvatar : activeConversation.tenantAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-navy-900 text-sm">
                        {currentUser?.role === 'tenant' ? activeConversation.landlordName : activeConversation.tenantName}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <Link
                      to={`/properties/${activeConversation.propertyId}`}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-medium truncate block max-w-sm"
                    >
                      {activeConversation.propertyTitle} (₹{activeConversation.propertyRent.toLocaleString('en-IN')}/mo)
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/leases"
                    className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold border border-teal-200"
                  >
                    View Lease Agreement
                  </Link>
                </div>
              </div>

              {/* Privacy Safeguard Strip */}
              <div className="px-6 py-2 bg-slate-50 text-slate-600 text-[11px] border-b border-slate-100 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>
                  <strong>Encrypted Channel:</strong> Official tenancy communications are timestamped for dispute protection under the Model Tenancy Act.
                </span>
              </div>

              {/* Message Bubbles Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  const isSystem = msg.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl text-xs text-teal-950 text-center max-w-md mx-auto space-y-1">
                        <Sparkles className="w-4 h-4 text-teal-600 mx-auto" />
                        <p>{msg.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-teal-600 text-white rounded-tr-xs shadow-xs'
                            : 'bg-slate-100 text-navy-900 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex gap-2">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-[11px] px-3 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 rounded-full whitespace-nowrap transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message or clarify tenancy conditions..."
                  className="flex-1 text-xs px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-navy-900">Select a conversation to start chatting</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Your conversations are automatically opened once a Mutual Match is established.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
