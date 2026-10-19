import React, { useState, useEffect } from 'react';
import {
  playChimeNote,
  playHeartPopSound,
  playStickerStampSound,
  playBubblePopSound,
  playWoodBlockSound,
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

  // 1. Fetch live wishes from backend API (Tier 3)
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

  // 2. Submit new wish to backend API (Tier 3)
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
    if (onIncrementDreams) onIncrementDreams();
    setTimeout(() => setPostSuccess(false), 2200);
  };

  // 3. Increment love on wish (Tier 3 live backend)
  const handleLoveWish = async (id) => {
    playHeartPopSound();
    triggerStarConfetti();
    if (onIncrementDreams) onIncrementDreams();

    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, loves: (n.loves || 0) + 1 } : n))
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
    <div className="w-full flex flex-col gap-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#faeaf2] via-[#FFF9F2] to-[#FFFAEB] rounded-3xl p-6 sm:p-8 border border-[#F3E8DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#80244a] text-2xl">
              edit_note
            </span>
            <span className="text-xs text-[#80244a] font-bold uppercase tracking-widest">
              Live Dream Guestbook · Connected to Express Backend
            </span>
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#3F2837]">
            Bedtime Wall &amp; Sleep Wishes
          </h2>
          <p className="text-xs sm:text-sm text-[#62535F] mt-1 max-w-xl">
            Leave a cozy note on Pip’s bedtime corkboard. All wishes are saved to the live backend server so visitors across the globe can see your bedtime greetings!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#F3E8DC] shadow-xs self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <div className="text-left">
            <span className="text-[10px] text-[#62535F] uppercase block font-bold">
              Live Wishes Saved:
            </span>
            <span className="font-headline font-bold text-sm text-[#80244a]">
              {notes.length} Posted Wishes
            </span>
          </div>
        </div>
      </div>

      {/* Guestbook Bento Grid: Form (Left 4 cols) + Sticky Board (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wish Entry Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-[#ffd9e2] shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#F3E8DC] pb-3">
            <span className="w-8 h-8 rounded-full bg-[#FFE3E8] text-[#80244a] flex items-center justify-center font-bold">
              ✍️
            </span>
            <div>
              <h3 className="font-headline font-bold text-base text-[#3F2837]">
                Pin a Bedtime Wish
              </h3>
              <p className="text-[11px] text-[#62535F]">
                Saves to live server &amp; gives you +1 Dream!
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitWish} className="flex flex-col gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#62535F] uppercase block mb-1">
                Your Dreamer Name
              </label>
              <input
                type="text"
                maxLength={30}
                placeholder="e.g. Luna the Ghost"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full bg-[#FFFDF7] border border-[#F3E8DC] rounded-xl px-3.5 py-2 text-xs text-[#3F2837] focus:outline-none focus:border-[#80244a]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#62535F] uppercase block mb-1">
                Category
              </label>
              <select
                value={visitorCategory}
                onChange={(e) => setVisitorCategory(e.target.value)}
                className="w-full bg-[#FFFDF7] border border-[#F3E8DC] rounded-xl px-3.5 py-2 text-xs text-[#3F2837] focus:outline-none focus:border-[#80244a]"
              >
                <option value="Sweet Dreams">Sweet Dreams</option>
                <option value="Lullabies">Lullabies</option>
                <option value="Nightlight Greetings">Nightlight Greetings</option>
                <option value="Suggestions">Suggestions</option>
              </select>
            </div>

            {/* Sticker Stamp Selection */}
            <div>
              <label className="text-[11px] font-bold text-[#62535F] uppercase block mb-1">
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
                        ? 'bg-[#FFE3E8] border-[#80244a] scale-105 shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-[#F3E8DC]'
                    }`}
                  >
                    <span className="text-lg block">{s.symbol}</span>
                    <span className="text-[9px] text-[#62535F] block truncate">
                      {s.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#62535F] uppercase block mb-1">
                Sleep Message / Greeting
              </label>
              <textarea
                required
                maxLength={240}
                rows={3}
                placeholder="Share a soothing bedtime thought, thank Pip for a dream, or wish everyone sweet sleep..."
                value={visitorMessage}
                onChange={(e) => setVisitorMessage(e.target.value)}
                className="w-full bg-[#FFFDF7] border border-[#F3E8DC] rounded-xl p-3 text-xs text-[#3F2837] focus:outline-none focus:border-[#80244a]"
              />
              <span className="text-[10px] text-stone-400 text-right block mt-0.5">
                {visitorMessage.length} / 240
              </span>
            </div>

            <button
              type="submit"
              disabled={!visitorMessage.trim() || isSubmitting}
              className="w-full py-2.5 bg-[#80244a] hover:bg-[#6c1b3d] disabled:bg-stone-300 text-white font-headline font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">push_pin</span>
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
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                  activeFilter === cat
                    ? 'bg-[#80244a] text-white border-[#80244a] font-bold shadow-2xs'
                    : 'bg-white hover:bg-stone-50 text-[#62535F] border-[#F3E8DC]'
                }`}
              >
                {cat === 'all' ? 'All Sleep Wishes' : cat}
              </button>
            ))}
          </div>

          {/* Sticky Notes Grid */}
          {loading ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-stone-400">
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
                    className={`relative bg-gradient-to-b from-[#FFFDF7] to-white rounded-2xl p-4 shadow-sm border border-[#F3E8DC] ${tilt} hover:rotate-0 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group`}
                  >
                    {/* Cute Push Pin at Top */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#80244a] border-2 border-white shadow-xs"></div>

                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#80244a] bg-[#FFE3E8] px-2 py-0.5 rounded-full">
                          {note.type}
                        </span>
                        <span className="text-[10px] text-stone-400">{note.date}</span>
                      </div>

                      <p className="text-xs text-[#3F2837] leading-relaxed font-serif">
                        "{note.message}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#F3E8DC] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#544247]">{note.name}</span>

                      <button
                        onClick={() => handleLoveWish(note.id)}
                        className="flex items-center gap-1 text-[#80244a] hover:scale-110 active:scale-95 transition-transform cursor-pointer px-2 py-0.5 rounded-full bg-[#FFF5F8] border border-[#ffd9e2]"
                        title="Send sweet sleep love"
                      >
                        <span className="material-symbols-outlined text-sm text-[#80244a]">
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
