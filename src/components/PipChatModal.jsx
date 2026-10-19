import React, { useState, useRef, useEffect } from 'react';
import { playChimeNote, playBubblePopSound, playHeartPopSound } from '../utils/audio.js';

export const PipChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'pip',
      text: "*Happy chime!* Hello little dreamer! Pip's bedside radio is on. Ask me about tonight's dream inventions, tell me about a sleepy wish, or say goodnight!",
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query || isLoading) return;

    playBubblePopSound(true);

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/pip-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      const replyText = data.reply || "*Snort-giggle!* Pip smiled warmly and tucked a starlight seed beneath your pillow.";

      playChimeNote('C5', 0.6);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-pip-${Date.now()}`,
          sender: 'pip',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source,
        },
      ]);
    } catch {
      playChimeNote('G4', 0.5);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-pip-${Date.now()}`,
          sender: 'pip',
          text: "*Snort-giggle!* Static crackles softly over the dream radio... Pip says: Sleep tight, gentle dreamer, the starlight blanket is safely wrapped!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "What are you building today?",
    "Can you sing a lullaby?",
    "I had a scary dream",
    "How does the cloud glider work?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] w-full sm:max-w-md h-[560px] max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#F3E8DC] flex flex-col overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#faeaf2] via-[#FFF9F2] to-[#FFFAEB] px-4 py-3 border-b border-[#F3E8DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="w-9 h-9 rounded-full bg-[#FFE3E8] flex items-center justify-center text-[#80244a] shadow-xs">
                <span className="material-symbols-outlined text-lg">radio</span>
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-[#3F2837] flex items-center gap-1.5">
                Pip's Bedtime Radio
                <span className="text-[9px] bg-[#80244a] text-white px-1.5 py-0.2 rounded-full font-bold">
                  AI Dialogue
                </span>
              </h3>
              <p className="text-[10px] text-[#62535F]">Room 07 • Live Nursery Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 flex items-center justify-center shadow-xs border border-stone-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 space-y-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${
                m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#80244a] text-white rounded-br-xs'
                    : 'bg-white text-[#3F2837] border border-[#F3E8DC] rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isLoading && (
            <div className="self-start bg-white p-3 rounded-2xl rounded-bl-xs border border-[#F3E8DC] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#80244a] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#80244a] animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-2 h-2 rounded-full bg-[#80244a] animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              <span className="text-xs text-stone-500 italic ml-1">Pip is tapping brass chimes...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-3 py-1.5 bg-[#FFF9F2] border-t border-[#F3E8DC] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p);
              }}
              className="shrink-0 text-[11px] bg-white hover:bg-[#FFE3E8] text-[#80244a] px-2.5 py-1 rounded-full border border-[#F3E8DC] transition-all cursor-pointer whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#F3E8DC] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a cozy message for Pip..."
            className="flex-1 bg-[#FFFDF7] border border-[#F3E8DC] rounded-xl px-3.5 py-2 text-xs text-[#3F2837] focus:outline-none focus:ring-2 focus:ring-[#80244a]/30"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-[#80244a] hover:bg-[#6c1b3d] disabled:bg-stone-300 text-white p-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
