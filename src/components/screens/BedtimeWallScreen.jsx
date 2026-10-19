import React, { useState, useEffect } from 'react';
import {
  playHeartPopSound,
  playStickerStampSound,
  playBubblePopSound,
} from '../../utils/audio.js';
import { triggerStarConfetti } from '../SparkleCanvas.jsx';

export const BedtimeWallScreen = ({ onIncrementDreams, dreamCount }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Form inputs
  const [visitorName, setVisitorName] = useState('');
  const [visitorCategory, setVisitorCategory] = useState('Sweet Dreams');
  const [selectedSticker, setSelectedSticker] = useState('star');
  const [visitorMessage, setVisitorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // 1. Fetch live wishes from backend API
  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        if (data.wishes) {
          setNotes(data.wishes);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend wishes fetch fallback to local:', e);
    }
    // Fallback if network issue
    const local = localStorage.getItem('pip_guestbook_notes_v3');
    if (local) {
      try {
        setNotes(JSON.parse(local));
      } catch {}
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // 2. Submit new wish to backend API
  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!visitorMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    playStickerStampSound();

    const payload = {
      name: visitorName.trim() || 'Starlight Dreamer',
      type: visitorCategory,
      sticker: selectedSticker,
      message: visitorMessage.trim(),
    };

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.wish) {
          setNotes((prev) => [data.wish, ...prev]);
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Local optimistic fallback
      const fallbackWish = {
        id: `wish-${Date.now()}`,
        name: payload.name,
        type: payload.type,
        sticker: payload.sticker,
        message: payload.message,
        date: 'Just now',
        loves: 1,
      };
      setNotes((prev) => [fallbackWish, ...prev]);
    }

    setVisitorMessage('');
    setVisitorName('');
    setIsSubmitting(false);
    setPostSuccess(true);
    triggerStarConfetti();
    onIncrementDreams?.();
    setTimeout(() => setPostSuccess(false), 3000);
  };

  const handleLoveWish = async (id) => {
    playHeartPopSound();
    triggerStarConfetti();
    onIncrementDreams?.();

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, loves: (n.loves || 1) + 1 } : n))
    );

    try {
      await fetch(`/api/wishes/${id}/love`, { method: 'POST' });
    } catch (e) {
      console.warn('Love sync error:', e);
    }
  };

  const stickers = [
    { id: 'star', symbol: '★', label: 'Starlight' },
    { id: 'moon', symbol: '🌙', label: 'Crescent Moon' },
    { id: 'cloud', symbol: '☁️', label: 'Fluff Cloud' },
    { id: 'heart', symbol: '💖', label: 'Heart Snuggle' },
    { id: 'candy', symbol: '🍬', label: 'Sugar Sleep' },
  ];

  const categories = [
    'all',
    'Sweet Dreams',
    'Lullabies',
    'Nightlight Greetings',
    'Suggestions',
  ];

  const filteredNotes = notes.filter((n) =>
    activeFilter === 'all' ? true : n.type === activeFilter
  );

  return (
    <div className="w-full flex flex-col gap-10 text-white">
      {/* Header Banner */}
      <div className="bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-[#69519A]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#FFEAA7] text-2xl">
              save
            </span>
            <span className="text-xs text-[#FFEAA7] font-bold uppercase tracking-widest">
              💾 memories.exe · Live Dream Guestbook
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-pink-300">
            Bedtime Wall &amp; Sleep Wishes
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl font-sans">
            Leave a cozy note on Pip’s bedtime corkboard. All wishes are saved to the live backend server so visitors across the globe can see your bedtime greetings!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1A1028]/95 px-4 py-2.5 rounded-2xl border border-white/10 shadow-inner self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <div className="text-left">
            <span className="text-[10px] text-purple-300 uppercase block font-bold">
              Live Wishes Saved:
            </span>
            <span className="font-display font-bold text-sm text-[#FFEAA7]">
              {notes.length} Posted Wishes
            </span>
          </div>
        </div>
      </div>

      {/* Guestbook Bento Grid: Form (Left 5 cols) + Sticky Board (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wish Entry Form */}
        <div className="lg:col-span-5 bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 border-2 border-[#69519A]/40 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
            <span className="w-9 h-9 rounded-full bg-[#80244A] text-[#FFEAA7] flex items-center justify-center font-bold shadow-md">
              ✍️
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-pink-300">
                Pin a Bedtime Wish
              </h3>
              <p className="text-[11px] text-purple-200">
                Saves to live server &amp; gives you +1 Dream!
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitWish} className="flex flex-col gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-purple-300 uppercase block mb-1">
                Your Dreamer Name
              </label>
              <input
                type="text"
                maxLength={30}
                placeholder="e.g. Luna the Ghost"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full bg-[#1A1028] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-purple-300 uppercase block mb-1">
                Category
              </label>
              <select
                value={visitorCategory}
                onChange={(e) => setVisitorCategory(e.target.value)}
                className="w-full bg-[#1A1028] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
              >
                <option value="Sweet Dreams">Sweet Dreams</option>
                <option value="Lullabies">Lullabies</option>
                <option value="Nightlight Greetings">Nightlight Greetings</option>
                <option value="Suggestions">Suggestions</option>
              </select>
            </div>

            {/* Sticker Stamp Selection */}
            <div>
              <label className="text-[11px] font-bold text-purple-300 uppercase block mb-1">
                Choose a Bedtime Wax Stamp:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {stickers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      playBubblePopSound(true);
                      setSelectedSticker(s.id);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedSticker === s.id
                        ? 'bg-[#80244A] border-pink-300 scale-105 shadow-md'
                        : 'bg-[#1A1028] hover:bg-[#2D1B4E] border-white/10'
                    }`}
                  >
                    <span className="text-lg block">{s.symbol}</span>
                    <span className="text-[9px] text-purple-300 block truncate">
                      {s.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-purple-300 uppercase block mb-1">
                Sleep Message / Greeting
              </label>
              <textarea
                required
                maxLength={240}
                rows={3}
                placeholder="Share a soothing bedtime thought, thank Pip for a dream, or wish everyone sweet sleep..."
                value={visitorMessage}
                onChange={(e) => setVisitorMessage(e.target.value)}
                className="w-full bg-[#1A1028] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-400"
              />
              <span className="text-[10px] text-purple-400 text-right block mt-0.5">
                {visitorMessage.length} / 240
              </span>
            </div>

            <button
              type="submit"
              disabled={!visitorMessage.trim() || isSubmitting}
              className="w-full py-2.5 bg-[#80244A] hover:bg-[#9e3c62] disabled:bg-purple-900/40 text-white font-headline font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border border-pink-400/30"
            >
              <span className="material-symbols-outlined text-sm text-[#FFEAA7]">push_pin</span>
              <span>
                {postSuccess
                  ? '✨ Pinned to Live Wall!'
                  : isSubmitting
                  ? 'Saving to Backend...'
                  : 'Pin to Bedtime Wall'}
              </span>
            </button>
          </form>
        </div>

        {/* Live Corkboard Sticky Stream */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                  activeFilter === cat
                    ? 'bg-[#80244A] text-white border-pink-300 font-bold shadow-md'
                    : 'bg-[#1A1028] hover:bg-[#2D1B4E] text-purple-200 border-white/10'
                }`}
              >
                {cat === 'all' ? 'All Sleep Wishes' : cat}
              </button>
            ))}
          </div>

          {/* Sticky Notes Grid */}
          {loading ? (
            <div className="bg-[#231538]/90 p-8 rounded-3xl text-center text-xs text-purple-300 border border-white/10">
              Loading live bedtime wall from server...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNotes.map((note, idx) => {
                const tilts = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0'];
                const tilt = tilts[idx % tilts.length];

                return (
                  <div
                    key={note.id}
                    className={`relative bg-[#1A1028]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/15 ${tilt} hover:rotate-0 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group`}
                  >
                    {/* Golden Push Pin at Top */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F7B731] border-2 border-[#1A1028] shadow-[0_0_8px_rgba(247,183,49,0.8)]"></div>

                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#FFEAA7] bg-[#80244A]/50 px-2.5 py-0.5 rounded-full border border-pink-400/20">
                          {note.type}
                        </span>
                        <span className="text-[10px] text-purple-300">{note.date}</span>
                      </div>

                      <p className="text-xs text-purple-100 leading-relaxed font-serif">
                        "{note.message}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-pink-300">{note.name}</span>

                      <button
                        onClick={() => handleLoveWish(note.id)}
                        className="flex items-center gap-1 text-pink-300 hover:scale-110 active:scale-95 transition-transform cursor-pointer px-2.5 py-0.5 rounded-full bg-[#80244A]/40 border border-pink-400/30 shadow-xs"
                        title="Send sweet sleep love"
                      >
                        <span className="material-symbols-outlined text-sm text-pink-300">
                          favorite
                        </span>
                        <span className="font-bold text-[11px]">{note.loves || 1}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
