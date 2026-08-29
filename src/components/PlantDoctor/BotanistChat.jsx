import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Trash2, 
  HelpCircle, 
  MessageSquare,
  Sprout
} from 'lucide-react';
import { askBotanistAI } from '../../services/botanistAIService';
import { chatWithGemini, hasGeminiApiKey } from '../../services/geminiService';

export default function BotanistChat({ activePlantContext = null }) {
  const isGeminiEnabled = hasGeminiApiKey();

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello! I'm **Dr. Flora**, your AI Botanical Specialist 🌿. 

${activePlantContext ? `I see you are inspecting **${activePlantContext.name}**! Ask me anything about its care, watering routines, or symptoms.` : "How can I assist your trees and campus plantation challenges today?"}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const suggestionPills = [
    "Why are my plant's leaves turning yellow?",
    "How often should I water a Neem Tree?",
    "How to eliminate spider mites organically?",
    "Signs of root rot and how to save the plant?",
    "Which trees have the highest carbon sequestration?"
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // 1. Try real Gemini Chat API first
      let reply = await chatWithGemini(text, messages, activePlantContext);
      
      // 2. If no Gemini API key or error, use smart botanical fallback
      if (!reply) {
        reply = await askBotanistAI(text, activePlantContext);
      }

      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: "Conversation cleared. Feel free to ask another botanical question!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[580px]">
      
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-emerald-500/15 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">Dr. Flora AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Online Botanist
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {activePlantContext ? `Context: ${activePlantContext.name}` : "Trained on botanical research & pathology"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            title="Clear Conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all border border-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser 
                  ? 'bg-emerald-500 text-slate-950 font-bold text-xs' 
                  : 'bg-slate-900 border border-emerald-500/30 text-emerald-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                isUser
                  ? 'bg-emerald-600 text-white font-medium shadow-md'
                  : 'bg-slate-900/90 text-slate-200 border border-emerald-500/15 whitespace-pre-wrap'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-2 font-mono ${
                  isUser ? 'text-emerald-200' : 'text-slate-500'
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 rounded-2xl px-4 py-3 border border-emerald-500/15 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggestion Pills */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-emerald-500/10 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {suggestionPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="px-3 py-1 rounded-full bg-slate-900 hover:bg-emerald-950/60 border border-emerald-500/20 hover:border-emerald-400 text-slate-300 hover:text-emerald-300 text-[11px] font-medium whitespace-nowrap transition-all shrink-0"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 sm:p-4 bg-slate-950/80 border-t border-emerald-500/15 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Dr. Flora about yellow leaves, watering, tree care..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="glass-input flex-1 px-4 py-2.5 rounded-xl text-xs"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
