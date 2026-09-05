import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  Droplets,
  Bug,
  Leaf,
  Wind
} from 'lucide-react';
import { askBotanistAI } from '../../services/botanistAIService';
import { chatWithGemini } from '../../services/geminiService';
import { StatusBadge } from '../ui';

const SUGGESTION_PROMPTS = [
  {
    icon: Droplets,
    title: 'Watering schedule',
    prompt: 'How often should I water a Neem sapling in summer?',
    hint: 'Deep root zone hydration'
  },
  {
    icon: Leaf,
    title: 'Leaf yellowing',
    prompt: 'Why are my leaves turning yellow at the edges?',
    hint: 'Diagnose chlorosis & deficiency'
  },
  {
    icon: Bug,
    title: 'Pest control',
    prompt: 'Eliminate spider mites organically without harming the tree?',
    hint: 'IPM & neem-oil recipes'
  },
  {
    icon: Wind,
    title: 'High-impact species',
    prompt: 'Which urban species give the highest carbon sequestration per year?',
    hint: 'Top CO₂ performers for campus'
  }
];

const QUICK_PILLS = [
  'Watering schedule for a Neem sapling?',
  'Leaves turning yellow — causes?',
  'How to get rid of spider mites organically?',
  'Signs of root rot and how to save it?',
  'Trees with the highest carbon sequestration?'
];

export default function BotanistChat({ activePlantContext = null }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const isEmpty = messages.length === 0;

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
      let reply = await chatWithGemini(text, messages, activePlantContext);
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
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="card-elevated flex flex-col h-[560px] overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent-border-25)' }}
          >
            <Bot className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-h3 text-fg">Dr. Flora</span>
              <StatusBadge variant="live" label="Online" size="xs" pulse />
            </div>
            <p className="text-[11px] text-fg-subtle mt-0.5">
              {activePlantContext ? `Context: ${activePlantContext.name}` : 'Trained on botanical research'}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Clear conversation"
          className="icon-btn"
          aria-label="Clear conversation"
          disabled={isEmpty}
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Messages / empty hero */}
      <div
        className="flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Conversation with Dr. Flora"
      >
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center px-5 py-6 text-center">
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center mb-4"
              style={{
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border-25)',
              }}
              aria-hidden="true"
            >
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </div>
            <h3 className="text-h2 text-fg">Ask Dr. Flora…</h3>
            <p className="text-body text-fg-muted max-w-sm mt-1.5 leading-relaxed">
              {activePlantContext
                ? `I see you're inspecting ${activePlantContext.name}. Ask anything — species, watering, symptoms, or rescue tactics.`
                : 'Trained on botanical research. Ask about leaf symptoms, watering, pest control, or species selection.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-5">
              {SUGGESTION_PROMPTS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => handleSend(s.prompt)}
                  className="text-left p-3 rounded-md border border-line bg-surface-inset hover:border-line-elev hover:bg-surface-1 transition-colors focus-ring group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                    <span className="text-[12px] font-medium text-fg">{s.title}</span>
                  </div>
                  <p className="text-[11px] text-fg-subtle leading-snug">{s.hint}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 chat-msg-enter ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-surface-elev text-fg-muted border border-line'
                        : ''
                    }`}
                    style={
                      !isUser
                        ? {
                            background: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-border-25)',
                          }
                        : undefined
                    }
                    aria-hidden="true"
                  >
                    {isUser
                      ? <User className="w-3.5 h-3.5" strokeWidth={2} />
                      : <Bot className="w-3.5 h-3.5" strokeWidth={2} />}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-md px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'chat-bubble-user'
                        : 'chat-bubble-bot'
                    }`}
                  >
                    {msg.text}
                    <div className="text-[10px] mt-1.5 font-mono text-fg-subtle">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-2.5 chat-msg-enter">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent-border-25)',
                  }}
                  aria-hidden="true"
                >
                  <Bot className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="chat-bubble-bot rounded-md px-3 py-2.5 flex items-center gap-1" aria-label="Dr. Flora is typing">
                  <span className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-accent" style={{ animationDelay: '150ms' }} />
                  <span className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-accent" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* Quick pills — always visible below messages */}
      <div className="px-4 py-2 border-t border-[#1f1f1f] overflow-x-auto flex items-center gap-2 no-scrollbar">
        {QUICK_PILLS.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="px-3 py-1.5 rounded-full border border-[#262626] bg-[#0a0a0a] hover:bg-[#161616] text-[11px] text-[#a1a1a1] hover:text-white whitespace-nowrap transition-colors shrink-0 focus-ring"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-[#1f1f1f] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Dr. Flora about leaves, watering, tree care…"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          aria-label="Message Dr. Flora"
          className="input flex-1 h-9 px-3 text-[13px]"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          aria-label="Send message"
          className="btn btn-primary w-9 h-9 p-0 disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}